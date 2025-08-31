import React from "react";
import Head from 'next/head'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CookieConsent from "react-cookie-consent";

export default function Layout({children}: React.PropsWithChildren) {
    return (
        <>
            <Head>
                <title>Samsara</title>
                <link rel="icon" href="/favicon.ico"/>
                <meta name="description"
                      content="Genshin Impact and Honkai: Star Rail has featured 5 star and 4 star characters and weapons/lightcones. But how long ago was a certain featured banner ran? Or how often was Favonius Sword run? Come here to find out!"/>
                <meta name="keywords"
                      content="Genshin, Genshin Impact, Honkai Star Rail, star rail, hsr, banners, characters, weapons, lightcones, samsara, repeat, loop, history, summary, rundown"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <main>
                <Navbar/>
                {children}
                <Footer></Footer>
                <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
            </main>
        </>
    )
}
