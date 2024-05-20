import React, { useEffect, useState } from 'react'
import {
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material'
import axios from 'axios'

// Função para formatar a data de validade
const formatDate = (timestamp) => {
  if (!timestamp || !timestamp._seconds) return ''

  const date = new Date(timestamp._seconds * 1000) // Multiplicar por 1000 para obter milissegundos
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

const PaymentsUser = ({ userid, value, taxaAssociacao, handleEmpresaChange }) => {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/payments/${userid}`)
        setPayments(response.data)
      } catch (error) {
        console.error('Erro ao localizar pagamento', error)
      }
    }

    fetchPayments()
  }, [userid])

  return (
    <Grid container spacing={2} style={{ marginBottom: '15px' }}>
      <Grid item xs={12} lg={12} sm={12}>
        <Typography variant="h6" color="initial" display="flex" justifyContent="center">
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
                <TableCell>{payment.month}</TableCell> {/* Exibe o mês */}
                <TableCell>{formatDate(payment.valid)}</TableCell> {/* Exibe a data de validade */}
                <TableCell>
                  <Button variant="contained" disabled={payment.paid}>
                    {payment.paid ? 'Pago' : 'Pagar'}
                  </Button>
                </TableCell>
                <TableCell>{payment.paidAt ? formatDate(payment.paidAt) : 'Não pago'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}

export default PaymentsUser
