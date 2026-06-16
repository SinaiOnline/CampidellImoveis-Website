import React, { ChangeEvent, FormEvent } from "react";

import Email from "@mui/icons-material/Email";
import Phone from "@mui/icons-material/Phone";
import PinDrop from "@mui/icons-material/PinDrop";
import WhatsApp from "@mui/icons-material/WhatsApp";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import GoogleMap from "@/components/google-map-iframe";
import { useLeadDialog } from "@/components/lead-dialog-provider";
import siteConfig from "@/config";
import * as LeadService from "@/services/lead";
import Lead from "@/types/lead";

const Contato = () => {
  const withLeadDialog = useLeadDialog();

  const subjectOptions = ["vendas", "financeiro", "outros"];

  const [formData, setFormData] = React.useState({
    subject: "vendas",
    name: "",
    email: "",
    ddd: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = React.useState<
    "idle" | "error" | "loading" | "success"
  >("idle");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "ddd") {
      e.target.value = e.target.value.substring(0, 3);
    }
    if (e.target.name === "phone") {
      e.target.value = e.target.value.substring(0, 9);
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [errors, setErrors] = React.useState<typeof formData>({
    subject: "",
    name: "",
    email: "",
    ddd: "",
    phone: "",
    message: "",
  });

  const validate = (): boolean => {
    let tempErrors: typeof formData = { ...errors };
    tempErrors.name = formData.name ? "" : "Nome é obrigatório.";
    tempErrors.ddd = formData.ddd.length >= 2 ? "" : "DDD inválido";
    tempErrors.phone = formData.phone ? "" : "Telefone é obrigatório.";
    if (formData.phone && !/^\d{8,9}$/.test(formData.phone))
      tempErrors.phone = "Telefone deve ter 8 ou 9 dígitos.";
    tempErrors.email = formData.email ? "" : "Email é obrigatório.";
    if (
      formData.email &&
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    )
      tempErrors.email = "Email inválido.";
    tempErrors.message = formData.message ? "" : "Mensagem é obrigatória.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStatus("loading");
      const data: Partial<Lead> = {
        lead_origin: "SITE DA EMPRESA",
        agency_id: siteConfig.code,
        name: formData.name,
        email: formData.email,
        ddd: formData.ddd,
        phone: formData.phone,
        message:
          "Assunto: " + formData.subject + ". Mensagem: " + formData.message,
      };

      const response = await LeadService.Register(data);
      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
    }
  };

  return (
    <div className="contato-page">
      <Container className="contato-page-container">
        <h1>Contato</h1>
        <div className="grid">
          <div>
            <h4>Dados de contato</h4>
            <div className="info">
              <h6>{siteConfig.name}</h6>
              <div className="tel">
                {siteConfig.whatsapp
                  ?.filter((pn) => pn)
                  .map((wpp, i) => (
                    <p key={i}>
                      {" "}
                      <WhatsApp />{" "}
                      <a
                        onClick={() => withLeadDialog.openWhatsApp(wpp.number)}
                      >
                        {wpp.label && wpp.label + ":"} {wpp.number}
                      </a>
                    </p>
                  ))}
                {siteConfig.phoneNumbers
                  .filter((pn) => pn)
                  .map((phoneNumber, i) => (
                    <p key={i}>
                      {" "}
                      <Phone />{" "}
                      <a onClick={() => withLeadDialog.openPhone(phoneNumber.number)}>
                        {phoneNumber.label && phoneNumber.label + ":"} {phoneNumber.number}
                      </a>
                    </p>
                  ))}
                {siteConfig.emails
                  .filter((email) => email)
                  .map((email, i) => (
                    <p key={i}>
                      {" "}
                      <Email />{" "}
                      <a onClick={() => withLeadDialog.openEmail(email.address)}>
                        {email.label && email.label + ":"} {email.address}
                      </a>
                    </p>
                  ))
                }
                {siteConfig.address && (
                  <p className="address">
                    <PinDrop /> {siteConfig.address}
                  </p>
                )}
              </div>
              <section>
                <h4>Envie uma mensagem para nós</h4>
                <div>
                  <p>Qual assunto deseja tratar?</p>
                  <div className="toggle-buttons">
                    {subjectOptions.map((subject) => (
                      <Button
                        sx={{
                          outline: "1px solid var(--primary-color)",
                          "&:hover": {
                            outline: "1px solid var(--primary-color)",
                          },
                        }}
                        key={subject}
                        variant={
                          formData.subject === subject
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          setFormData({ ...formData, subject: subject })
                        }
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>
              <section>
                <form onSubmit={handleSubmit}>
                  <Grid id="grid-container" container spacing={1}>
                    <Grid item xs={12}>
                      <p>Nome completo</p>
                      <TextField
                        variant="filled"
                        label="Nome Completo"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2} sm={1.8}>
                      <p>DDD</p>
                      <TextField
                        variant="filled"
                        label="DDD"
                        name="ddd"
                        type="number"
                        value={formData.ddd}
                        onChange={handleChange}
                        error={!!errors.ddd}
                        helperText={errors.ddd}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={10} sm={4.2}>
                      <p>Telefone</p>
                      <TextField
                        variant="filled"
                        label="Telefone para contato"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <p>E-mail</p>
                      <TextField
                        variant="filled"
                        label="E-mail para contato"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <p>Digite sua mensagem</p>
                      <TextField
                        variant="filled"
                        label="Mensagem"
                        name="message"
                        required
                        multiline
                        minRows={4}
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Typography
                    sx={{ marginTop: "20px" }}
                  >
                    * Campos obrigatórios
                  </Typography>
                  {status == "success" ? (
                    <Alert severity={status}>
                      Sucesso! Em breve entraremos em contato.
                    </Alert>
                  ) : status == "error" ? (
                    <Alert severity={status}>Ocorreu um erro!</Alert>
                  ) : (
                    <></>
                  )}
                  {status !== "success" && (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={status == "loading"}
                      sx={{ marginTop: "20px" }}
                    >
                      Enviar
                    </Button>
                  )}
                </form>
              </section>
            </div>
          </div>
          <div className="map">
            <GoogleMap />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contato;
