import dynamic from "next/dynamic";
import Head from "next/head";

import SectionLoading from "@/components/section-loading";
import siteConfig from "@/config";

import * as PropertyService from "@/services/property";
import Property from "@/types/property";
import { PropertySearchFilters } from "@/types/property-search";
import { GetServerSideProps } from "next";

const Header = dynamic(() => import("@/components/header"), { ssr: true });
const ProductGrid = dynamic(() => import("@/components/product-grid"), {ssr: true});
const AboutSection = dynamic(() => import("@/components/about-section"), {ssr: false});
const BlogPostsSection = dynamic(() => import("@/components/blog-posts-section"), {ssr: false});

type HomeProps = {
  forSale: Property[];
  latest: Property[];
};

export default function Home({ forSale, latest }: HomeProps) {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
          {
            "@context": "https://schema.org",
            "@type": "RealEstateAgency",
            "name": "${siteConfig.name}",
            "description": "As melhores opções para ${siteConfig.supportedOfferTypes === "VENDA" ? "venda" : siteConfig.supportedOfferTypes === "ALUGUEL" ? "locação" : "venda ou locação"} você encontra aqui na ${siteConfig.name}!",
            "url": "${siteConfig.websiteDomain}",
            "logo": "${siteConfig.websiteDomain + siteConfig.darkLogo}",
            "areaServed": "Belo Horizonte, MG",
            "telephone": "${siteConfig.phoneNumbers?.[0]?.number}",
            "email": "${siteConfig.emails}",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "${siteConfig.address}",
              "addressCountry": "BR"
            },
            "image": "${siteConfig.websiteDomain + siteConfig.darkLogo}",
            "openingHours": "Mo-Fr 09:00-18:00"
          }
        `,
          }}
        ></script>
      </Head>
      <main>
        <Header />
        {Array.isArray(forSale) ? (
          <ProductGrid
            products={forSale}
            title="Imóveis em Destaque"
            seeMoreLink="/VENDA"
          />
        ) : (
          <SectionLoading />
        )}
        {Array.isArray(latest) ? (
          <ProductGrid products={latest} title="Últimos Imóveis" />
        ) : (
          <SectionLoading />
        )}
        <BlogPostsSection />
        <AboutSection />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  async function getProperties(
    filters: PropertySearchFilters,
  ): Promise<Property[]> {
    const propertySearchResult = await PropertyService.GetProperties(filters, "bypassProxy");
    if (propertySearchResult.properties?.length === 0) {
      return [];
    }
    return propertySearchResult.properties;
  }

  const [forSale, latest] = await Promise.all([
    getProperties({
      offerType: "VENDA",
      limit: 12,
      randomOrder: true,
      isHighlight: true,
    }),
    getProperties({
      limit: 6,
      sortBy: "registerDate",
      sortDir: "DESC",
    }),
  ]);

  return {
    props: {
      forSale,
      latest,
    },
  };
};