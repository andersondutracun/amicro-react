import { db } from '../firebase/config'; // Importe a referência para o Firestore corretamente
import { collection, getDocs } from 'firebase/firestore';

export const fetchMonthlyPayments = async () => {
  const paymentsCol = collection(db, 'payments');
  const snapshot = await getDocs(paymentsCol);
  const monthlyData = {};

  snapshot.forEach((doc) => {
    const payment = doc.data();
    const payedAt = new Date(payment.payedAt);
    const month = payedAt.getMonth(); // Índice de mês (0 a 11)

    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }

    if (payment.payment) { // Supondo que 'payment' é true para pagamentos recebidos
      monthlyData[month] += payment.value;
    }
  });

  return monthlyData;
};