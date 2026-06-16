import ProductCard from '@/components/product-card';
import * as PropertyService from '@/services/property';
import Property from '@/types/property';
import { Container, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

const CodeSearchResults = () => {
  const router = useRouter()
  const [error, setError] = React.useState<string>()
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading')
  const [properties, setProperties] = React.useState<Property[]>([])

  React.useEffect(() => {
    if (!router.query.ids) {
      if (router.isReady) {
        setError("Por favor, informe o código do imóvel")
        setStatus('error')
      }

      return
    }

    PropertyService.GetPropertiesByIDs(router.query.ids as string).then((searchResult) => {
      if (searchResult.properties.length > 0) {
        setProperties(searchResult.properties)
        setStatus('success')
      } else {
        setError("Nenhum imóvel encontrado")
        setStatus('error')
      }
    }).catch((error) => {setError(error); setStatus('error');})
  }, [router])

  return (
    <div className="code-search-page">
      <Container className="code-search-page-container">
        <h1>Resultados da busca</h1>
        {
          status === 'success' && properties.length > 0 ?
          <Grid container spacing={2} paddingBottom={2}>
          {
            properties.map((property, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ProductCard product={property} />
                </Grid>
              )
            })
          }
          </Grid>
          :
          status === 'loading' ?
          <div className="no-code-search">
            <h6>Buscando imóvel..</h6>
          </div>
          :
          <div className="no-code-search">
            <h6>{error}</h6>
          </div>
        }
      </Container>
    </div>
  )
}

export default CodeSearchResults