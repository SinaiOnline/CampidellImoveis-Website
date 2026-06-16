/* eslint-disable @next/next/no-img-element */
import siteConfig from "@/config";
import { Email, Phone, PinDrop, WhatsApp } from "@mui/icons-material";
import Container from "@mui/material/Container";
import { useLeadDialog } from "../lead-dialog-provider";

const Footer = () => {
  const withLeadDialog = useLeadDialog()

  return (
    <div id='footer'>
      <Container className="footer-container">
        <div className="logo-container">
          { siteConfig.darkLogo && <img src={siteConfig.darkLogo} alt={siteConfig.name} /> }
          { siteConfig.creci && <p><strong>CRECI: </strong>{siteConfig.creci}</p> }
        </div>
        <div className="info">
          <h6>
            { siteConfig.name }
          </h6>
          <div className="tel">
            { siteConfig.address.filter((a) => a).map((address, i) => <p className='address' key={i}><PinDrop /> { address }</p>) }
            { siteConfig.whatsapp?.filter((pn) => pn).map((wpp, i) => <p key={i}> <WhatsApp /> <span onClick={() => withLeadDialog.openWhatsApp(wpp.number)}>{ wpp.label && wpp.label + ":" } { wpp.number }</span></p>) }
            { siteConfig.phoneNumbers.filter((pn) => pn).map((phoneNumber, i) => <p key={i}> <Phone /> <span key={i} onClick={() => withLeadDialog.openPhone(phoneNumber.number)}> { phoneNumber.label && phoneNumber.label + ":" } { phoneNumber.number } </span></p>) }
            { siteConfig.emails.filter((em) => em).map((email, i) => <p key={i}> <Email /> <span key={i} onClick={() => withLeadDialog.openEmail(email.address)}> { email.label && email.label + ":" } { email.address } </span></p>) }
          </div>
        </div>
      </Container>
      <div className="copyright">
        <p>Copyright © {new Date().getFullYear()}. Todos os direitos reservados. Desenvolvido por <a href="https://www.sinaionline.com.br" target="_blank" rel="noreferrer">Sinaionline</a></p>
      </div>
    </div>
  )
}

export default Footer
