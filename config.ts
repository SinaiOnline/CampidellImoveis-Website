import {
  PropertyOfferTypes,
  SinglePropertyOfferType,
} from "./types/property-offer-type";

const siteConfig: SiteConfig = {
    code: 4268,
    name: "Sandro Weslley Negócios Imobiliários",
    address: ["Rua Dr. Michael Hannas, nº 50, Bairro Vale Verde, em Manhuaçu"],
    websiteDomain: "https://sandroweslleyimoveis.com.br",
    darkLogo: "/logo/logo-dark.webp",
    lightLogo: "/logo/logo-light.webp",
    header: {
        title: "Aqui você encontra o imóvel perfeito para você!",
        subtitle: "",
        backgroundVideo: "/banner.mp4",
    },
    emails: [
        {
            address: "sandroweslley@gmail.com",
        },
    ],
    phoneNumbers: [
        {
            number: "(33) 98851-8300",
        },
    ],
    whatsapp: [
        {
            number: "(33) 98851-8300",
        },
    ],
    supportedOfferTypes: "VENDA_E_ALUGUEL",
    defaultOfferType: "VENDA",
    overlayPhotosWithWatermark: false,
    showBlog: true
};

interface SiteConfigBase {
    code: number;
    name: string;
    address: string[];
    websiteDomain: string;
    darkLogo: string;
    lightLogo: string;
    creci?: string;
    openGraphLogo?: string;
    phoneNumbers: { label?: string; number: string }[];
    emails: { label?: string; address: string }[];
    whatsapp: { label?: string; number: string }[];
    instagram?: string; // ex: @minhaimobiliaria
    facebook?: string; // ex: https://facebook.com/minhaimobiliaria
    header: {
        title: string;
        subtitle: string;
        backgroundVideo?: string;
        backgroundImage?: string;
    };
    aboutSection?: {
        title: string;
        description: string;
        image: string;
    };
    showActionsSection?: boolean;
    showcaseExclusiveProperties?: boolean;
    showcaseTopProperties?: boolean;
    showcasePenthouses?: boolean;
    showBlog?: boolean;
    googleTagManagerId?: string;
    googleSiteVerificationId?: string;
    facebookPixelId?: string;
    facebookDomainVerificationId?: string;
    supportedOfferTypes: PropertyOfferTypes;
    defaultOfferType: SinglePropertyOfferType;
    reportErrorsToBackend?: boolean;
    overlayPhotosWithWatermark?: boolean;
}

type SiteConfig =
    | (SiteConfigBase & {
        supportedOfferTypes: "VENDA";
        defaultOfferType?: "VENDA";
    })
    | (SiteConfigBase & {
        supportedOfferTypes: "ALUGUEL";
        defaultOfferType?: "ALUGUEL";
    })
    | (SiteConfigBase & {
        supportedOfferTypes: "VENDA_E_ALUGUEL";
        defaultOfferType: SinglePropertyOfferType;
    });

export default siteConfig;

export function getDefaultOfferType(
    config: SiteConfig,
): SinglePropertyOfferType {
    switch (config.supportedOfferTypes) {
        case "VENDA":
            return "VENDA";
        case "ALUGUEL":
            return "ALUGUEL";
        case "VENDA_E_ALUGUEL":
            return config.defaultOfferType;
    }
}
