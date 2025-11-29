import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Workaround for Shiki's tabindex issue #97
export function replaceTabIndex(html: string): string {
  return html.replace(/tabindex="0"/g, 'tabindex="-1"');
}
