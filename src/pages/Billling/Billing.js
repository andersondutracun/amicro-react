import React, { useState, useEffect } from 'react';
import styles from './Billing.module.css';
import { useAuthValue } from '../../context/AuthContext';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { db } from '../../firebase/config';

const Billing = () => {
  const { user } = useAuthValue();
  const { document: userData, loading, error } = useFetchDocument('empresas', user?.uid);

  const [taxaAssociacao, setTaxaAssociacao] = useState('');
  const [pagamentos, setPagamentos] = useState([]);

  useEffect(() => {
    if (userData && userData.taxaAssociacao) {
      setTaxaAssociacao(userData.taxaAssociacao);
    }
  }, [userData]);

  useEffect(() => {
    if (userData && taxaAssociacao) {
      const totalParcelas = calcularTotalParcelas(taxaAssociacao);
      const pagamentos = criarPagamentos(totalParcelas, userData.createdAt);
      setPagamentos(pagamentos);
    }
  }, [userData, taxaAssociacao]);

  const calcularTotalParcelas = (taxa) => {
    if (taxa === 'Mensal') {
      return 12;
    } else if (taxa === 'Semestral') {
      return 2;
    } else if (taxa === 'Anual') {
      return 1;
    }
    return 0;
  };

  const criarPagamentos = (totalParcelas, createdAt) => {
    const dataCadastro = new Date(createdAt.toDate()); 
    const pagamentos = [];

    for (let i = 1; i <= totalParcelas; i++) {
      const dataVencimento = new Date(dataCadastro);
      dataVencimento.setMonth(dataCadastro.getMonth() + i - 1);

      const valorMensal = getValorMensal();
      const mesPagamento = `${dataVencimento.toLocaleString('default', { month: 'long' })} ${dataVencimento.getFullYear()}`;
      const mesPendente = dataVencimento > new Date() ? 'Pendente' : 'Pago';

      pagamentos.push({
        mes: mesPagamento,
        valor: valorMensal,
        status: mesPendente,
        mesNumero: i,
        dataVencimento: dataVencimento.toLocaleDateString(),
      });
    }

    return pagamentos;
  };

  const getValorMensal = () => {
    if (taxaAssociacao === 'Mensal') {
      return '50,00';
    } else if (taxaAssociacao === 'Semestral') {
      return '105,00'; 
    } else if (taxaAssociacao === 'Anual') {
      return '300,00';
    }
    return '0,00'; 
  };

  const handleTaxaAssociacaoChange = (e) => {
    const selectedTaxa = e.target.value;
    setTaxaAssociacao(selectedTaxa);
    const totalParcelas = calcularTotalParcelas(selectedTaxa);
    const pagamentos = criarPagamentos(totalParcelas, userData.createdAt);
    setPagamentos(pagamentos);
  };

  const handlePagamento = (mes) => {
    // Implementar a lógica para processar o pagamento do mês selecionado
    console.log(`Pagamento do mês ${mes} efetuado.`);
  };

  return (
    <div className={styles.billing}>
      <div className={styles.associacao}>
        <h2>Taxa de Associação</h2>
        <select value={taxaAssociacao} onChange={handleTaxaAssociacaoChange}>
          <option value="">Selecione a taxa de associação</option>
          <option value="Mensal">Mensal R$ 50,00</option>
          <option value="Semestral">Semestral R$ 210,00</option>
          <option value="Anual">Anual R$ 300,00</option>
        </select>
      </div>
      <div className={styles.pagamentos}>
        <h2>Pagamentos</h2>
        <table className={styles.tabelaPagamentos}>
          <thead>
            <tr>
              <th>Mês</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Vencimento</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map((pagamento) => (
              <tr key={pagamento.mesNumero}>
                <td>{pagamento.mes}</td>
                <td>R$ {pagamento.valor}</td> 
                <td>{pagamento.status}</td>
                <td>{pagamento.dataVencimento}</td>
                <td>
                  {pagamento.status === 'Pendente' && (
                    <button onClick={() => handlePagamento(pagamento.mes)}>Pagar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
