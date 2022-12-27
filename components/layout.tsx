'use client';

import React from "react";
import Head from 'next/head'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({children}: React.PropsWithChildren) {
    return (
        <>
            <Head>
                <title>Samsara</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="Genshin Impact in a Loop. Character banner, weapon banners, resin, and potentially more to come!" />
                <meta name="keywords" content="Genshin, Genshin Impact, banners, characters, weapons, resin, samsara, repeat, loop, history, rundown" />
            </Head>
            <main>
                <Navbar></Navbar>
                {children}
                <Footer></Footer>
            </main>
        </>
    )
}
