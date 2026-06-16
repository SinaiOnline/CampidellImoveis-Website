import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { LegacyRef } from "react";

import Close from "@mui/icons-material/Close";
import FilterAlt from "@mui/icons-material/FilterAlt";
import Search from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import siteConfig, { getDefaultOfferType } from "@/config";
import FilterData from "@/types/property-filter";
import { SinglePropertyOfferType } from "@/types/property-offer-type";
import { PropertySearchFilters } from "@/types/property-search";
import PropertyFilter, { FilterRef } from "./more-filters-dialog";

import * as PropertyFilterService from "@/services/property-filter";
import Typography from "@mui/material/Typography";

const Dialog = dynamic(() => import("@mui/material/Dialog"), { ssr: false });
const Tooltip = dynamic(() => import("@mui/material/Tooltip"), { ssr: false });

const HeaderSearch = () => {
  const router = useRouter()

  const [offerType, setChosenOffer] = React.useState<SinglePropertyOfferType>(getDefaultOfferType(siteConfig));
  const filterRef = React.useRef<FilterRef>(null);

  function redirect(offerType: SinglePropertyOfferType, searchParams?: URLSearchParams) {
    const url = new URL(`/${offerType}/`, window.location.origin);

    if (searchParams) {
      url.search = searchParams.toString();
    }

    router.push(url.toString());
  }

  const openFiltersDialog = () => {
    filterRef.current?.setOpen(true);
  };

  return (
    <div className="header-search">
      {
        siteConfig.supportedOfferTypes === "VENDA_E_ALUGUEL" &&
        <div className="header-search-buttons">
            <ToggleButtonGroup
              value={offerType}
              exclusive
              onChange={(_, value) => value && setChosenOffer(value)}
            >
              <ToggleButton size="small" value="VENDA">
                Comprar
              </ToggleButton>
              <ToggleButton size="small" value="ALUGUEL">
                Alugar
              </ToggleButton>
            </ToggleButtonGroup>
        </div>
      }
      <div className="header-search-input">
        <SearchInput filterRef={filterRef} showSubmitButton onSubmit={(searchParams) => redirect(offerType, searchParams)} />
      </div>
      <div className="header-secondary-search">
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ bgcolor: "white", height: "1em", placeSelf: "center" }}
            />
          }
        >
          <SearchByID />
          <PropertyFilter
            ref={filterRef}
            smallButton
            openButton={
              <Button
                color="inherit"
                onClick={openFiltersDialog}
                endIcon={<FilterAlt />}
              >
                Mais Filtros
              </Button>
            }
          />
        </Stack>
      </div>
    </div>
  );
};

type FilterKey = "propertyTypes" | "cities" | "neighborhoods";
export const SearchInput = ({
  showSubmitButton,
  onSubmit,
}: {
  showSubmitButton?: boolean;
  onSubmit?: (searchParams: URLSearchParams) => void;
  filterRef?: LegacyRef<FilterRef>;
}) => {
  const router = useRouter();

  const [filters, setFilters] = React.useState<PropertySearchFilters>({});
  const [filterData, setFilterData] = React.useState<FilterData>();
  const [filterDataError, setFilterDataError] = React.useState<string>();
  const [neighborhoods, setNeighborhoods] = React.useState<string[]>();
  const [neighborhoodsError, setNeighborhoodsError] = React.useState<string>();
  
  React.useEffect(() => {
    async function getFilterData() {
      try {
        const data = await PropertyFilterService.GetFilterData();
        setFilterData(data);
        setNeighborhoods(data.neighborhoods);
        setFilterDataError(undefined);
      } catch (error) {
        console.error("Error fetching filter data:", error);
        setFilterDataError("Erro ao buscar dados de filtro");
      }
    }

    getFilterData();
  }, []);

  React.useEffect(() => {
    async function getNeighborhoodsByCities() {
      if (!filters.cities || filters.cities.length === 0) {
        setNeighborhoods(filterData?.neighborhoods);
        return;
      }

      try {
        const neighborhoods = await PropertyFilterService.GetNeighborhoodsByCities(filters.cities) || filterData?.neighborhoods;
        setNeighborhoods(neighborhoods);
        setNeighborhoodsError(undefined);
        setFilters((prev) => ({
          ...prev,
          neighborhoods: prev.neighborhoods?.filter((n) => neighborhoods?.includes(n)),
        }));
      } catch (error) {
        console.error("Error fetching neighborhoods by cities:", error);
        setNeighborhoodsError("Erro ao buscar bairros por cidade");
        setNeighborhoods(filterData?.neighborhoods);
      }
    }

    getNeighborhoodsByCities();
  }, [filters.cities, filterData?.neighborhoods]);

  const [inputs, setInputs] = React.useState<Record<FilterKey, string>>({
    propertyTypes: "",
    cities: "",
    neighborhoods: "",
  });

  function handleAutocompleteChange(key: FilterKey, newValue: string[]) {
    setInputs((prev) => ({ ...prev, [key]: "" }));
    setFilters((prev) => ({ ...prev, [key]: newValue }));
  }

  function handleSubmit() {
    const query: Record<string, string> = {};

    if (filters.propertyTypes?.length) query.propertyTypes = filters.propertyTypes.join(",");
    if (filters.cities?.length) query.cities = filters.cities.join(",");
    if (filters.neighborhoods?.length) query.neighborhoods = filters.neighborhoods.join(",");
    if (filters.bedrooms) query.bedrooms = String(filters.bedrooms);
    if (filters.minPrice) query.minPrice = String(filters.minPrice);
    if (filters.maxPrice) query.maxPrice = String(filters.maxPrice);
    if (filters.minArea) query.minArea = String(filters.minArea);
    if (filters.maxArea) query.maxArea = String(filters.maxArea);
    if (filters.garages) query.garages = String(filters.garages);

    onSubmit?.(new URLSearchParams(query));
  }

  // Inicializa estado a partir da query, se existir (útil em reloads)
  React.useEffect(() => {
    setFilters({
      propertyTypes: (router.query.propertyTypes as string)?.split(",") || [],
      cities: (router.query.cities as string)?.split(",") || [],
      neighborhoods: (router.query.neighborhoods as string)?.split(",") || [],
      bedrooms: parseInt(router.query.bedrooms as string) || undefined,
      minPrice: parseFloat(router.query.minPrice as string) || undefined,
      maxPrice: parseFloat(router.query.maxPrice as string) || undefined,
      minArea: parseInt(router.query.minArea as string) || undefined,
      maxArea: parseInt(router.query.maxArea as string) || undefined,
      garages: parseInt(router.query.garages as string) || undefined,
    });
  }, [router.query]);

  function renderAutocomplete(
    key: FilterKey,
    label: string,
    options: string[] | undefined,
  ) {
    const values = filters[key] || [];
    return (
      <Autocomplete
        size="small"
        disableCloseOnSelect
        disablePortal
        limitTags={2}
        multiple
        blurOnSelect
        inputValue={inputs[key]}
        value={values}
        onChange={(_, newValue) => handleAutocompleteChange(key, newValue)}
        loading={options === undefined}
        options={options || []}
        renderOption={(props, option, { selected }) => {
          const { key: optKey, ...optionProps } = props;
          return (
            <li
              key={optKey}
              {...optionProps}
              className="search-input-autocomplete-option"
            >
              <Checkbox sx={{ marginRight: 2 }} checked={selected} />
              <p className="search-input-autocomplete-option-text">{option}</p>
            </li>
          );
        }}
        fullWidth
        renderTags={() => null}
        renderInput={(params) => (
          <TextField
            {...params}
            autoComplete="off"
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, [key]: e.target.value }))
            }
            InputLabelProps={{
              shrink: values.length > 0 || inputs[key].length > 0,
            }}
            placeholder={values.join(", ")}
            label={label}
          />
        )}
      />
    );
  }

  return (
    <div className="search-input">
      <div className="search-filter-container">
        <div className="search-input-autocomplete">
          {renderAutocomplete(
            "propertyTypes",
            "Tipos de imóvel",
            filterData?.propertyTypes || [],
          )}
          {renderAutocomplete("cities", "Cidade", filterData?.cities || [])}
          {renderAutocomplete(
            "neighborhoods",
            "Bairro",
            neighborhoods,
          )}
        </div>
        {showSubmitButton && (
          <div className="action">
            <Tooltip title="Pesquisar">
              <Button className="search-button" sx={{ height: "100%" }} startIcon={<Search fontSize="large" />} onClick={handleSubmit} />
            </Tooltip>
          </div>
        )}
      </div>
      {
        filterDataError && (
          <Typography variant="body2" color="error">
            {filterDataError}
          </Typography>
        )
      }
      {
        neighborhoodsError && (
          <Typography variant="body2" color="error">
            {neighborhoodsError}
          </Typography>
        )
      }
    </div>
  );
};

const SearchByID = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [id, setID] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  React.useEffect(() => {
    if (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [error]);

  // Clean up
  React.useEffect(() => {
    return () => {
      (setID(""), setError(""), setStatus("idle"));
    };
  }, [open]);

  async function handleSubmit() {
    router.push(`/code-search-result?ids=${id}`);
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        color="inherit"
        startIcon={<Search />}
      >
        Busca por código
      </Button>
      <Dialog
        disableRestoreFocus
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { p: 1, display: "flex", flexDirection: "column", gap: 1 },
        }}
      >
        <div className="search-by-code-dialog-header">
          <h5>Busca por código</h5>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </div>
        <TextField
          inputProps={{
            id: "search-by-id",
            onKeyDown: (e) => e.key === "Enter" && handleSubmit(),
          }}
          autoFocus
          label="Código do imóvel"
          variant="outlined"
          value={id}
          onChange={(e) => setID(e.currentTarget.value)}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          disabled={status != "idle"}
          variant="contained"
          endIcon={
            status === "loading" ? (
              <CircularProgress color="inherit" size={16} />
            ) : null
          }
          onClick={handleSubmit}
        >
          {status === "success"
            ? "Encontrado"
            : status === "loading"
              ? "Buscando..."
              : "Buscar"}
        </Button>
      </Dialog>
    </>
  );
};

export default HeaderSearch;
