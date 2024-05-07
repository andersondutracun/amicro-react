import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Container } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { fetchMonthlyPayments } from '../../../hooks/fetchMontlyPayments';

const HomeAdm = () => {
  const [userCount, setUserCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  const fetchUserCount = async () => {
    try {
      const response = await axios.get('http://localhost:3001/countUsers');
      setUserCount(response.data.userCount);
    } catch (error) {
      console.error('Erro ao buscar a quantidade de usuários autenticados:', error);
    }
  };

  const fetchNewsCount = async () => {
    try {
      const response = await axios.get('http://localhost:3001/countNews'); // Rota para contar as postagens de notícias
      setNewsCount(response.data.newsCount);
      console.log(response.data)
    } catch (error) {
      console.error('Erro ao buscar a quantidade de postagens de notícias:', error);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const data = await fetchMonthlyPayments();

      const monthlyDataWithZero = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        value: data[index] || 0,
      }));

      setMonthlyData(monthlyDataWithZero);
    } catch (error) {
      console.error('Erro ao buscar os dados mensais de pagamentos:', error);
    }
  };

  const fetchMaterialsCount = async () => {
    try {
      const response = await axios.get('http://localhost:3001/countMaterials');
      setMaterialsCount(response.data.materialsCount);
    } catch (error) {
      console.error('Erro ao buscar a quantidade de materiais:', error);
    }
  };

  const fetchViewCount = async () => {
    try {
      const response = await axios.get('http://localhost:3001/countViews');
      setViewCount(response.data.viewCount);
      console.log(response.data)
    } catch (error) {
      console.error('Erro ao buscar o total de visualizações:', error);
    }
  };

  useEffect(() => {
  fetchUserCount();
  fetchNewsCount();
  fetchMonthlyData();
  fetchMaterialsCount();
  fetchViewCount(); // Buscar o total de visualizações
}, []);

  return (
    <Container maxWidth="xl" style={{ marginTop: 20}}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={2} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body1">Seja bem-vindo ao painel da Amicro</Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper elevation={3} style={{ padding: 20, backgroundColor: '#ffcc80', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
          <Typography variant="h6" style={{ marginBottom: 10 }}>Usuários</Typography>
          <Typography variant="h4" style={{ alignSelf: 'flex-end', fontSize: '2em' }}>{userCount}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper elevation={3} style={{ padding: 20, backgroundColor: '#90caf9', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
          <Typography variant="h6" style={{ marginBottom: 10 }}>Notícias Postadas</Typography>
          <Typography variant="h4" style={{ alignSelf: 'flex-end', fontSize: '2em' }}>{newsCount}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper elevation={3} style={{ padding: 20, backgroundColor: '#a5d6a7', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
          <Typography variant="h6" style={{ marginBottom: 10 }}>Materiais Postados</Typography>
          <Typography variant="h4" style={{ alignSelf: 'flex-end', fontSize: '2em' }}>{materialsCount}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper elevation={3} style={{ padding: 20, backgroundColor: '#00ff00', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
          <Typography variant="h6" style={{ marginBottom: 10, textAlign: 'left' }}>Visualizações:</Typography>
          <Typography variant="h4" style={{ alignSelf: 'flex-end' }}>{viewCount}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h6">Valores Recebidos por Mês</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h6">Valores Recebidos por Mês</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
    
  </Container>
  );
};

export default HomeAdm;
