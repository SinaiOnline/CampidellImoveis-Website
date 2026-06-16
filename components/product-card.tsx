import Link from "next/link";

import Bed from "@mui/icons-material/Bed";
import Chair from "@mui/icons-material/Chair";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Garage from "@mui/icons-material/Garage";
import Shower from "@mui/icons-material/Shower";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import ProductImage from "./product-image";

import * as PropertyService from "@/services/property";
import Property from "@/types/property";

const ProductCard = ({
  product,
  disableSwipe,
}: {
  product: Property;
  disableSwipe?: boolean;
}) => {
  const url = PropertyService.GetURL(product);

  return (
    <Link className="product-card" href={url}>
      <ProductImage disableSwipe={disableSwipe} product={product} />
      <Divider />
      <div className="product-info">
        <div className="title">
          <strong>{product.card_title}</strong>
          <p>
            <span className="price">
              {PropertyService.GetFormattedPrice(product)}
            </span>{" "}
            | {product.offer_type == "VENDA" ? "Venda" : "Aluguel"}
          </p>
        </div>
        <div className="features-actions">
          <Stack className="features" direction="row">
            <Tooltip title="Quartos" arrow>
              <div>
                <p>{product.quartos}</p>
                <Bed />
              </div>
            </Tooltip>
            <Tooltip title="Salas" arrow>
              <div>
                <p>{product.salas}</p>
                <Chair />
              </div>
            </Tooltip>
            <Tooltip title="Banheiros" arrow>
              <div>
                <p>{product.banho}</p>
                <Shower />
              </div>
            </Tooltip>
            <Tooltip title="Vagas" arrow>
              <div>
                <p>{product.garagens}</p>
                <Garage />
              </div>
            </Tooltip>
          </Stack>
          <Divider orientation="horizontal" flexItem />
          <Button
            color="inherit"
            endIcon={<ChevronRight />}
            variant="text"
            fullWidth
          >
            Saiba Mais
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
