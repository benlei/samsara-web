import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script id="firefox-fouc-prevention" strategy="beforeInteractive">
          {/* to prevent Firefox FOUC, this must be here */}
          {`0`}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
