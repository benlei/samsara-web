import '@/styles/globals.css'
import React from 'react';
import App, {AppProps} from 'next/app';
import Layout from '@/components/layout';
import ReactGA from 'react-ga4';
import {ThemeProvider} from 'next-themes';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '@/lib/theme';
import { useTheme } from 'next-themes';

ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_ID ? process.env.NEXT_PUBLIC_ANALYTICS_ID : 'fake');

function AppContent(props: AppProps) {
    const { theme, systemTheme } = useTheme();
    
    // Determine the effective theme considering system preference
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    const muiTheme = effectiveTheme === 'dark' ? darkTheme : lightTheme;

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Layout>
                <props.Component {...props.pageProps} />
            </Layout>
        </MuiThemeProvider>
    );
}

class MyApp extends App<AppProps> {
    render() {
        const {Component, pageProps, router} = this.props;

        return (
            <>
                {/* Add any global styles or other components here */}
                <ThemeProvider 
                    attribute="data-theme" 
                    defaultTheme="system" 
                    enableSystem={true}
                    disableTransitionOnChange={false}
                >
                    <AppContent Component={Component} pageProps={pageProps} router={router} />
                </ThemeProvider>
            </>
        );
    }
}

export default MyApp;
