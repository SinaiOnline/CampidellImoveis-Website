/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @next/next/no-sync-scripts */

import siteConfig from "@/config";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt" className={`notranslate ${siteConfig.overlayPhotosWithWatermark ? "overlay-photos-with-watermark" : ""}`} translate="no">
      <Head>
        <meta name="google" content="notranslate" />
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      </Head>
      <body>
        {
          siteConfig.googleTagManagerId &&
          <noscript>
            <iframe
              src={"https://www.googletagmanager.com/ns.html?id=" + siteConfig.googleTagManagerId}
              height="0"
              width="0"
              className="display-none-visibility-hidden"
            >

            </iframe>
          </noscript>
        }
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
