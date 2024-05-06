import React from 'react';
import { Typography, TextField, Grid, Paper, Select, MenuItem } from '@mui/material';
import { useAuthValue } from '../../context/AuthContext';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import axios from 'axios';

const Business = () => {
  const { user } = useAuthValue();
  const { document: userData, loading, error } = useFetchDocument('empresas', user?.uid);

  const [empresa, setEmpresa] = React.useState({
    cnpj: '',
    nomeFantasia: '',
    razaoSocial: '',
    inscricaoEstadual: '',
    tipoLogradouro: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    uf: '',
    telefone: '',
    site: '',
    email: '',
    ramoAtividade: '',
    dataFundacao: '',
    numFuncionarios: '',
    porteEmpresa: '',
    setorAtuacao: ''
  });

  React.useEffect(() => {
    if (userData) {
      setEmpresa({
        cnpj: userData.empresa.cnpj || '',
        nomeFantasia: userData.empresa.nomeFantasia || '',
        razaoSocial: userData.empresa.razaoSocial || '',
        inscricaoEstadual: userData.empresa.inscricaoEstadual || '',
        tipoLogradouro: userData.empresa.tipoLogradouro || '',
        endereco: userData.empresa.endereco || '',
        numero: userData.empresa.numero || '',
        complemento: userData.empresa.complemento || '',
        bairro: userData.empresa.bairro || '',
        cidade: userData.empresa.cidade || '',
        cep: userData.empresa.cep || '',
        uf: userData.empresa.uf || '',
        telefone: userData.empresa.telefone || '',
        site: userData.empresa.site || '',
        email: userData.empresa.email || '',
        ramoAtividade: userData.empresa.ramoAtividade || '',
        dataFundacao: userData.empresa.dataFundacao || '',
        numFuncionarios: userData.empresa.numFuncionarios || '',
        porteEmpresa: userData.empresa.porteEmpresa || '',
        setorAtuacao: userData.empresa.setorAtuacao || ''
      });
    }
  }, [userData]);

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      [name]: value
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Dados da Empresa
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="CNPJ"
              variant="outlined"
              fullWidth
              value={empresa.cnpj}
              onChange={handleEmpresaChange}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Nome Fantasia"
              variant="outlined"
              fullWidth
              value={empresa.nomeFantasia}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Razão Social"
              variant="outlined"
              fullWidth
              value={empresa.razaoSocial}
              onChange={handleEmpresaChange}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Inscrição Estadual"
              variant="outlined"
              fullWidth
              value={empresa.inscricaoEstadual}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Endereço"
              variant="outlined"
              fullWidth
              value={empresa.endereco}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Número"
              variant="outlined"
              fullWidth
              value={empresa.numero}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Complemento"
              variant="outlined"
              fullWidth
              value={empresa.complemento}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Bairro"
              variant="outlined"
              fullWidth
              value={empresa.bairro}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Cidade"
              variant="outlined"
              fullWidth
              value={empresa.cidade}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="CEP"
              variant="outlined"
              fullWidth
              value={empresa.cep}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Estado"
              variant="outlined"
              fullWidth
              value={empresa.uf}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Telefone"
              variant="outlined"
              fullWidth
              value={empresa.telefone}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Site"
              variant="outlined"
              fullWidth
              value={empresa.site}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="E-Mail"
              variant="outlined"
              fullWidth
              value={empresa.email}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ramo de Atividade"
              variant="outlined"
              fullWidth
              value={empresa.ramoAtividade}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Data de Fundação"
              variant="outlined"
              fullWidth
              value={empresa.dataFundacao}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Número de Funcionários"
              variant="outlined"
              fullWidth
              type="number"
              value={empresa.numFuncionarios}
              onChange={handleEmpresaChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              label="Porte da Empresa"
              variant="outlined"
              fullWidth
              value={empresa.porteEmpresa}
              onChange={handleEmpresaChange}
            >
              <MenuItem value="MEI">MEI - Microempreendedor Individual</MenuItem>
              <MenuItem value="ME">ME - Microempresa</MenuItem>
              <MenuItem value="EPP">EPP - Empresa de Pequeno Porte</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={4}>
            <Select
              label="Setor de Atuação"
              variant="outlined"
              fullWidth
              value={empresa.setorAtuacao}
              onChange={handleEmpresaChange}
            >
              <MenuItem value="comercio">Comércio</MenuItem>
              <MenuItem value="servicos">Serviços</MenuItem>
              <MenuItem value="industria">Indústria</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Business;
