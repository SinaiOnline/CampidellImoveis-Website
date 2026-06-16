import { ChevronRight, House, Link as LinkIcon } from "@mui/icons-material";
import { Button, Container, Grid } from "@mui/material";

export const services = [
    {
        field: "COMPRA E VENDA",
        icon: <House />,
        items: [
            { text: "Imóvel para venda", link: "/VENDA" },
            { text: "Cadastrar imóvel", link: "/anuncie-seu-imovel" },
            { text: "SIMULAR FINANCIAMENTO", link: null },
            {
                text: "Banco Itaú",
                link:
                    "https://www.itau.com.br/creditos-financiamentos/imoveis/simulador/",
            },
            {
                text: "Santander",
                link:
                    "https://www.webcasas.com.br/webcasas/?headerandfooter/#/dados-pessoais",
            },
            {
                text: "Bradesco",
                link:
                    "https://banco.bradesco/html/classic/produtos-servicos/emprestimo-e-financiamento/encontre-seu-credito/simuladores-imoveis.shtm#box1-comprar",
            },
            {
                text: "C.E.F.",
                link:
                    "http://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso",
            },
            {
                text: "Banco do Brasil",
                link:
                    "https://www42.bb.com.br/portalbb/imobiliario/creditoimobiliario/simular,802,2250,2250.bbx?_ga=2.176191526.2032584887.1549653904-1642865055.1549653904",
            },
        ],
    },
    {
        field: "LOCAÇÃO",
        icon: <House />,
        items: [
            { text: "Imóvel de aluguel", link: "/ALUGUEL" },
            { text: "Cadastrar imóvel", link: "/anuncie-seu-imovel" },
        ],
    },
    {
        field: "Links Úteis",
        icon: <LinkIcon />,
        items: [
            { text: "Correios", link: "http://www.correios.com.br/para-voce" },
            {
                text: "Caixa",
                link: "http://www.caixa.gov.br/Paginas/home-caixa.aspx",
            },
            { text: "Receita Federal", link: "http://receita.fazenda.gov.br/" },
            { text: "ENERGISA", link: "https://www.energisa.com.br/" },
            { text: "Saae", link: "https://www.saaemanhuacu.mg.gov.br/" },
            { text: "IPTU", link: "https://gpi06.cloud.el.com.br/ServerExec/acessoBase/?idPortal=53931560-be41-4b64-8c26-619886139172&idFunc=ba898db3-86a4-4fd5-b05d-f3864eb5b4f4" },
        ],
    },
];

const Servicos = () => {
    return (
        <div className="services-page">
            <Container className="services-page-container">
                <h1>Nossos Serviços</h1>
                <Grid container spacing={3} justifyContent="center">
                    {services.map((service, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <div className="service-category">
                                <h2>{service.field} {service.icon}</h2>
                                <div className="services-container">
                                    {service.items.map((item, idx) =>
                                        item.link
                                            ? (
                                                <Button
                                                    key={idx}
                                                    variant="contained"
                                                    href={item.link}
                                                    target="_blank"
                                                    endIcon={<ChevronRight />}
                                                >
                                                    {item.text}
                                                </Button>
                                            )
                                            : <h6 key={idx}>{item.text}</h6>
                                    )}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
};

export default Servicos;
