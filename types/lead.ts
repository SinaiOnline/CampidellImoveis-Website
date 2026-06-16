import { SinglePropertyOfferType } from "./property-offer-type";

export default interface Lead {
  id: number;
  lead_origin: string;
  timestamp: Date;
  agency_id: number;
  property_id?: number; // Optional property
  origin_lead_id: string;
  origin_listing_id: string;
  client_listing_id: string;
  name: string;
  email: string;
  ddd: string;
  phone: string;
  message: string;
  temperature: string;
  offer_type: SinglePropertyOfferType;
}