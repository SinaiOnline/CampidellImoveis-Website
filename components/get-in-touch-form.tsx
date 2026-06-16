import { useRouter } from 'next/router';
import React from 'react';
import { createRoot } from 'react-dom/client';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import Phone from '@mui/icons-material/Phone';
import WhatsApp from '@mui/icons-material/WhatsApp';

import siteConfig from '@/config';

import * as LeadService from '@/services/lead';
import * as PropertyService from '@/services/property';
import Lead from '@/types/lead';
import Property from '@/types/property';

import { SinglePropertyOfferType } from '@/types/property-offer-type';

declare const Swal: any;

export const getInTouchOptions = {
  openFacebook: () => {
    window.open(siteConfig.facebook, '_blank');
  },
  openInstagram: () => {
    if (!siteConfig.instagram) return
    window.open("https://www.instagram.com/" + siteConfig.instagram.replace("@", ""), "_blank");
  },
  openWhatsApp: (whatsappNumber: string, message: string) => {
    window.open(`https://wa.me/55${whatsappNumber.replace("55", "").replaceAll(/[^\d]/g, '')}?text=${message}`, "_blank")
  },
  openEmail: (address: string) => {
    window.open(`mailto:${address}`, "_blank")
  },
  openPhone: (phoneNumber: string) => {
    window.open(`tel:${phoneNumber.replaceAll(/[^\d]/g, "")}`, "_blank")
  }
}

export const ScrollToGetInTouch = () => {
  const element = document.getElementById('get-in-touch-form');
  if (!element) return;

  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = ((elementRect.top + elementRect.bottom) / 2) + window.pageYOffset;
  const middle = absoluteElementTop - (window.innerHeight / 2);
  window.scrollTo(0, middle);
}

const GetInTouchForm = ({ property, onSubmit }: { property?: Property, onSubmit?: (leadData: Partial<Lead>) => void }) => {
  interface GetInTouchData { name: string; ddd: string; phoneNumber: string; email: string; message: string; propertyID?: string; offerType?: SinglePropertyOfferType }

  const [data, setData] = React.useState<GetInTouchData>({ name: '', ddd: '', phoneNumber: '', email: '', message: property? PropertyService.ConstructDefaultLeadMessage(property) : '', propertyID: property?.codimovel, offerType: property?.offer_type as SinglePropertyOfferType });
  const [errors, setErrors] = React.useState<GetInTouchData>({ name: '', ddd: '', phoneNumber: '', email: '', message: '' })
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const router = useRouter()

  React.useEffect(() => {
    if (router.query.propertyID) {
      if (!data.propertyID) setData({ ...data, propertyID: router.query.propertyID as string })
    }
    if (router.query.offerType) {
      if (!data.offerType) setData({ ...data, offerType: router.query.offerType as SinglePropertyOfferType }) 
    }
  }, [router.query, data])

  async function handleSubmit() {
    setStatus("loading");

    // Validate
    const errors: GetInTouchData = {
      name: data.name.length < 3 ? "Nome inválido" : "",
      email: (!data.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) ? "Email inválido." : "",
      ddd: data.ddd.length < 2 ? "DDD inválido" : "",
      phoneNumber: data.phoneNumber.length < 8 ? "Número inválido (min. 8 digitos)" : "",
      message: data.message.length < 3 ? "Mensagem inválida (min. 3 caracteres)" : "",
    }

    if (Object.values(errors).some(x => x)) {
      setErrors(errors);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    
    const registerData: Partial<Lead> = {
      agency_id: siteConfig.code,
      name: data.name,
      email: data.email,
      ddd: data.ddd,
      phone: data.phoneNumber,
      message: data.message,
      lead_origin: "SITE DA EMPRESA"
    }

    if (data.propertyID) {
      registerData.property_id = Number(data.propertyID)
      registerData.client_listing_id = data.propertyID;
    }
    if (data.offerType) registerData.offer_type = data.offerType

    // If no errors, register lead
    const response = await LeadService.Register(registerData)

    if (!response.ok) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    // If no errors
    setStatus("success");
    // Then call
    onSubmit?.(registerData);

    if (property) {
      const whatsAppIcon = <>Entrar em Contato <WhatsApp /></>
      Swal.fire({
        title: 'Sucesso! Em breve você receberá um contato',
        text: 'Você gostaria de entrar em contato também via WhatsApp?',
        icon: 'success',
        allowOutsideClick: false,
        showDenyButton: true,
        confirmButtonText: 'Entrar em contato',
        denyButtonText: 'Sair',
        didOpen: () => {
          const confirmButton = document.querySelector('.swal2-confirm') as HTMLElement
          if (confirmButton) {
            confirmButton.style.backgroundColor = "#25D366";
            confirmButton.style.display = "flex";
            confirmButton.style.textWrap = "nowrap";
            confirmButton.style.gap = "0.5em";
    
            createRoot(confirmButton).render(whatsAppIcon)
          }
        }
      }).then((result: any) => {
        if (result.isConfirmed && siteConfig.whatsapp.length > 0) {
          getInTouchOptions.openWhatsApp(siteConfig.whatsapp[0].number, registerData.message || "");
        }
      })
    }    
  }
  
  return (
    <div id='get-in-touch-form' className={`get-in-touch-form`}>
      <p>{!property? "Preencha para continuar" : "Entre em contato"}</p>
      <Divider orientation='horizontal' />
      {
        !!property &&
        <div className="contact-info">
          <h5>{siteConfig.name}</h5>
          {
            siteConfig.phoneNumbers.filter(x => x).map((phoneNumber, i) => <h6 key={i}> <Phone /> <span onClick={() => getInTouchOptions.openPhone(phoneNumber.number)}> { phoneNumber.label && phoneNumber.label + ":" } { phoneNumber.number } </span></h6>)
          }
        </div>
      }
        <TextField variant="standard" type="name" placeholder="Seu nome" error={!!errors.name} helperText={errors.name} onChange={(e) => setData({ ...data, name: e.target.value.substring(0, 100) })} value={data.name} />
        <TextField variant="standard" type="email" placeholder="Seu email" error={!!errors.email} helperText={errors.email} onChange={(e) => setData({ ...data, email: e.target.value.substring(0,200)})} value={data.email} />
        <div style={{ display: 'flex', alignItems: 'center', width: "100%" }}>
          <TextField sx={{width: '3em', display: 'inline-block', mr: 1}} variant="standard" type="number" placeholder="DDD" error={!!errors.ddd} helperText={errors.ddd} onChange={(e) => setData({ ...data, ddd: e.target.value.substring(0, 3).trim() })} value={data.ddd} />
          <TextField sx={{flex: 1}} variant="standard" type="number" placeholder="Telefone" error={!!errors.phoneNumber} helperText={errors.phoneNumber} onChange={(e) => setData({ ...data, phoneNumber: e.target.value.replace(/\D/g, '').substring(0, 9).trim() })} value={data.phoneNumber} />
        </div>
        <TextField variant="standard" placeholder='Olá, eu gostaria de...' error={!!errors.message} helperText={errors.message} multiline rows={4} onChange={(e) => setData({ ...data, message: e.target.value.substring(0, 256) })} value={data.message} />
        {
          status === 'success' ? 
          <Alert severity="success">Sucesso! { !property? "" : "Em breve você receberá um contato"}</Alert> 
          : 
          status === 'error' ? 
          <Alert severity="error">Erro!</Alert>
          :
          <></>
        }
        {
          status !== 'success' &&
          <Button
            variant="contained" sx={{pointerEvents: status !== 'idle' ? 'none' : 'auto', opacity: status !== 'idle' ? 0.5 : 1}} onClick={handleSubmit}
            color={
              !property?
              'primary'
              :
              'secondary'
            }
          >
            { 
              !property? 
              "Continuar"
              :
              "Enviar" 
            }
          </Button>
        }
    </div>
  )
}

export default GetInTouchForm
