import siteConfig from '@/config';
import PropertyAnnouncement from '@/types/property-announcement';
import { Alert, Button, Container, Grid, MenuItem, TextField } from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react';

import * as PropertyAnnouncementService from '@/services/property-announcement';

interface FormData {
  nome: string;
  telefone: string;
  email: string;
  finalidade: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  logradouro: string;
  numero: string;
  complemento: string;
}

interface FormErrors {
  nome?: string;
  telefone?: string;
  email?: string;
  finalidade?: string;
  cep?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
}

const AnuncieSeuImovel: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    email: '',
    finalidade: 'Venda',
    cep: '',
    bairro: '',
    cidade: '',
    estado: '',
    logradouro: '',
    numero: '',
    complemento: ''
  });

  const [status, setStatus] = React.useState<"idle" | "error" | "loading" | "success">("idle")

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "telefone") {
      e.target.value=e.target.value.substring(0, 11)
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (): boolean => {
    let tempErrors: FormErrors = {};
    tempErrors.nome = formData.nome ? "" : "Nome é obrigatório.";
    tempErrors.telefone = formData.telefone ? "" : "Telefone é obrigatório.";
    if (formData.telefone && !/^\d{10,11}$/.test(formData.telefone)) tempErrors.telefone = "Telefone deve ter 10 ou 11 dígitos.";
    if (formData.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) tempErrors.email = "Email inválido.";
    tempErrors.finalidade = formData.finalidade ? "" : "Finalidade do imóvel é obrigatória.";
    tempErrors.bairro = formData.bairro ? "" : "Bairro é obrigatório.";
    tempErrors.cidade = formData.cidade ? "" : "Cidade é obrigatória.";
    tempErrors.estado = formData.estado ? "" : "Estado é obrigatório.";
    tempErrors.logradouro = formData.logradouro ? "" : "Logradouro é obrigatório.";
    tempErrors.numero = formData.numero ? "" : "Número é obrigatório.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting")
    if (validate()) {
      setStatus("loading")
      const data: Partial<PropertyAnnouncement> = {
        agency_id: siteConfig.code,
        announcer_name: formData.nome,
        announcer_email: formData.email,
        announcer_phone: formData.telefone,
        announcement_type: formData.finalidade,
        cep: formData.cep,
        neighborhood: formData.bairro,
        city: formData.cidade,
        state: formData.estado,
        address: formData.logradouro,
        number: formData.numero,
        complement: formData.complemento
      }

      const response = await PropertyAnnouncementService.Register(data)
      if (!response.ok) {
        setStatus("error")
        return;
      }

      setStatus("success")
    }
  };

  return (
    <div className="anuncie-seu-imovel-page">
      <Container className="anuncie-seu-imovel-page-container">
        <h1>Descreva o imóvel que deseja anunciar</h1>
        <form onSubmit={handleSubmit}>
          <div className="personal-data">
            <h6>Dados Pessoais</h6>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  error={!!errors.nome}
                  required
                  helperText={errors.nome}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Telefone"
                  name="telefone"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  error={!!errors.telefone}
                  helperText={errors.telefone}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </div>

          <div className="objective">
            <h6>Que tipo de imóvel está anunciando?</h6>
            <TextField
              select
              required
              label="Finalidade do imóvel"
              name="finalidade"
              value={formData.finalidade}
              onChange={handleChange}
              error={!!errors.finalidade}
              helperText={errors.finalidade}              
            >
              <MenuItem value="Venda">Venda</MenuItem>
            </TextField>
          </div>

          <div className="location">
            <h6>Localização</h6>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="CEP"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  error={!!errors.bairro}
                  helperText={errors.bairro}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  error={!!errors.cidade}
                  helperText={errors.cidade}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  error={!!errors.estado}
                  helperText={errors.estado}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Logradouro"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                  error={!!errors.logradouro}
                  helperText={errors.logradouro}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3} md={2}>
                <TextField
                  label="Número"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  error={!!errors.numero}
                  helperText={errors.numero}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3} md={2}>
                <TextField
                  label="Complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </div>
          {
            status == "success" ?
            <Alert severity={status}>Sucesso! Em breve entraremos em contato.</Alert>
            :
            status == "error" ?
            <Alert severity={status}>Ocorreu um erro!</Alert>
            :
            <></>
          }
          {
            status !== "success" &&
            <Button disabled={status==="loading"} type="submit" variant="contained" color="primary">Enviar</Button>
          }
        </form>
      </Container>
    </div>
  );
};

export default AnuncieSeuImovel;
