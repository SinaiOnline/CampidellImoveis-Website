import { useRouter } from "next/router";
import React from "react";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

import Navbar from "@/components/layout/navbar";
import PropertyFilter from "@/components/more-filters-dialog";
import ProductCard from "@/components/product-card";
import { SearchInput } from "@/components/search";
import {
  PropertySearchFilters,
  PropertySearchResult,
} from "@/types/property-search";
import Loading from "../404";

import MenuBreadcrumb from "@/components/menu-breadcrumb";
import siteConfig from "@/config";
import * as PropertyService from "@/services/property";
import { SinglePropertyOfferType } from "@/types/property-offer-type";

const Index = () => {
  const router = useRouter();
  const { offerType } = router.query;

  const [error, setError] = React.useState<string>();
  const [data, setData] = React.useState<PropertySearchResult>();

  React.useEffect(() => {
    function getData() {
      setError(undefined);
      setData(undefined);

      const filters: PropertySearchFilters = {
        limit: 15,
        sortDir: "DESC",
        ...router.query,
      };

      PropertyService.GetProperties(filters).then((data) => {
        if (data.properties.length === 0) {
          setError("Nenhum imóvel encontrado");
        }

        setData(data);
      }).catch((error) => {
        console.error(error);
        setError("Falha ao buscar imóveis");
      })
    }

    getData();
  }, [router.query]);

  function changeOffer() {
    router.push({ pathname: router.pathname, query: { ...router.query, offerType: offerType == "VENDA" ? "ALUGUEL" : "VENDA" } }, undefined, { shallow: true })
  }

  function handlePagination(_: React.ChangeEvent<unknown>, value: number) {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: value } },
      undefined,
      { shallow: true },
    );
  }

  if (router.isReady && offerType !== "VENDA" && offerType !== "ALUGUEL") {
    return <Loading isLoading={false} />;
  }

  const breadcrumbs = [
    <Link key="1" href="/">
      Início
    </Link>,
    <MenuBreadcrumb offerType={offerType == "VENDA" ? "VENDA" : "ALUGUEL"} key="2" />
  ];

  const PaginationComponent = (
    <Pagination
      count={data?.total_pages || 1}
      siblingCount={1}
      boundaryCount={0}
      variant="outlined"
      shape="rounded"
      page={router.query.page ? parseInt(router.query.page as string) : 1}
      onChange={handlePagination}
      showFirstButton
      showLastButton
      hidePrevButton
      hideNextButton
    />
  );

  const tipOther = (
    siteConfig.supportedOfferTypes === "VENDA_E_ALUGUEL" &&
    <span>
      <br/>
      está buscando imóveis {offerType == "VENDA" ? "para aluguel" : "a venda"}? <span onClick={() => changeOffer()} className="link">clique aqui</span>
    </span>
  )

  function submitSearch(offerType: SinglePropertyOfferType, searchParams?: URLSearchParams) {
    const url = new URL(`/${offerType}/`, window.location.origin);

    if (searchParams) {
      url.search = searchParams.toString();
    }

    router.push({ pathname: url.pathname, query: Object.fromEntries(url.searchParams.entries()) }, undefined, { shallow: true });
  }

  return (
    <>
      <div>
        <Navbar />
        <Container className="properties-page">
          <Breadcrumbs aria-label="breadcrumb"> {breadcrumbs} </Breadcrumbs>
          <div className="filters">
            <div className="search-input-container">
              <SearchInput showSubmitButton onSubmit={(searchParams) => submitSearch(offerType as SinglePropertyOfferType, searchParams)} />
            </div>
            <PropertyFilter />
          </div>
          <div className="title-pagination">
            {
              !error && data?.properties.length == 0 ?
              <h5 className="title">Buscando imóveis para {offerType == "VENDA" ? "VENDA" : "ALUGUEL"}... {tipOther}</h5>
              :
              data &&
              <h5 className="title">{data.total} imóve{data.properties.length != 1 ? "is" : "l"} para {offerType == "VENDA" ? "VENDA" : "ALUGUEL"} encontrados. {tipOther}</h5>
            }
            {PaginationComponent}
          </div>
          {data && data.properties.length > 0 ? (
            <Grid container spacing={2} paddingBottom={2}>
              {data.properties.map((product, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <ProductCard product={product} />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <div className="loading">
              {error ? (
                <Typography marginTop={2} variant="h6" align="center">
                  {error} 😢
                </Typography>
              ) : (
                <>
                  <CircularProgress />
                  <Typography marginTop={2} variant="h6" align="center">
                    Carregando...
                  </Typography>
                </>
              )}
            </div>
          )}
          <div className="pagination-component-container">
            {PaginationComponent}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Index;
