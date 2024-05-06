import React, { useState, useEffect } from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem, Table, TableHead, TableBody, TableRow, TableCell, Button, Paper } from '@mui/material';
import { useAuthValue } from '../../context/AuthContext';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { db } from '../../firebase/config'; // Importe a instância do Firestore

import styles from './Billing.module.css';

const Billing = () => {
  const { user } = useAuthValue();
  const { document: userData, loading, error } = useFetchDocument('empresas', user?.uid);

  const [taxaAssociacao, setTaxaAssociacao] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (userData && userData.taxaAssociacao) {
      setTaxaAssociacao(userData.taxaAssociacao);

      // Função para buscar os pagamentos do usuário
      const fetchUserPayments = async () => {
        try {
          const paymentsRef = db.collection('payments');
          const snapshot = await paymentsRef.where('uid', '==', user.uid).get();

          const userPayments = [];
          snapshot.forEach((doc) => {
            const paymentData = doc.data();
            userPayments.push(paymentData);
          });

          // Atualiza os pagamentos com os dados obtidos do Firestore
          if (userPayments.length > 0) {
            const updatedPayments = payments.map((payment, index) => {
              const matchingPayment = userPayments.find((p) => p.payment === index + 1); // Procura o pagamento correspondente na coleção
              if (matchingPayment) {
                return { ...payment, paidAt: matchingPayment.paidAt };
              }
              return payment;
            });

            setPayments(updatedPayments);
          }
        } catch (error) {
          console.error('Erro ao buscar pagamentos:', error);
        }
      };

      // Chama a função para buscar os pagamentos do usuário
      fetchUserPayments();
    }
  }, [userData, taxaAssociacao, user.uid]);

  return (
    <div style={{ padding: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <div className={styles.associacao}>
          <Typography variant="h5" gutterBottom>
            Taxa de Associação
          </Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Taxa de Associação</InputLabel>
            <Select
              value={taxaAssociacao}
              label="Taxa de Associação"
              onChange={(e) => setTaxaAssociacao(e.target.value)}
            >
              <MenuItem value="">Selecione a taxa de associação</MenuItem>
              <MenuItem value="Mensal">Mensal R$ 50,00</MenuItem>
              <MenuItem value="Semestral">Semestral R$ 210,00</MenuItem>
              <MenuItem value="Anual">Anual R$ 300,00</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <Typography variant="h5" gutterBottom>
            Pagamentos
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mês</TableCell>
                <TableCell>Data de Validade</TableCell>
                <TableCell>Status do Pagamento</TableCell>
                <TableCell>Data de Pagamento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.month}</TableCell>
                  <TableCell>{payment.validade}</TableCell>
                  <TableCell>
                    {payment.paid ? (
                      <Button variant="contained" disabled>
                        Pago
                      </Button>
                    ) : (
                      <Button variant="contained" color="primary">
                        Pagar
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Não pago'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
};

export default Billing;
