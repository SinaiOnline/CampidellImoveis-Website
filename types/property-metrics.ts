export interface PropertyMetrics {
  shares: number,
  views: number,
}

export interface PropertyShare {
  id: number;
  agency_id: number;
  property_id: number;
  offer_type: string;
  origin: string;
  timestamp: string;
}

export interface PropertyView {
  agency_id: number;
  property_id: number;
  timestamp: string;
  offer_type: string;
  agency_name: string;
}