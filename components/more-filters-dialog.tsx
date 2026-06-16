/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { PropertySearchFilters } from "@/types/property-search";
import { Close, FilterAlt } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  TextField,
  Tooltip
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import PriceField from "./masked-price-field";

export interface FilterRef {
  setOpen: (open: boolean) => void;
}

const PropertyFilter = React.forwardRef<
  FilterRef,
  { openButton?: React.ReactNode; smallButton?: boolean }
>(
  (
    {
      openButton,
    }: { openButton?: React.ReactNode; smallButton?: boolean },
    ref,
  ) => {
    const router = useRouter();

    const [open, setOpen] = React.useState(false);
    React.useImperativeHandle<FilterRef, FilterRef>(ref, () => ({
      setOpen,
    }));

    const [filters, setFilters] = React.useState<PropertySearchFilters>({});

    React.useEffect(() => {
      // Spread router.query excluding 'offerType' and 'searchTerm'
      const { offerType, searchTerm, ...filteredQuery } = router.query;

      // Split neighborhoods if it exists
      const neighborhoods =
        (router.query.neighborhoods as string)?.split(",") || [];

      // Split propertyTypes if it exists
      const propertyTypes =
        (router.query.propertyTypes as string)?.split(",") || [];

      // Merge with current filters using spread operator
      setFilters((prev) => ({
        ...prev,
        ...filteredQuery,
        neighborhoods,
        propertyTypes,
      }));

      return () => setFilters({});
    }, [open, router.query]);

    function applyFilters() {
      const query: any = { ...router.query }; // start with what's already in the URL

      if (filters.bedrooms) query.bedrooms = String(filters.bedrooms) 
      else delete query.bedrooms;

      if (filters.minPrice) query.minPrice = String(filters.minPrice);
      else delete query.minPrice;

      if (filters.maxPrice) query.maxPrice = String(filters.maxPrice);
      else delete query.maxPrice;

      if (filters.minArea) query.minArea = String(filters.minArea);
      else delete query.minArea;

      if (filters.garages) query.garages = String(filters.garages);
      else delete query.garages;

      // Reset pagination when filters change
      query.page = 1;

      router.push(
        {
          pathname: router.asPath.split("?")[0],
          query,
        },
        undefined,
        { shallow: true },
      );

      setOpen(false);
    }

    function resetFilters() {
      setFilters({});
      router.push(
        {
          pathname: router.pathname,
          query: { offerType: router.query.offerType },
        },
        undefined,
        { shallow: true },
      );
      setOpen(false);
    }

    function handleNumericChange(
      key: keyof PropertySearchFilters,
      value: string,
    ) {
      const num = value ? parseInt(value) : undefined;
      setFilters((prev) => ({ ...prev, [key]: num }));
    }

    const relevantFilterKeys = ["bedrooms", "minPrice", "maxPrice", "minArea", "maxArea", "garages"];

    return (
      <div className="property-filter">
        <Tooltip title="Mais Filtros">
          <Badge
            color="primary"
            badgeContent={relevantFilterKeys.reduce((count, key) => {
              const value = filters[key];
              if (value === undefined || value === "" || value === 0)
                return count;
              return count + 1;
            }, 0)}
          >
            {openButton || (
              <Button
                className="more-filters-button"
                onClick={() => setOpen(true)}
                sx={{ h: "100%" }}
                startIcon={<FilterAlt />}
              >
                Mais Filtros
              </Button>
            )}
          </Badge>
        </Tooltip>
        <Dialog
          fullWidth
          PaperProps={{
            sx: { px: 2, display: "flex", flexDirection: "column", gap: 2 },
          }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className="property-filter-header">
            <h3>Filtros</h3>
            <IconButton sx={{ color: "black" }} onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Quartos"
                type="number"
                value={filters.bedrooms || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    bedrooms: Math.abs(Number(e.target.value)),
                  })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <PriceField
                label="Preço Mínimo"
                value={filters.minPrice?.toString() || ""}
                onChange={(v) => handleNumericChange("minPrice", v)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <PriceField
                label="Preço Máximo"
                value={filters.maxPrice?.toString() || ""}
                onChange={(v) => handleNumericChange("maxPrice", v)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Area útil mínima"
                type="number"
                value={filters.minArea || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minArea: Math.abs(Number(e.target.value)),
                  })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Area útil máxima"
                type="number"
                value={filters.maxArea || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxArea: Math.abs(Number(e.target.value)),
                  })
                }
                fullWidth
              />
            </Grid>          
          
            <Grid item xs={12}>
              <TextField
                label="Vagas"
                type="number"
                value={filters.garages || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    garages: Math.abs(Number(e.target.value)),
                  })
                }
                fullWidth
              />
            </Grid>
          </Grid>


          <Box
            sx={{
              display: "flex",
              p: 1,
              borderTop: "1px solid rgba(0, 0, 0, 0.2)",
              justifyContent: "flex-end",
              gap: 1,
              backgroundColor: "var(--card-background-color)",
              position: "sticky",
              bottom: 0,
              zIndex: 1,
            }}
          >
            <Button variant="contained" color="primary" onClick={applyFilters}>
              Aplicar Filtros
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => resetFilters()}
            >
              Limpar Filtros
            </Button>
          </Box>
        </Dialog>
      </div>
    );
  },
);

PropertyFilter.displayName = "PropertyFilter";

export default PropertyFilter;
