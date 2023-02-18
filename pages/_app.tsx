import '@/styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import React from 'react';
import App, {AppProps} from 'next/app';
import Layout from '@/components/layout';
import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_ID ? process.env.NEXT_PUBLIC_ANALYTICS_ID : 'fake');

class MyApp extends App<AppProps> {
    render() {
        const {Component, pageProps} = this.props;

        return (
            <>
                {/* Add any global styles or other components here */}
                <Layout>
                    <Component {...pageProps} />

                </Layout>
            </>
        );
    }
}

export default MyApp;