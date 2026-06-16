import siteConfig from "@/config";
import ENDPOINTS from "@/lib/endpoints";
import { FavoritePropertiesLocalStorageKey } from "@/pages/favoritos";
import { NoImagePlaceholder } from "@/utils/default-image";

import { API_TOKEN } from "@/lib/api";
import Property from "@/types/property";
import { PropertyMetrics, PropertyShare, PropertyView } from "@/types/property-metrics";
import { PropertySearchFilters, PropertySearchResult } from "@/types/property-search";

export async function GetProperties(filters: PropertySearchFilters, proxy: "bypassProxy" | "default" = "default") {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => queryParams.append(key, v));
    } else {
      queryParams.append(key, String(value));
    }
  });

  const authorizationHeader = proxy === "bypassProxy" ? {Authorization: API_TOKEN} : {}

  const response = await fetch(`${proxy === "bypassProxy" ? ENDPOINTS.searchPropertiesBypassProxy : ENDPOINTS.searchProperties}?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authorizationHeader as any
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  
  return await response.json() as PropertySearchResult
}

export async function GetPropertiesByIDs(ids: string) {
  return await GetProperties({ codes: ids.split(","), limit: 0 });
}

export async function GetFavoriteProperties() {
  const favoritesStorage = localStorage.getItem(FavoritePropertiesLocalStorageKey);
  const favorites = favoritesStorage ? favoritesStorage.split(",") : [];
  return await GetPropertiesByIDs(favorites.join(","));
}

export async function GetSimilarProperties(property: Property) {
  const propertySearchResult = await GetProperties({
    maxPrice: Number(property.preco.toString().replace(",", ".")) * 1.2,
    minPrice: Number(property.preco.toString().replace(",", ".")) * 0.8,
    bedrooms: Number(property.quartos),
    propertyTypes: [property.imovel],
    offerType: property.offer_type,
    limit: 4,
    sortDir: "DESC",
  });

  return propertySearchResult.properties.filter((p: Property) => p.codimobiliaria === property.codimobiliaria);
}

export function GetPictures(property: Property) {
  return property.imageURLs;
}

export function GetFirstPicture(property: Property) {
  return GetPictures(property)[0] || NoImagePlaceholder;
}

export function GetSharingPicture(property: Property) {
  const firstPictureUrl = GetFirstPicture(property);
  const resizerUrl = "https://sistemasinaionline.com.br/sinaionline/resizer.php?originalImageUrl=";
  return resizerUrl + firstPictureUrl;
}

export function AssignType(property: Property, type: "VENDA" | "ALUGUEL") {
  return { ...property, type };
}

export function GetURL(property: Property) {
  let url = `/${property.offer_type}/${property.codimovel}?t=${ConstructTitle(property, "withoutPrice").toLowerCase().replace(/ /g, "-").replace("---", "-")}&`;

  if (property.codimobiliaria != siteConfig.code.toString()) {
    url += `partner=${property.codimobiliaria}`;
  }

  return url;
}

export function ConstructDefaultLeadMessage(property: Property) {
  return `Olá, gostaria de ter mais informações sobre: ${ConstructTitle(property, "withPrice")} código ${property.codimovel} que encontrei no site.`;
}

export function ConstructTitle(
  property: Property,
  withPrice: "withPrice" | "withoutPrice" = "withPrice",
) {
  return withPrice == "withPrice" ? property.page_title : property.card_title;
}

export function GetFormattedPrice(property: Property) {
  return Number(property.preco.toString().replace(",", ".")).toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" },
  );
}

export function GetAddress(property: Property) {
  return `${property.bairro}, ${property.cidade} - ${property.uf}`;
}

export function MarkAsFavorite(propertyID: string) {
  const favoritesStorage = localStorage.getItem(
    FavoritePropertiesLocalStorageKey,
  );
  const favorites = favoritesStorage ? favoritesStorage.split(",") : [];
  if (!favorites.includes(propertyID)) {
    favorites.push(propertyID);
    localStorage.setItem(
      FavoritePropertiesLocalStorageKey,
      favorites.join(","),
    );
  }

  return IsFavorite(propertyID);
}

export function UnmarkAsFavorite(propertyID: string) {
  const favoritesStorage = localStorage.getItem(
    FavoritePropertiesLocalStorageKey,
  );
  const favorites = favoritesStorage ? favoritesStorage.split(",") : [];
  if (favorites.includes(propertyID)) {
    favorites.splice(favorites.indexOf(propertyID), 1);
    localStorage.setItem(
      FavoritePropertiesLocalStorageKey,
      favorites.join(","),
    );
  }

  return IsFavorite(propertyID);
}

export function IsFavorite(propertyID: string) {
  const favoritesStorage = localStorage.getItem(
    FavoritePropertiesLocalStorageKey,
  );
  const favorites = favoritesStorage ? favoritesStorage.split(",") : [];
  return favorites.includes(propertyID);
}

export async function GetMetrics(property: Property): Promise<PropertyMetrics> {
  const response = await fetch(`${ENDPOINTS.getMetrics}?propertyID=${property.codimovel}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as PropertyMetrics
}

export async function RegisterView(property: Property) {
  const visitID = (() => {
    const url = new URL(window.location.href);
    const baseUrl = url.origin + url.pathname + url.search;

    return `visit-registry::${baseUrl}`
  })()
  
  if (sessionStorage.getItem(visitID) != null) {
    return;
  }

  const data: Partial<PropertyView> = {
    agency_id: Number(property.codimobiliaria),
    property_id: Number(property.codimovel),
    offer_type: property.offer_type,
    agency_name: siteConfig.name
  }

  const response = await fetch(ENDPOINTS.registerView, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  
  sessionStorage.setItem(visitID, "1")    
}

export async function RegisterShare(property: Property, origin: string) {  
  const data: Partial<PropertyShare> = {
    agency_id: Number(property.codimobiliaria),
    property_id: Number(property.codimovel),
    offer_type: property.offer_type,
    origin: origin
  }

  const response = await fetch(ENDPOINTS.registerShare, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
}