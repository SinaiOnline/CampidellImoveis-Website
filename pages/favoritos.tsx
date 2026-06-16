import ProductCard from '@/components/product-card';
import { Container, Grid } from '@mui/material';
import React from 'react';

import * as PropertyService from "@/services/property";
import Property from '@/types/property';

export const FavoritePropertiesLocalStorageKey = 'favoriteProperties'

const Favoritos = () => {
  const [error, setError] = React.useState<string>()
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading')
  const [properties, setProperties] = React.useState<Property[]>([])

  React.useEffect(() => {
    const favorites = localStorage.getItem(FavoritePropertiesLocalStorageKey)
    if (!favorites) {
      setError("Nenhum imóvel favoritado")
      setStatus('error')
      return
    }

    PropertyService.GetPropertiesByIDs(favorites).then((searchResult) => {
      if (searchResult.properties.length > 0) {
        setProperties(searchResult.properties)
        setStatus('success')
      } else {
        setError("Nenhum imóvel encontrado")
        setStatus('error')
      }
    }).catch((error) => {setError(error); setStatus('error');})
  }, [])

  return (
    <div className="favorites-page">
      <Container className="favorites-page-container">
        <h1>Imóveis favoritos</h1>
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
          status === 'error' ?
          <div className="no-favorites">
            <h6>{error}</h6>
          </div>
          :
          status === 'loading' ?
          <div className="no-favorites">
            <h6>Buscando imóveis favoritos..</h6>
          </div>
          :
          <div className="no-favorites">
            <h6>Nenhum imóvel favorito encontrado</h6>
          </div>
        }
      </Container>
    </div>
  )
}

export default Favoritos