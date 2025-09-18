import '@/styles/globals.css'
import React from 'react';
import App, {AppProps} from 'next/app';
import Layout from '@/components/layout';
import ReactGA from 'react-ga4';
import {ThemeProvider} from 'next-themes';

ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_ID ? process.env.NEXT_PUBLIC_ANALYTICS_ID : 'fake');

class MyApp extends App<AppProps> {
    render() {
        const {Component, pageProps} = this.props;

        return (
            <>
                <ThemeProvider 
                    attribute="data-theme" 
                    defaultTheme="dark" 
                    enableSystem={false}
                    disableTransitionOnChange={false}
                    themes={['light', 'dark']}
                >
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
            </>
        );
    }
}

export default MyApp;
