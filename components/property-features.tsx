import Property from "@/types/property";
import Bed from "@mui/icons-material/Bed";
import Celebration from "@mui/icons-material/Celebration";
import Chair from "@mui/icons-material/Chair";
import CropFree from "@mui/icons-material/CropFree";
import Elevator from "@mui/icons-material/Elevator";
import Garage from "@mui/icons-material/Garage";
import Key from "@mui/icons-material/Key";
import Pool from "@mui/icons-material/Pool";
import Shower from "@mui/icons-material/Shower";
import SportsBasketball from "@mui/icons-material/SportsBasketball";
import SportsHandball from "@mui/icons-material/SportsHandball";
import VideogameAsset from "@mui/icons-material/VideogameAsset";
import { Grid, Typography } from "@mui/material";

const PropertyFeatures = ({ property }: { property: Property }) => {
  return (
    <div className="property-features-card">
      <Grid
        container
        spacing={4}
        justifyContent={"flex-start"}
        alignItems={"center"}
        height={"100%"}
      >
        <PropertyFeature muiIcon={<Bed />}>
          {property.quartos}{" "}
          {Number(property.quartos) === 1 ? "Quarto" : "Quartos"}
        </PropertyFeature>
        <PropertyFeature muiIcon={<Chair />}>
          {property.salas} {Number(property.salas) === 1 ? "Sala" : "Salas"}
        </PropertyFeature>
        <PropertyFeature muiIcon={<Shower />}>
          {property.banho}{" "}
          {Number(property.banho) === 1 ? "Banheiro" : "Banheiros"}{" "}
          <Typography component="span" sx={{ fontSize: "0.8em" }}>
            ({property.suites}{" "}
            {Number(property.suites) === 1 ? "Suite" : "Suites"})
          </Typography>
        </PropertyFeature>
        <PropertyFeature muiIcon={<Garage />}>
          {property.garagens}{" "}
          {Number(property.garagens) === 1 ? "Vaga" : "Vagas"}
        </PropertyFeature>
        {Number(property.elevadores) > 0 && (
          <PropertyFeature muiIcon={<Elevator />}>Elevador</PropertyFeature>
        )}
        {Number(property.piscina) > 0 && (
          <PropertyFeature muiIcon={<Pool />}>Piscina</PropertyFeature>
        )}
        {Number(property.arprivativa) > 0 && (
          <PropertyFeature muiIcon={<Key />}>Área Privativa</PropertyFeature>
        )}
        {Number(property.esportes) > 0 && (
          <PropertyFeature muiIcon={<SportsBasketball />}>
            Área de Esportes
          </PropertyFeature>
        )}
        {Number(property.salafestas) > 0 && (
          <PropertyFeature muiIcon={<Celebration />}>
            Salas de Festas
          </PropertyFeature>
        )}
        {Number(property.salajogos) > 0 && (
          <PropertyFeature muiIcon={<VideogameAsset />}>
            Salas de Jogos
          </PropertyFeature>
        )}
        {Number(property.arlazer) > 0 && (
          <PropertyFeature muiIcon={<SportsHandball />}>
            Área de Lazer
          </PropertyFeature>
        )}
        <PropertyFeature muiIcon={<CropFree />}>
          Área Útil
          <br /> {property.m2util}m²
        </PropertyFeature>
        {Number(property.m2terreno) > 0 && (
          <PropertyFeature muiIcon={<CropFree />}>
            Área do Terreno
            <br /> {property.m2terreno}m²
          </PropertyFeature>
        )}
      </Grid>
    </div>
  );
};

const PropertyFeature = ({
  muiIcon,
  children,
}: {
  muiIcon?: React.ReactElement;
  children: React.ReactNode;
}) => {
  return (
    <Grid item xs={6} md={3} sx={{ textAlign: "center" }}>
      <div className="property-feature">
        {muiIcon}
        {children}
      </div>
    </Grid>
  );
};

export default PropertyFeatures;
