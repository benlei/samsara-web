import {AppProps} from "next/app";
import React from "react";
import Head from 'next/head'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({children}: React.PropsWithChildren) {
    return (
        <>
            <Head>
                <title>Geshin Impact - Banner History | Samsara</title>
            </Head>
            <main>
                <Navbar></Navbar>
                {children}
                <Footer></Footer>
            </main>
        </>
    )
}
