import Property from "@/types/property";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import ProductCard from "./product-card";

const ProductGrid = ({ products, title, seeMoreLink }: { products: Property[], title: string, seeMoreLink?: string }) => {
  if (products.length === 0) {
    return null
  }

  return (
    <Container sx={{ display: "flex" }} className="product-grid section">
      <h2>{title}</h2>
      <Grid container spacing={3}>
        {
          products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProductCard key={index} product={product} />
            </Grid>
          ))
        }
      </Grid>
      {seeMoreLink && <Link href={seeMoreLink} className="more">Ver mais</Link>}
    </Container>
  )
}

export default ProductGrid
