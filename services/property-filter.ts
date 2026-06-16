import ENDPOINTS from "@/lib/endpoints";
import FilterData from "@/types/property-filter";

export async function GetFilterData() {
  const response = await fetch(ENDPOINTS.getFilterData);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as FilterData;
}

export async function GetNeighborhoodsByCities(cities: string[]) {
  const response = await fetch(`${ENDPOINTS.getNeighborhoodsByCity}?cities=${cities.join(",")}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as string[];
}