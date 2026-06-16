/* eslint-disable @next/next/no-img-element */
import GetInTouchForm from "@/components/get-in-touch-form";
import Navbar from "@/components/layout/navbar";
import ProductCard from "@/components/product-card";
import PropertyFeatures from "@/components/property-features";
import PropertyPhotoGallery from "@/components/property-photo-gallery";
import siteConfig from "@/config";

import * as PropertyService from "@/services/property";

import Property from "@/types/property";
import { PropertyMetrics } from "@/types/property-metrics";
import { PropertySearchFilters } from "@/types/property-search";
import {
  ContentCopy,
  Email,
  Facebook,
  Favorite,
  FavoriteBorder,
  Share,
  Visibility,
  WhatsApp,
} from "@mui/icons-material";
import {
  Breadcrumbs,
  Button,
  Grid,
  IconButton,
  Link,
  Skeleton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Container from "@mui/material/Container";
import Head from "next/head";
import { GetServerSidePropsContext } from "next/types";
import React from "react";
import Loading from "../404";

const PropertyPage = ({ property }: { property: Property | null }) => {
  // Get target and similar properties
  const [similarProperties, setSimilarProperties] = React.useState<Property[]>(
    [],
  );
  const [isFavorite, setIsFavorite] = React.useState<boolean>(false);
  const [metrics, setMetrics] = React.useState<PropertyMetrics>();
  const [currentUrl, setCurrentUrl] = React.useState<string>("");

  React.useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  React.useEffect(() => {
    function getMetrics(property: Property) {
      PropertyService.GetMetrics(property).then((metrics) => {
        setMetrics(metrics);
      }).catch((error) => {
        console.error(error);
      })
    }

    function getSimilarProperties(property: Property) {
      PropertyService.GetSimilarProperties(property).then((properties) => {
        setSimilarProperties(properties);
      }).catch((error) => {
        console.error(error);
      })
    }

    if (!property) return;

    getMetrics(property);
    getSimilarProperties(property);
    setIsFavorite(PropertyService.IsFavorite(property.codimovel));
  }, [property]);

  React.useEffect(() => {
    if (!property) return;
    PropertyService.RegisterView(property);
  }, [property]);

  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up("md"));

  if (!property) {
    return (
      <Loading
        isLoading={false}
        alternativeMessage="Desculpe, o imóvel que você procura não foi encontrado."
      />
    );
  }

  const breadcrumbs = [
    <Link key="1" href="/">
      Início
    </Link>,
    <Link href={"/" + property.offer_type} key="2">
      {property.offer_type == "VENDA"
        ? "Imóveis para Venda"
        : "Imóveis para Aluguel"}
    </Link>,
    <p key="3">{property.codimovel}</p>,
  ];

  const ldJson = property
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: PropertyService.ConstructTitle(property),
        description:
          property.seo_descricao ||
          `Os melhores imóveis você encontra na ${siteConfig.name}!`,
        url: `${siteConfig.websiteDomain}${property.offer_type}/${property.codimovel}`,
        datePosted: property.cadastro || new Date().toISOString(),
        image: property.imageURLs?.[0] || siteConfig.darkLogo,
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: Number(property.preco).toFixed(2).replace(",", "."),
          businessFunction:
            property.offer_type === "VENDA"
              ? "http://purl.org/goodrelations/Sell"
              : "http://purl.org/goodrelations/LeaseOut",
          availability: "https://schema.org/InStock",
          url: `${siteConfig.websiteDomain}${property.offer_type}/${property.codimovel}`,
        },
        provider: {
          "@type": "RealEstateAgent",
          name: siteConfig.name,
          url: siteConfig.websiteDomain,
          logo: siteConfig.darkLogo,
          telephone: siteConfig.phoneNumbers[0],
          email: siteConfig.emails,
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "numberOfRooms",
            value: 8,
            unitCode: "ROM",
          },
        ],
      }
    : null;

  function toggleFavorite() {
    if (!property) return;

    setIsFavorite(
      PropertyService.IsFavorite(property.codimovel)
        ? PropertyService.UnmarkAsFavorite(property.codimovel)
        : PropertyService.MarkAsFavorite(property.codimovel),
    );
  };

  function registerShare(origin: string) {
    if (!property) return;
    PropertyService.RegisterShare(property, origin).catch(console.error);
  }

  function copyLink() {
    if (!property) {
      alert("Falha ao copiar link");
      return;
    }

    registerShare("Botão 'copiar link' no site")
    const url = new URL(currentUrl);
    url.searchParams.set("cacheBust", Date.now().toString());
    navigator.clipboard.writeText(url.toString());
    setTimeout(() => alert("Link copiado!"), 250);
  }

  return (
    <>
      <Head>
        {property && (
          <>
            <title>
              {PropertyService.ConstructTitle(property)} - {siteConfig.name}
            </title>
            <meta
              property="og:title"
              content={`${PropertyService.ConstructTitle(property)} - ${siteConfig.name}`}
            />
            <meta
              name="title"
              content={
                property.seo_titulo
                  ? property.seo_titulo
                  : `${PropertyService.ConstructTitle(property)} - ${siteConfig.name}`
              }
            />
            <meta
              name="description"
              content={
                property.seo_descricao
                  ? property.seo_descricao
                  : `Os melhores imóveis em Ubatuba você encontra aqui na ${siteConfig.name}!`
              }
            />
            <meta
              name="keywords"
              content={
                property.seo_palavras_chaves
                  ? property.seo_palavras_chaves
                  : `${PropertyService.ConstructTitle(property).replaceAll("m²", " metros quadrados").toLowerCase()}, ${property.imovel.toLowerCase()}, ${property.m2util} metros quadrados, no bairro ${property.bairro.toLowerCase()}, em ${property.cidade.toLowerCase()}, ${"imobiliaria, imoveis, aluguel, locação, venda, casa, apartamento, terreno, condominio".toLowerCase()}`
              }
            />
          </>
        )}
        {ldJson && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
          />
        )}
      </Head>
      <main className="property-page">
        <Navbar />
        <Container sx={{ pt: "18px" }}>
          <Breadcrumbs aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
        </Container>
        <div className="image-container">
          {!property ? (
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height={largeScreen ? "500px" : "300px"}
            />
          ) : (
            <PropertyPhotoGallery
              property={property}
              largeScreen={largeScreen}
            />
          )}
        </div>
        <Container sx={{ width: "100%" }} maxWidth="lg">
          <div>
            {property ? (
              <div className="property-title-share">
                <div className="title">
                  <h1>{PropertyService.ConstructTitle(property)}</h1>
                </div>
                <div className="sharing right-container">
                  <div>
                    <p>
                      <strong>Compartilhe este imóvel</strong>
                    </p>
                    <div className="icons">
                      <IconButton
                        onClick={() => registerShare("Botão 'compartilhar para o facebook' no site.")}
                        href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&t=${PropertyService.ConstructTitle(property)}`}
                        target="_blank"
                      >
                        <Facebook />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          registerShare("Botão 'compartilhar para o whatsapp' no site.");
                          const url = new URL(currentUrl);
                          url.searchParams.set(
                            "cacheBust",
                            Date.now().toString(),
                          );
                          window.open(
                            `https://api.whatsapp.com/send?text=${encodeURIComponent(PropertyService.ConstructTitle(property))}%20-%20${encodeURIComponent(url.toString())}`,
                            "_blank",
                          );
                        }}
                      >
                        <WhatsApp />
                      </IconButton>
                      <IconButton
                        onClick={() => registerShare("Botão 'compartilhar para o email' no site.")}
                        href={`mailto:?subject=${encodeURIComponent(PropertyService.ConstructTitle(property))}&body=${encodeURIComponent(`Aqui está o link para acessar o imóvel: ${currentUrl}`)}`}
                        target="_blank"
                      >
                        <Email />
                      </IconButton>
                      <Tooltip title="Copiar Link">
                        <IconButton onClick={copyLink}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Skeleton variant="text" width="100%" height="200px" />
              </>
            )}
          </div>
          <div className="property-details-container">
            {!property ? (
              <Skeleton variant="rectangular" width="100%" height="100vh" />
            ) : (
              <div className="property-details">
                <Button
                  variant="contained"
                  endIcon={
                    isFavorite ? <Favorite color="error" /> : <FavoriteBorder />
                  }
                  onClick={toggleFavorite}
                >
                  {isFavorite
                    ? "Remover dos Favoritos"
                    : "Adicionar aos Favoritos"}
                </Button>
                <div className="pricing">
                  <p>
                    Valor de{" "}
                    {property.offer_type == "VENDA" ? "Venda" : "Aluguel"}:{" "}
                    <span>{PropertyService.GetFormattedPrice(property)}</span>
                  </p>
                  {Boolean(Number(property.iptu)) && (
                    <p>
                      Valor do IPTU:{" "}
                      <span>
                        {Number(property.iptu).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </p>
                  )}
                  {Boolean(Number(property.condominio)) && (
                    <p>
                      Condomínio:{" "}
                      <span>
                        {Number(property.condominio).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </p>
                  )}
                  <p className="code">Código: {property.codimovel}</p>
                </div>
                <PropertyFeatures property={property} />
                {property.url_video && (
                  <iframe
                    src={property.url_video
                      .replace("/watch?v=", "/embed/")
                      .replace("youtu.be", "youtube.com/embed")
                      .replace("/shorts/", "/embed/")}
                    title="YouTube video player"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; load-video-by-id"
                    allowFullScreen
                    className="video-player"
                  />
                )}
                {property.obs && (
                  <div className="description-container">
                    <h6>Mais sobre este imóvel: </h6>
                    <div
                      className="description"
                      dangerouslySetInnerHTML={{ __html: property.obs }}
                    />
                  </div>
                )}
                <p className="disclaimer">
                  *Os preços e informações poderão sofrer mudanças sem aviso
                  prévio. Por este motivo, solicitamos a confirmação com nossos
                  consultores.
                </p>
              </div>
            )}
            {property ? (
              <div className="right-container">
                <div className="get-in-touch-container">
                  <GetInTouchForm property={property} />
                  {metrics && (
                    <>
                      {metrics.views >= 10 && (
                        <div className="metrics">
                          <Visibility />
                          <div>
                            <b>Visualizações</b>
                            <p>
                              {metrics.views} pessoas visualizaram este imóvel.
                            </p>
                          </div>
                        </div>
                      )}
                      {metrics.shares >= 10 && (
                        <div className="metrics">
                          <Share />
                          <div>
                            <b>Compartilhamentos</b>
                            <p>
                              Este imóvel foi compartilhado {metrics.shares}{" "}
                              vezes.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Skeleton variant="rectangular" width="100%" height="300px" />
            )}
          </div>
          {similarProperties.length > 0 && (
            <div className="similar-properties">
              <h4>Imóveis similares</h4>
              <Grid container spacing={2}>
                {similarProperties.map((property) => (
                  <Grid item key={property.codimovel} xs={12} sm={6} md={4}>
                    <ProductCard product={property} />
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </Container>
      </main>
    </>
  );
};

export default PropertyPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { propertyID, offerType, partner } = context.query;

  const property =
    (await (async function () {
      const filter: PropertySearchFilters = {
        codes: [propertyID as string],
        offerType: offerType as string,
        limit: 1,
      };

      if (partner) {
        filter.partnerId = partner as string;
      }

      try {
        const propertySearchResult = await PropertyService.GetProperties(filter, "bypassProxy");
        if (propertySearchResult.properties.length === 0) {
          throw new Error("Property not found");
        }

        return propertySearchResult.properties[0];
      } catch (error) {
        console.error(error);
        return null;
      }
    })()) || null;

  return {
    props: {
      property,
      queryParams: {
        propertyID,
        offerType,
        partner: partner || null,
      },
    },
  };
}
