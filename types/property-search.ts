import Property from "./property";

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PropertySearchFilters {
  offerType?: string;
  neighborhoods?: string[];
  propertyTypes?: string[];
  cities?: string[];
  codes?: string[];
  partnerId?: string;
  isNewRelease?: boolean;
  isTop?: boolean;
  isExclusive?: boolean;
  isHighlight?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  suites?: number;
  garages?: number;
  page?: number;
  limit?: number;
  sortDir?: string;
  sortBy?: "price" | "registerDate" | "updateDate";
  randomOrder?: boolean;
  [key: string]: any;
}

