import * as React from 'react';
import { Typography, TextField, Grid, Paper } from '@mui/material';
import { useAuthValue } from '../../context/AuthContext';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuthValue();
  const { document: userData, loading, error } = useFetchDocument('empresas', user?.uid);

  const [responsavel, setResponsavel] = React.useState({
    nomeCompleto: '',
    cpf: '',
    rg: '',
    orgaoExpedidor: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    telefone: '',
    celular: '',
    email: ''
  });

  React.useEffect(() => {
    if (userData) {
      setResponsavel({
        nomeCompleto: userData.responsavel.nomeCompleto || '',
        cpf: userData.responsavel.cpf || '',
        rg: userData.responsavel.rg || '',
        orgaoExpedidor: userData.responsavel.orgaoExpedidor || '',
        cep: userData.responsavel.cep || '',
        endereco: userData.responsavel.endereco || '',
        numero: userData.responsavel.numero || '',
        bairro: userData.responsavel.bairro || '',
        cidade: userData.responsavel.cidade || '',
        telefone: userData.responsavel.telefone || '',
        celular: userData.responsavel.celular || '',
        email: userData.responsavel.email || ''
      });
    }
  }, [userData]);

  const handleResponsavelChange = async (e) => {
    const { name, value } = e.target;
    setResponsavel((prevResponsavel) => ({
      ...prevResponsavel,
      [name]: value
    }));

    if (name === 'cep' && value.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`);
        const data = response.data;

        // Atualiza o estado com os dados retornados do ViaCEP
        setResponsavel((prevResponsavel) => ({
          ...prevResponsavel,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade
        }));
      } catch (error) {
        console.error('Erro ao consultar CEP:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Dados do Responsável
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nome Completo"
              variant="outlined"
              fullWidth
              value={responsavel.nomeCompleto}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="CPF"
              variant="outlined"
              fullWidth
              value={responsavel.cpf}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="RG"
              variant="outlined"
              fullWidth
              value={responsavel.rg}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Orgão Expedidor"
              variant="outlined"
              fullWidth
              value={responsavel.orgaoExpedidor}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="CEP"
              variant="outlined"
              fullWidth
              value={responsavel.cep}
              onChange={handleResponsavelChange}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Endereço"
              variant="outlined"
              fullWidth
              value={responsavel.endereco}
              onChange={handleResponsavelChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Número"
              variant="outlined"
              fullWidth
              value={responsavel.numero}
              onChange={handleResponsavelChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bairro"
              variant="outlined"
              fullWidth
              value={responsavel.bairro}
              onChange={handleResponsavelChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cidade"
              variant="outlined"
              fullWidth
              value={responsavel.cidade}
              onChange={handleResponsavelChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Telefone"
              variant="outlined"
              fullWidth
              value={responsavel.telefone}
              onChange={handleResponsavelChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Celular"
              variant="outlined"
              fullWidth
              value={responsavel.celular}
              onChange={handleResponsavelChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="E-Mail"
              variant="outlined"
              fullWidth
              value={responsavel.email}
              disabled
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Profile;
