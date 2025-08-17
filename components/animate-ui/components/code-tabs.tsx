'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { cn, replaceTabIndex } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsContents, type TabsProps } from '@/components/animate-ui/components/tabs';
import { CopyButton } from '@/components/animate-ui/buttons/copy';

type CodeItem = {
  name: string;
  lang?: string;
  code: string;
};

type CodeTabsProps = {
  codes: CodeItem[];
  themes?: {
    light: string;
    dark: string;
  };
  copyButton?: boolean;
  onCopy?: (content: string) => void;
} & Omit<TabsProps, 'children'>;

/**
 * Note: 在 MDX 文档中使用该组件时需要包裹一层 Wrapper，从内部传入 Props，以确保正确渲染代码块中的缩进。
 *
 * Refs: #99
 */
function CodeTabs({
  codes,
  themes = {
    light: 'github-light',
    dark: 'github-dark'
  },
  className,
  defaultValue,
  value,
  onValueChange,
  copyButton = true,
  onCopy,
  ...props
}: CodeTabsProps) {
  const { resolvedTheme } = useTheme();

  const [highlightedCodes, setHighlightedCodes] = React.useState<Record<string, string> | null>(null);
  const [selectedCode, setSelectedCode] = React.useState<string>(value ?? defaultValue ?? codes[0]?.name ?? '');

  React.useEffect(() => {
    async function loadHighlightedCode() {
      try {
        const { codeToHtml } = await import('shiki');
        const newHighlightedCodes: Record<string, string> = {};

        for (const codeItem of codes) {
          const highlighted = await codeToHtml(codeItem.code, {
            lang: codeItem.lang || codeItem.name.toLowerCase(),
            themes: {
              light: themes.light,
              dark: themes.dark
            },
            defaultColor: resolvedTheme === 'dark' ? 'dark' : 'light'
          });

          newHighlightedCodes[codeItem.name] = replaceTabIndex(highlighted);
        }

        setHighlightedCodes(newHighlightedCodes);
      } catch (error) {
        console.error('Error highlighting codes', error);
        // 降级处理：创建简单的文本映射
        const fallbackCodes: Record<string, string> = {};
        codes.forEach((item) => {
          fallbackCodes[item.name] = item.code;
        });
        setHighlightedCodes(fallbackCodes);
      }
    }
    loadHighlightedCode();
  }, [resolvedTheme, themes.light, themes.dark, codes]);

  return (
    <Tabs
      data-slot="install-tabs"
      className={cn('w-full gap-0 bg-muted/50 rounded-xl border overflow-hidden', className)}
      {...props}
      value={selectedCode}
      onValueChange={(val) => {
        setSelectedCode(val);
        onValueChange?.(val);
      }}
    >
      <TabsList
        data-slot="install-tabs-list"
        className="w-full relative justify-between rounded-none h-10 bg-muted border-b border-border/75 dark:border-border/50 text-current py-0 px-4"
        activeClassName="rounded-none shadow-none bg-transparent after:content-[''] after:absolute after:inset-x-0 after:h-0.5 after:bottom-0 dark:after:bg-white after:bg-black after:rounded-t-full"
      >
        <div className="flex gap-x-3 h-full">
          {highlightedCodes &&
            Object.keys(highlightedCodes).map((code) => (
              <TabsTrigger key={code} value={code} className="text-muted-foreground data-[state=active]:text-current px-0">
                {code}
              </TabsTrigger>
            ))}
        </div>

        {copyButton && highlightedCodes && (
          <CopyButton content={codes.find((item) => item.name === selectedCode)?.code || ''} size="sm" variant="ghost" className="-me-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/10" onCopy={onCopy} />
        )}
      </TabsList>
      <TabsContents data-slot="install-tabs-contents">
        {highlightedCodes &&
          Object.entries(highlightedCodes).map(([code, val]) => (
            <TabsContent data-slot="install-tabs-content" key={code} className="w-full text-sm flex items-center p-4 overflow-auto" value={code}>
              <div className="[&>pre,_&_code]:!bg-transparent [&>pre,_&_code]:[background:transparent_!important] [&>pre,_&_code]:border-none [&_code]:!text-[13px]" dangerouslySetInnerHTML={{ __html: val }} />
            </TabsContent>
          ))}
      </TabsContents>
    </Tabs>
  );
}

export { CodeTabs, type CodeTabsProps, type CodeItem };
