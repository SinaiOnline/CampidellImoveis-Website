import GoogleMap from "@/components/google-map-iframe";
import Container from "@mui/material/Container";

const Sobre = () => {
    return (
        <div className="about-page">
            <Container className="about-page-container" maxWidth="lg">
                <h1>A Empresa</h1>
                <p>
                  <b>Sandro Weslley Negócios Imobiliários</b> é uma empresa especializada
                  em intermediação imobiliária, construída sobre 26 anos de
                  experiência no mercado e comprometida em oferecer segurança,
                  transparência e excelência em cada negociação.
                  <br />
                  <br />
  
                  Localizada na Rua Dr. Michael Hannas, nº 50, Bairro Vale Verde,
                  em Manhuaçu, nossa empresa atua com foco em conectar pessoas às
                  melhores oportunidades imobiliárias da região.
                  <br />
                  <br />
  
                  Trabalhamos com compra, venda, avaliação e consultoria
                  imobiliária, sempre com atenção personalizada e profundo
                  conhecimento do mercado local.
                  <br />
                  <br />
  
                  Ao longo de mais de duas décadas de atuação, construímos uma
                  trajetória baseada em credibilidade, relacionamento e
                  resultados, auxiliando clientes a realizarem negócios seguros e
                  estratégicos, seja para moradia, investimento ou expansão
                  patrimonial.
                  <br />
                  <br />
  
                  Nosso compromisso é oferecer um atendimento ético, transparente
                  e eficiente, garantindo que cada cliente tenha a confiança
                  necessária para tomar decisões importantes no mercado
                  imobiliário.
                  <br />
                  <br />
  
                  <b>Sandro Weslley Negócios Imobiliários</b> — experiência, confiança e oportunidades que constroem o futuro.
                  <br />

                  <b>Endereço:</b>   Rua Dr. Michael Hannas, nº 50 - Bairro Vale Verde - Manhuaçu/MG
                </p>
                <GoogleMap />
            </Container>
        </div>
    );
};

export default Sobre;
