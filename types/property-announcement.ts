export default interface PropertyAnnouncement {
  id: number;
  agency_id: number;
  timestamp: string;
  announcer_name: string;
  announcer_phone: string;
  announcer_email: string;
  announcement_type: string;
  cep: string;
  neighborhood: string;
  city: string;
  state: string;
  address: string;
  number: string;
  complement: string;
}