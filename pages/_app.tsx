import "@/styles/globals.css";

import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Montserrat, Poppins } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import { createTheme, ThemeProvider } from "@mui/material";

import Layout from "../components/layout/layout";

import siteConfig from "@/config";
import * as PropertyService from "@/services/property";
import Property from "@/types/property";
import { setupGlobalErrorLogger } from "@/utils/error-reporter";

const NextNProgress = dynamic(() => import("nextjs-progressbar"));
const FloatingSideMenu = dynamic(() =>
    import("@/components/floating-side-menu")
);
const FloatingWhatsAppButton = dynamic(() =>
    import("@/components/floating-whatsapp.button")
);
const LeadDialogProvider = dynamic(() =>
    import("@/components/lead-dialog-provider")
        .then((mod) => mod.LeadDialogProvider)
);

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            dark: "rgb(var(--secondary))",
            main: "rgb(var(--secondary))",
            light: "rgb(var(--secondary))",
            contrastText: "#fff",
        },
        secondary: {
            dark: "rgb(var(--secondary))",
            main: "rgb(var(--secondary))",
            light: "rgb(var(--secondary))",
            contrastText: "#fff",
        },
        background: {
            default: "rgb(var(--background))",
            paper: "rgb(var(--card-background))",
        },
    },
    components: {
        MuiContainer: {
            defaultProps: {
                maxWidth: "xl",
            },
        },
    },
});

const montserrat = Montserrat({
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    variable: "--font-montserrat",
    display: "swap",
});

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    variable: "--font-poppins",
    display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    React.useEffect(() => {
        if (!siteConfig.facebookPixelId) return;

        import("react-facebook-pixel").then((x) => {
            const ReactPixel = x.default;
            ReactPixel.init(siteConfig.facebookPixelId!);
            ReactPixel.pageView();

            const handleRouteChange = () => ReactPixel.pageView();
            router.events.on("routeChangeComplete", handleRouteChange);
            return () =>
                router.events.off("routeChangeComplete", handleRouteChange);
        });
    }, [router.events]);

    React.useEffect(() => {
        if (!siteConfig.googleTagManagerId) return;

        (function (w: any, d: Document, s: string, l: string, i: string) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

            const f = d.getElementsByTagName(s)[0];
            if (!f) return; // safety check

            const j = d.createElement(s);
            const dl = l !== "dataLayer" ? `&l=${l}` : "";
            (j as any).async = true;
            (j as any).src =
                `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
            f.parentNode?.insertBefore(j, f);
        })(
            window,
            document,
            "script",
            "dataLayer",
            siteConfig.googleTagManagerId!,
        );
    }, []);

    React.useEffect(() => {
        if (siteConfig.reportErrorsToBackend) {
            setupGlobalErrorLogger();
        }
    }, []);

    const property: Property | undefined = pageProps?.property;
    const propertyId: string | undefined = pageProps?.queryParams?.propertyID;
    const offerType: string | undefined = pageProps?.queryParams?.offerType;

    const title = React.useMemo(() => {
        if (!propertyId) return siteConfig.name;
        return `Imóvel ${propertyId} - Imobiliaria ${siteConfig.name}`;
    }, [propertyId]);

    const description = React.useMemo(() => {
        if (!propertyId) {
            return `As melhores opções para ${
                siteConfig.supportedOfferTypes === "VENDA"
                    ? "venda"
                    : siteConfig.supportedOfferTypes === "ALUGUEL"
                    ? "locação"
                    : "venda ou locação"
            } você encontra aqui na ${siteConfig.name}!`;
        }
        return `Imóvel ${propertyId} - Imobiliaria ${siteConfig.name}`;
    }, [propertyId]);

    const image = React.useMemo(() => {
        if (!property) {
            return siteConfig.openGraphLogo ||
                siteConfig.websiteDomain + siteConfig.darkLogo;
        }
        return PropertyService.GetSharingPicture(property);
    }, [property]);

    const imageAlt = React.useMemo(() => {
        if (!propertyId) return siteConfig.name;
        return `Imóvel ${propertyId} - Imobiliaria ${siteConfig.name}`;
    }, [propertyId]);

    const url = React.useMemo(() => {
        if (!propertyId || !offerType) return siteConfig.websiteDomain;
        return `${siteConfig.websiteDomain}/${offerType}/${propertyId}`;
    }, [propertyId, offerType]);

    return (
        <>
            <Head>
                <link rel="canonical" href={url} />
                <title>{`${siteConfig.name}`}</title>

                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="author" content="Sinaionline Sistemas" />
                <meta name="robots" content="index,follow" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <meta name="title" content={title} />
                <meta name="description" content={description} />
                <meta
                    name="keywords"
                    content={siteConfig.name +
                        ", imobiliaria, imoveis, aluguel, locação, venda, casa, apartamento, terreno, condominio"}
                />

                <meta property="og:title" content={title} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={url} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:image:alt" content={imageAlt} />
                <meta property="og:image:type" content="image/png" />

                <meta name="twitter:title" content={title} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
                <meta name="twitter:image:alt" content={imageAlt} />

                <link rel="apple-touch-icon" href="/apple-touch-icon.png">
                </link>

                {siteConfig.googleSiteVerificationId &&
                    (
                        <meta
                            name="google-site-verification"
                            content={siteConfig.googleSiteVerificationId}
                        />
                    )}
                {siteConfig.facebookDomainVerificationId &&
                    (
                        <meta
                            name="facebook-domain-verification"
                            content={siteConfig.facebookDomainVerificationId}
                        />
                    )}
            </Head>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
            :root {
              --font-montserrat: ${montserrat.style.fontFamily};
              --font-poppins: ${poppins.style.fontFamily};
            }
          `,
                }}
            />
            <NextNProgress
                color="var(--secondary-color)"
                showOnShallow={false}
            />
            <ThemeProvider theme={theme}>
                <LeadDialogProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                    <FloatingSideMenu />
                    <FloatingWhatsAppButton />
                </LeadDialogProvider>
            </ThemeProvider>
        </>
    );
}
