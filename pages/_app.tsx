import '@/styles/globals.css'
import '@/styles/semantic.css'
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
                {/* Add any global styles or other components here */}
                <Layout>
                    <ThemeProvider defaultTheme={'light'} enableSystem={false}>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </Layout>
            </>
        );
    }
}

export default MyApp;