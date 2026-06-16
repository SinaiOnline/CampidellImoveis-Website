import { Button, Checkbox, Container, FormControlLabel, Grid, MenuItem, TextField } from '@mui/material';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react';

interface FormData {
  finalidade: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  dormitorios: string;
  vagas: string;
  cidade: string;
  bairro: string;
  observacao: string;
  agreed: boolean;
}

interface FormErrors {
  finalidade?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  tipo?: string;
  dormitorios?: string;
  vagas?: string;
  cidade?: string;
  bairro?: string;
  observacao?: string;
  agreed?: string;
}

const EncomendeSeuImovel: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    finalidade: '',
    nome: '',
    email: '',
    telefone: '',
    tipo: '',
    dormitorios: '',
    vagas: '',
    cidade: '',
    bairro: '',
    observacao: '',
    agreed: false
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | { value: unknown; name?: string }>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validate = (): boolean => {
    let tempErrors: FormErrors = {};
    tempErrors.finalidade = formData.finalidade ? "" : "Finalidade é obrigatória.";
    tempErrors.nome = formData.nome ? "" : "Nome é obrigatório.";
    if (formData.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) tempErrors.email = "Email inválido.";
    if (formData.telefone && !/^\d{10,11}$/.test(formData.telefone)) tempErrors.telefone = "Telefone deve ter 10 ou 11 dígitos.";
    tempErrors.tipo = formData.tipo ? "" : "Tipo é obrigatório.";
    tempErrors.dormitorios = formData.dormitorios ? "" : "Dormitórios são obrigatórios.";
    tempErrors.vagas = formData.vagas ? "" : "Vagas são obrigatórias.";
    tempErrors.cidade = formData.cidade ? "" : "Cidade é obrigatória.";
    tempErrors.bairro = formData.bairro ? "" : "Bairro é obrigatório.";
    tempErrors.observacao = formData.observacao ? "" : "Observação é obrigatória.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Não implementado");
    }
  };

  return (
    <div className="encomende-seu-imovel-page">
      <Container className="encomende-seu-imovel-page-container">
        <h1>Vamos encontrar o imóvel ideal para você.</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  label="Finalidade"
                  name="finalidade"
                  value={formData.finalidade}
                  onChange={handleChange}
                  error={!!errors.finalidade}
                  helperText={errors.finalidade}
                  fullWidth
                >
                  <MenuItem value="Venda">Venda</MenuItem>
                  <MenuItem value="Aluguel">Aluguel</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Seu Nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  error={!!errors.nome}
                  helperText={errors.nome}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  error={!!errors.tipo}
                  helperText={errors.tipo}
                  fullWidth
                  placeholder='Casa, apartamento, loft, etc.'
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Dormitórios"
                  name="dormitorios"
                  value={formData.dormitorios}
                  onChange={handleChange}
                  error={!!errors.dormitorios}
                  helperText={errors.dormitorios}
                  fullWidth
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Vagas"
                  name="vagas"
                  value={formData.vagas}
                  onChange={handleChange}
                  error={!!errors.vagas}
                  helperText={errors.vagas}
                  fullWidth
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  error={!!errors.cidade}
                  helperText={errors.cidade}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  error={!!errors.bairro}
                  helperText={errors.bairro}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observação"
                  name="observacao"
                  value={formData.observacao}
                  onChange={handleChange}
                  error={!!errors.observacao}
                  helperText={errors.observacao}
                  multiline
                  minRows={4}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreed}
                      onChange={handleChange}
                      name="agreed"
                      color="primary"
                    />
                  }
                  label={<p>Li e aceito a <Link href="/politica-de-privacidade">política de privacidade</Link></p>}
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="primary">Enviar</Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default EncomendeSeuImovel;
