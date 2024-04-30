import React from 'react'
import styles from './Services.module.css'
import { useState, useEffect } from 'react';
import { useAuthValue } from '../../context/AuthContext';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { db } from '../../firebase/config';

const Billing = () => {
  const { user } = useAuthValue();
  const { document: userData, loading, error } = useFetchDocument('empresas', user?.uid);

    const [servicosInteresse, setServicosInteresse] = useState([]);
    const [outrosServicos, setOutrosServicos] = useState('');

    const handleServicosInteresseChange = (e) => {
        const options = e.target.options;
        const selectedServices = [];
        let outrosSelecionado = false; 
    
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedServices.push(options[i].value);
                if (options[i].value === 'outros') {
                    outrosSelecionado = true;
                }
            }
        }
  
        if (outrosSelecionado && !selectedServices.includes('outros')) {
            setOutrosServicos('');
            selectedServices.push('outros');
        }
    
        setServicosInteresse(selectedServices);
    };
  
      const handleOutrosServicosChange = (e) => {
        setOutrosServicos(e.target.value);
    };

useEffect(() => {
  if (userData) {
    setServicosInteresse(userData.servicosInteresse || '');
  }
}, [userData]);

  return (
    <div className={styles.services}>
        <div className={styles.servico}>
    <h2>Serviços de Interesse (Selecione vários segurando CTRL)</h2>
{/* Opções de serviços de interesse */}
    <select multiple value={servicosInteresse} onChange={handleServicosInteresseChange}>
    <option value="descontos_em_educacao_superior">Descontos em Educação superior</option>
    <option value="cursos_de_qualificacao_empresarial">Cursos de qualificação empresarial</option>
    <option value="cursos_de_qualificacao_dos_funcionarios">Cursos de qualificação dos funcionários</option>
    <option value="palestras_empresariais">Palestras empresariais</option>
    <option value="palestras_para_os_funcionarios">Palestras para os funcionarios</option>
    <option value="consultoria_contabil">Consultoria contábil</option>
    <option value="consultoria_financeira">Consultoria financeira</option>
    <option value="consultoria_de_rh">Consultoria de RH</option>
    <option value="recrutamento_de_pessoas">Recrutamento de pessoas</option>
    <option value="consultoria_vendas">Consultoria vendas</option>
    <option value="consultoria_em_gestao">Consultoria em gestão</option>
    <option value="consultoria_em_tecnologia">Consultoria em tecnologia</option>
    
    <option value="consultoria_em_marketing">Consultoria em Marketing</option>
    <option value="consultoria_em_midias_sociais">Consultoria em mídias sociais</option>
    <option value="consultoria_em_exportacao_ou_importacao">Consultoria em exportação ou importação</option>
    <option value="plano_de_saude">Plano de saúde</option>
    <option value="plano_de_saude_mental">Plano de saúde bucal</option>
    <option value="atendimento_em_saude_mental">Atendimento em saúde mental</option>
    <option value="intermediacao_de_negocios">Intermediação de negócios</option>
    <option value="networking_entre_empresas">Networking entre empresas</option>
    <option value="consultoria_juridica">Consultoria jurídica</option>
    <option value="consultoria_tributaria">Consultoria tributaria</option>
    <option value="coaching_para_gestores">Coaching para Gestores</option>
    <option value="mentoria_empresarial">Mentoria Empresarial</option>
    <option value="outros">Outros</option>
    </select>
    {servicosInteresse.includes('outros') && (
    <input
        type="text"
        value={outrosServicos}
        onChange={handleOutrosServicosChange}
        placeholder="Descreva outros serviços de interesse"
    />
    )}
    </div>
    
  </div>
  )
}

export default Billing
