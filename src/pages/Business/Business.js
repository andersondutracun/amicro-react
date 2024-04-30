import React from 'react'
import styles from './Business.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthValue } from '../../context/AuthContext';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { db } from '../../firebase/config';

const Business = () => {
  const { user } = useAuthValue();
  const { document: userData, loading, error } = useFetchDocument('empresas', user?.uid);
  
  const [empresa, setEmpresa] = useState({
    cnpj: '',
    nomeFantasia: '',
    razaoSocial: '',
    inscricaoEstadual: '',
    tipoLogradouro: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    uf: '',
    telefone: '',
    site: '',
    email: '',
    ramoAtividade: '',
    dataFundacao: '',
    numFuncionarios: '',
    porteEmpresa: '',
    setorAtuacao: ''
});

useEffect(() => {
  if (userData) {
    setEmpresa({
      cnpj: userData.empresa.cnpj || '',
      nomeFantasia: userData.empresa.nomeFantasia || '',
      razaoSocial: userData.empresa.razaoSocial || '',
      inscricaoEstadual: userData.empresa.inscricaoEstadual || '',
      tipoLogradouro: userData.empresa.tipoLogradouro || '',
      endereco: userData.empresa.endereco || '',
      numero: userData.empresa.numero || '',    
      complemento: userData.empresa.complemento || '',
      bairro: userData.empresa.bairro || '',
      cidade: userData.empresa.cidade || '',
      cep: userData.empresa.cep || '',
      uf: userData.empresa.uf || '',
      telefone: userData.empresa.telefone || '', 
      site: userData.empresa.site || '',
      email: userData.empresa.email || '',
      ramoAtividade: userData.empresa.ramoAtividade || '',
      dataFundacao: userData.empresa.dataFundacao || '',
      numFuncionarios: userData.empresa.numFuncionarios || '',
      porteEmpresa: userData.empresa.porteEmpresa || '',
      setorAtuacao: userData.empresa.setorAtuacao || ''
    });
  }
}, [userData]);

const handleEmpresaChange = (e) => {
  const { name, value } = e.target;
  setEmpresa(prevEmpresa => ({
      ...prevEmpresa,
      [name]: value
  }));
};


  return (
    <div className={styles.container}>
    <div className={styles.profiles}> 
      <form>
      <h2>Dados da Empresa</h2>
                <div className={styles.cnpjRow}>
                  <input type="text" name="cnpj" value={empresa.cnpj} onChange={handleEmpresaChange} placeholder="CNPJ" disabled/>
                </div>
                <div className={styles.formRow}>
                  <input type="text" name="nomeFantasia" value={empresa.nomeFantasia} onChange={handleEmpresaChange} placeholder="Nome Fantasia" />
                  <input type="text" name="razaoSocial" value={empresa.razaoSocial} onChange={handleEmpresaChange} placeholder="Razão Social" disabled/>
                  <input type="text" name="inscricaoEstadual" value={empresa.inscricaoEstadual} onChange={handleEmpresaChange} placeholder="Inscrição Estadual" />
                  <input type="text" name="tipoLogradouro" value={empresa.tipoLogradouro} onChange={handleEmpresaChange} placeholder="Tipo de Logradouro (Rua, Alameda, Avenida)" />
                  <input type="text" name="endereco" value={empresa.endereco} onChange={handleEmpresaChange} placeholder="Endereço" />
                  <input type="text" name="numero" value={empresa.numero} onChange={handleEmpresaChange} placeholder="Número" />                
                  <input type="text" name="complemento" value={empresa.complemento} onChange={handleEmpresaChange} placeholder="Complemento" />
                  <input type="text" name="bairro" value={empresa.bairro} onChange={handleEmpresaChange} placeholder="Bairro" />
                  <input type="text" name="cep" value={empresa.cep} onChange={handleEmpresaChange} placeholder="CEP" />
                  <input type="text" name="cidade" value={empresa.cidade} onChange={handleEmpresaChange} placeholder="Cidade" />
                  <input type="text" name="estado" value={empresa.estado} onChange={handleEmpresaChange} placeholder="Estado" />
                  <input type="text" name="telefone" value={empresa.telefone} onChange={handleEmpresaChange} placeholder="Telefone" />
                  <input type="text" name="site" value={empresa.site} onChange={handleEmpresaChange} placeholder="Site" />
                  <input type="text" name="email" value={empresa.email} onChange={handleEmpresaChange} placeholder="E-Mail" />
                  <input type="text" name="ramoAtividade" value={empresa.ramoAtividade} onChange={handleEmpresaChange} placeholder="Ramo de Atividade" />
                  <input type="text" name="dataFundacao" value={empresa.dataFundacao} onChange={handleEmpresaChange} placeholder="Data de Fundação" />
                  <input type="number" name="numFuncionarios" value={empresa.numFuncionarios} onChange={handleEmpresaChange} placeholder="Número de Funcionários" />
                  <select name="porteEmpresa" value={empresa.porteEmpresa} onChange={handleEmpresaChange}>
                      <option value="">Selecione o Porte da Empresa</option>
                      <option value="MEI">MEI - Microempreendedor Individual</option>
                      <option value="ME">ME - Microempresa</option>
                      <option value="EPP">EPP - Empresa de Pequeno Porte</option>
                  </select>
                  <select name="setorAtuacao" value={empresa.setorAtuacao} onChange={handleEmpresaChange}>
                      <option value="">Selecione o Setor de Atuação da Empresa</option>
                      <option value="comercio">Comércio</option>
                      <option value="servicos">Serviços</option>
                      <option value="industria">Industria</option>
                  </select>
                </div>
      </form>
    </div>
    </div>
  )
}

export default Business
