import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { LastUpdated } from 'nextra-theme-docs'
 
export const metadata = {
  title: 'Linux Do Wiki',
  description: 'Linux Do Wiki',
  icons: {
    icon: '/favicon.ico',
  },
}

// 横幅
const banner = <Banner storageKey="some-key">Linux Do Wiki is released 🎉</Banner>

// 导航栏
const navbar = (
  <Navbar
    logo={
      <div className='flex items-center gap-2'>
        <Image src="/favicon.ico" alt="Linux Do Wiki" width={32} height={32} /> 
        <b>Linux Do Wiki</b>
      </div>
    }
    projectLink="https://github.com/Chenyme/linux-do-wiki"
  />
)

// 搜索
const search = (
  <Search 
    emptyResult="没有找到结果"
    errorText="搜索失败"
    loading="加载中..."
    placeholder="搜索文档..."
  />
)

// 页脚
const footer = <Footer>
  <div className='flex flex-col'>
    <div>Powered by 
      <Link href="https://github.com/Chenyme" target="_blank" className='font-bold ml-1'>@Chenyme</Link>
    </div>
    <div>{new Date().getFullYear()} © Linux Do Wiki.</div>
  </div>
</Footer>
 
export default async function RootLayout({ children }) {
  return (
    <html
      lang="zh-CN"
      dir="ltr"
      suppressHydrationWarning
    >
      <Head
      >
        <meta name="description" content="Linux Do Wiki" />
        <meta name="keywords" content="Linux Do Wiki" />
        <meta name="author" content="Linux Do Wiki" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          search={search}
          docsRepositoryBase="https://github.com/Chenyme/linux-do-wiki"
          footer={footer}
          darkMode={true}
          editLink="编辑此页面"
          feedback={{
            content: '有问题？给我提个 issue 吧！',
          }}
          sidebar={{
            defaultMenuCollapseLevel: 2,
          }}
          lastUpdated={<LastUpdated locale="zh-CN">最近更新时间：</LastUpdated>}
          themeSwitch={{
            dark: '深色模式',
            light: '浅色模式',
            system: '跟随系统',
          }}
          toc={{
            backToTop: '返回顶部',
            title: '在此页中',
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}