import React from "react";
import Head from 'next/head'
import Navbar, {NavbarMobile} from './navbar'
import Footer from './footer'

export default function Layout({children}: React.PropsWithChildren) {
    return (
        <>
            <Head>
                <title>Samsara</title>
                <link rel="icon" href="/favicon.ico"/>
                <meta name="description"
                      content="Genshin Impact in a Loop. Character banner, weapon banners, resin, and potentially more to come!"/>
                <meta name="keywords"
                      content="Genshin, Genshin Impact, banners, characters, weapons, resin, samsara, repeat, loop, history, rundown"/>
                <meta name="viewport"
                      content="width=device-width, initial-scale=.5, maximum-scale=12.0, minimum-scale=.25, user-scalable=yes"/>
                <script>
                    {/*to prevent Firefox FOUC, this must be here*/}
                    0
                </script>
            </Head>
            <main>
                <Navbar/>
                <NavbarMobile/>
                {children}
                <Footer></Footer>
            </main>
        </>
    )
}
