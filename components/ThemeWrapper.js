'use client'

import {useEffect, useState} from "react";
import {useTheme} from "nextra-theme-docs";

export const ThemeWrapper = ({ childrenInLightTheme, childrenInDarkTheme }) => {
    const { theme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState(theme);

    useEffect(() => {
        if (theme === 'system') {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const updateTheme = () => setCurrentTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
            updateTheme();
            darkModeMediaQuery.addEventListener('change', updateTheme);

            return () => darkModeMediaQuery.removeEventListener('change', updateTheme);
        } else {
            setCurrentTheme(theme);
        }
    }, [theme]);

    const children = currentTheme === 'light'
        ? childrenInLightTheme
        : childrenInDarkTheme;

    return (
        <>
            {children}
        </>
    );
}

// 同时保留默认导出以兼容可能的其他导入方式
export default ThemeWrapper;