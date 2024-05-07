import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Grid, Paper, TextField, Typography } from '@mui/material';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;

const EditUserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [cep, setCep] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/admin/users/${userId}`);
        setUser(response.data);
        setBirthdate(response.data.birthdate ? new Date(response.data.birthdate).toISOString().split('T')[0] : ''); // Convertendo para o formato 'yyyy-MM-dd'
        setCep(response.data.cep || '');
        setAddress(response.data.address || '');
        setBairro(response.data.bairro || '');
        setCidade(response.data.cidade || '');
        setEstado(response.data.estado || '');
        setNumber(response.data.number || '');
        setPhoneNumber(response.data.phoneNumber || '');
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const handleCepChange = async () => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        setAddress(response.data.logradouro);
        setBairro(response.data.bairro);
        setCidade(response.data.localidade);
        setEstado(response.data.uf);
      } catch (error) {
        console.error('Erro ao buscar endereço pelo CEP:', error);
      }
    }
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      const userData = {
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        birthdate: new Date(birthdate).toISOString(), // Convertendo para o formato ISO
        cep,
        address,
        bairro,
        cidade,
        estado,
        number,
        phoneNumber
      };

      await axios.put(`http://localhost:3001/admin/users/${userId}`, userData);
      alert('Usuário atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário');
    }
    setLoading(false);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return <p>Usuário não encontrado</p>;
  }

  return (
    <Container maxWidth="xl" style={{ paddingTop: "20px" }}>
      <Grid item xs={12}>
        <Paper elevation={2} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Editar usuário {user.displayName}
          </Typography>
        </Paper>
      </Grid>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>Editar Usuário</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField label="Nome" variant="outlined" fullWidth name="displayName" value={user.displayName} onChange={e => setDisplayName(e.target.value)}/>
              </Grid>
              <Grid item xs={4}>
                <TextField label="email" variant="outlined" fullWidth name="email" value={user.email} onChange={e => setEmail(e.target.value)}/>
              </Grid>
              <Grid item xs={4}>
                <TextField label="Data de Nascimento" type="date" variant="outlined" fullWidth name="birthdate"  value={birthdate} onChange={e => setBirthdate(e.target.value)} InputLabelProps={{ shrink: true }}/>
              </Grid>              
              <Grid item xs={4}>
                <TextField label="CEP" variant="outlined" fullWidth name="cep"  value={cep} onChange={e => setCep(e.target.value)} InputLabelProps={{ shrink: true }}/>
              </Grid>            
              <Grid item xs={4}>
                <TextField label="Endereço" variant="outlined" fullWidth name="endereco"  value={address} onChange={e => setAddress(e.target.value)} />
              </Grid>       
              <Grid item xs={4}>
                <TextField label="Bairro" variant="outlined" fullWidth name="bairro"  value={bairro} onChange={e => setBairro(e.target.value)} />
              </Grid>    
              <Grid item xs={4}>
                <TextField label="Cidade" variant="outlined" fullWidth name="cidade"  value={cidade} onChange={e => setCidade(e.target.value)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Estado" variant="outlined" fullWidth name="estado"  value={estado} onChange={e => setEstado(e.target.value)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Número" variant="outlined" fullWidth name="numero"  value={number} onChange={e => setNumber(e.target.value)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Número de telefone" variant="outlined" fullWidth name="numero"  value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
              </Grid>
            </Grid>    
            <button className='btn' onClick={handleUpdateUser}>Salvar</button>
            <Link className='btn' to='/admin/users'>Voltar</Link>
        </StyledPaper>
    </Container>
  );
};

export default EditUserPage;
