import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography, Paper, Grid } from '@mui/material';
import axios from 'axios'; // Importe o Axios para fazer requisições HTTP

const MonthlyProfitLineChart = () => {
  const [monthlyProfitData, setMonthlyProfitData] = useState([]);

  useEffect(() => {
    const fetchMonthlyProfitData = async () => {
      try {
        // Faz uma requisição HTTP para o servidor Node.js que calcula o lucro mensal
        const response = await axios.get('http://localhost:3001/calculateMonthlyProfit');

        // Extrai os dados de lucro mensal da resposta
        const monthlyProfit = response.data.monthlyProfit;

        // Formatando os dados para o formato esperado pelo LineChart
        const formattedData = monthlyProfit.map((value, index) => ({ month: `Mês ${index + 1}`, profit: value }));
        setMonthlyProfitData(formattedData);
      } catch (error) {
        console.error('Erro ao buscar dados de lucro mensal:', error);
      }
    };

    fetchMonthlyProfitData();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h6">Gráfico de Lucro Mensal (em R$)</Typography>
          <LineChart
            data={monthlyProfitData}
            width={500}
            height={300}
          >
          </LineChart>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MonthlyProfitLineChart;
