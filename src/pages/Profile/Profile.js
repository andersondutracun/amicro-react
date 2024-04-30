import styles from './Profile.module.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthValue } from '../../context/AuthContext';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { db } from '../../firebase/config';

const Profile = () => {
  const { user } = useAuthValue();
 const { document: userData, loading, error } = useFetchDocument('empresas', user?.uid); // Adicionando '?.' para evitar erro se 'user' for nulo
  
  const [responsavel, setResponsavel] = useState({
    nomeCompleto: '',
    cpf: '',
    rg: '',
    orgaoExpedidor: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    telefone: '',
    celular: '',
    email: ''
  });

  useEffect(() => {
    if (userData) {
      setResponsavel({
        nomeCompleto: userData.responsavel.nomeCompleto || '',
        cpf: userData.responsavel.cpf || '',
        rg: userData.responsavel.rg || '',
        orgaoExpedidor: userData.responsavel.orgaoExpedidor || '',
        cep: userData.responsavel.cep || '',
        endereco: userData.responsavel.endereco || '',
        numero: userData.responsavel.numero || '',
        bairro: userData.responsavel.bairro || '',
        cidade: userData.responsavel.cidade || '',
        telefone: userData.responsavel.telefone || '',
        celular: userData.responsavel.celular || '',
        email: userData.responsavel.email || ''
      });
    }
  }, [userData]);

  const handleResponsavelChange = async (e) => {
    const { name, value } = e.target;
    setResponsavel(prevResponsavel => ({
        ...prevResponsavel,
        [name]: value
    }));
  
    if (name === 'cep' && value.length === 8) {
      try {
          const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`);
          const data = response.data;
  
          // Atualiza o estado com os dados retornados do ViaCEP
          setResponsavel(prevResponsavel => ({
              ...prevResponsavel,
              endereco: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade
          }));
      } catch (error) {
          console.error('Erro ao consultar CEP:', error);
      }
  }
  };

  return (
    
    <div className={styles.container}>
    <div className={styles.profiles}> 
      <form>
      <h2>Dados do Responsável</h2>
        <div className={styles.responsavelRow}>
            <input
              type="text"
              name="nomeCompleto"
              value={responsavel.nomeCompleto}
              onChange={handleResponsavelChange}
              placeholder="Nome Completo" disabled
            />
          <input type="text" name="cpf" value={responsavel.cpf} onChange={handleResponsavelChange} placeholder="CPF" disabled/>
          <input type="text" name="rg" value={responsavel.rg} onChange={handleResponsavelChange} placeholder="RG" disabled/>
          <input type="text" name="orgaoExpedidor" value={responsavel.orgaoExpedidor} onChange={handleResponsavelChange} placeholder="Orgão Expedidor" disabled/>
          <input type="text" name="cep" value={responsavel.cep} onChange={handleResponsavelChange} placeholder="CEP" />
          <input type="text" name="endereco" value={responsavel.endereco} onChange={handleResponsavelChange} placeholder="Endereço" />
          <input type="text" name="numero" value={responsavel.numero} onChange={handleResponsavelChange} placeholder="Numero" />
          <input type="text" name="bairro" value={responsavel.bairro} onChange={handleResponsavelChange} placeholder="Bairro" />
          <input type="text" name="cidade" value={responsavel.cidade} onChange={handleResponsavelChange} placeholder="Cidade" />
          <input type="text" name="telefone" value={responsavel.telefone} onChange={handleResponsavelChange} placeholder="Telefone" />
          <input type="text" name="celular" value={responsavel.celular} onChange={handleResponsavelChange} placeholder="Celular" />
          <input type="text" name="email" value={responsavel.email} onChange={handleResponsavelChange} placeholder="E-Mail" disabled/>
        </div>
      </form>
    </div>
    </div>

  )
}

export default Profile
