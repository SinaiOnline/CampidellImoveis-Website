import GoogleMap from "@/components/google-map-iframe";
import Container from "@mui/material/Container";

const Sobre = () => {
    return (
        <div className="about-page">
            <Container className="about-page-container" maxWidth="lg">
                <h1>A Empresa</h1>
                <p>
                  <br/>
                    Campidell Imóveis 
                    <br/><br/>

                    ❇️Transformando sonhos em endereços reais <br/>
                    📍Igaratinga-MG<br/>
                    📊 CRECI: 33240<br/>
                    🔑 Compra • Venda • Locação<br/>
                    📑 Documentação imobiliária<br/>
                </p>
                <GoogleMap />
            </Container>
        </div>
    );
};

export default Sobre;
