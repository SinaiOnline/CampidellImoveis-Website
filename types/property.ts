import { PropertyOfferTypes } from "./property-offer-type";

export default interface Property {
  codimobiliaria: string;  // varchar(20)
  codimovel: string;       // varchar(16)
  cadastro: string;        // varchar(15)
  update: string;          // varchar(15)
  imovel: string;          // varchar(25)
  nquartos: string;        // varchar(10)
  endereco: string;        // text
  numero: string;          // varchar(5)
  complemento: string;     // varchar(40)
  bairro: string;          // varchar(50)
  cep: string;             // varchar(10)
  regiao: string;          // text
  cidade: string;          // text
  uf: string;              // char(2)
  quartos: string;         // char(3)
  suites: string;          // char(3)
  salas: string;           // char(3)
  banho: string;           // char(3)
  elevadores: string;      // char(3)
  apandar: string;         // char(3)
  pavimentos: string;      // char(3)
  garagens: string;        // char(3)
  m2util: string;          // varchar(10)
  m2terreno: string;       // varchar(10)
  idade: string;           // varchar(5)
  posicao: string;         // varchar(30)
  armquartos: string;      // char(2)
  blindex: string;         // char(2)
  dce: string;             // char(2)
  armcozinha: string;      // char(2)
  varanda: string;         // char(2)
  arprivativa: string;     // char(2)
  arlazer: string;         // char(2)
  piscina: string;         // char(2)
  desocupado: string;      // char(2)
  salafestas: string;      // char(2)
  salajogos: string;       // char(2)
  esportes: string;        // char(2)
  porteiro: string;        // char(2)
  vagassep: string;        // char(2)
  preco: number;           // int(25)
  condominio: string;      // varchar(25)
  iptu: string;            // varchar(25)
  obs: string;             // longtext
  img: string;             // char(200)
  imageURLs: string[];
  proprietario?: string;   // varchar(150), optional
  captador?: string;       // varchar(50), optional
  chaves?: string;         // varchar(300), optional
  url_video?: string;      // varchar(200), optional
  lancamento?: number;     // decimal(3,0), optional
  observ?: string;         // longtext, optional
  seo_titulo: string;
	seo_palavras_chaves: string;
	seo_descricao: string;
  page_title: string;
  card_title: string;
  offer_type: PropertyOfferTypes; // assigned manually by the backend. field does not exist on the database
}