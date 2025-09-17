import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Only set theme if user has a stored preference
                  const stored = localStorage.getItem('theme');
                  if (stored && (stored === 'light' || stored === 'dark')) {
                    document.documentElement.setAttribute('data-theme', stored);
                  }
                  // Otherwise, let CSS media queries handle it naturally
                } catch (e) {
                  // If anything fails, just let CSS handle it
                }
              })();
            `,
          }}
        />
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
