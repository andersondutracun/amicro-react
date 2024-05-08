import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Grid, MenuItem, Paper, TextField, Typography, Select, Button } from '@mui/material';
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
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/admin/users/${userId}`);
        setUser(response.data);

        console.log(user);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      const userData = {
        displayName,
        email,
        birthdate: new Date(birthdate).toISOString(),
        cep,
        address,
        bairro,
        cidade,
        estado,
        number,
        phoneNumber,
        role: selectedRole // Use o selectedRole em vez do user.role
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
    <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>Editar Usuário</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="Nome" variant="outlined" fullWidth name="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="Email" variant="outlined" fullWidth name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="Data de Nascimento" type="date" variant="outlined" fullWidth name="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="CEP" variant="outlined" fullWidth name="cep" value={cep} onChange={(e) => setCep(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="Endereço" variant="outlined" fullWidth name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="Bairro" variant="outlined" fullWidth name="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="Cidade" variant="outlined" fullWidth name="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="Estado" variant="outlined" fullWidth name="estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="Número" variant="outlined" fullWidth name="number" value={number} onChange={(e) => setNumber(e.target.value)} />
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <TextField label="Número de Telefone" variant="outlined" fullWidth name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4} sm={6}>
            <Typography variant="h6">Cargo</Typography>
            <Select
              label="Cargo"
              variant="outlined"
              fullWidth
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <MenuItem value="Associado">Associado</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Gestao">Gestão de usuários</MenuItem>
              <MenuItem value="Admin">Administrador</MenuItem>
            </Select>
          </Grid>
        </Grid>
        
        <Button variant="contained" color="primary" onClick={handleUpdateUser}>Salvar</Button>
        <Link to="/admin/users" style={{ marginLeft: '10px' }}>Voltar</Link>
      </StyledPaper>
    </Container>
  );
};

export default EditUserPage;
