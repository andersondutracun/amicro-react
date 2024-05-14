import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import {
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Select,
  Button,
} from '@mui/material'
import styled from 'styled-components'

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`

const EditUserPage = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
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
    setorAtuacao: '',
  })

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
    estado: '',
  })

  const [email, setEmail] = useState('')

  const [socios, setSocios] = useState([])

  const [taxaAssociacao, setTaxaAssociacao] = useState('')

  const [servicosInteresse, setServicosInteresse] = useState([])
  const [outrosServicos, setOutrosServicos] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:3001/admin/users/${userId}`)
        const userData = response.data[0]

        setEmpresa({
          cnpj: userData.empresa.cnpj,
          nomeFantasia: userData.empresa.nomeFantasia,
          razaoSocial: userData.empresa.razaoSocial,
          inscricaoEstadual: userData.empresa.inscricaoEstadual,
          tipoLogradouro: userData.empresa.tipoLogradouro,
          endereco: userData.empresa.endereco,
          numero: userData.empresa.numero,
          complemento: userData.empresa.complemento,
          bairro: userData.empresa.bairro,
          cidade: userData.empresa.cidade,
          cep: userData.empresa.cep,
          uf: userData.empresa.uf,
          telefone: userData.empresa.telefone,
          site: userData.empresa.site,
          email: userData.empresa.email,
          ramoAtividade: userData.empresa.ramoAtividade,
          dataFundacao: userData.empresa.dataFundacao,
          numFuncionarios: userData.empresa.numFuncionarios,
          porteEmpresa: userData.empresa.porteEmpresa,
          setorAtuacao: userData.empresa.setorAtuacao,
        })

        setEmail(userData.email)

        setResponsavel({
          nomeCompleto: userData.responsavel.nomeCompleto,
          cpf: userData.responsavel.cpf,
          rg: userData.responsavel.rg,
          orgaoExpedidor: userData.responsavel.orgaoExpedidor,
          cep: userData.responsavel.cep,
          endereco: userData.responsavel.endereco,
          numero: userData.responsavel.numero,
          bairro: userData.responsavel.bairro,
          cidade: userData.responsavel.cidade,
          telefone: userData.responsavel.telefone,
          celular: userData.responsavel.celular,
          estado: userData.responsavel.estado,
        })
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
      }
      setLoading(false)
    }

    fetchUser()
  }, [userId])

  const handleResponsavelChange = async (e) => {
    const { name, value } = e.target
    setResponsavel((prevResponsavel) => ({
      ...prevResponsavel,
      [name]: value,
    }))

    if (name === 'cep' && value.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`)
        const data = response.data

        setResponsavel((prevResponsavel) => ({
          ...prevResponsavel,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }))
      } catch (error) {
        console.error('Erro ao consultar CEP:', error)
      }
    }
  }

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      [name]: value,
    }))
  }

  const handleUpdateUser = async () => {
    setLoading(true)
    try {
      const userData = {
        role: selectedRole, // Use o selectedRole em vez do user.role
      }

      await axios.put(`http://localhost:3001/admin/users/${userId}`, userData)
      alert('Usuário atualizado com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      alert('Erro ao atualizar usuário')
    }
    setLoading(false)
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
      <StyledPaper elevation={3}>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            Dados do Responsável
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} sm={6}>
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                name="displayName"
                value={responsavel.nomeCompleto}
                onChange={handleResponsavelChange}
              />
            </Grid>
            <Grid item xs={12} lg={6} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={email}
                onChange={handleResponsavelChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Data de Nascimento"
                type="date"
                variant="outlined"
                fullWidth
                name="birthdate"
                value={responsavel.birthdate}
                onChange={handleResponsavelChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="CEP"
                variant="outlined"
                fullWidth
                name="cep"
                value={responsavel.cep}
                onChange={handleResponsavelChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Endereço"
                variant="outlined"
                fullWidth
                name="address"
                value={responsavel.endereco}
                onChange={handleResponsavelChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Bairro"
                variant="outlined"
                fullWidth
                name="bairro"
                value={responsavel.bairro}
                onChange={handleResponsavelChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Cidade"
                variant="outlined"
                fullWidth
                name="cidade"
                value={responsavel.cidade}
                onChange={handleResponsavelChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Estado"
                variant="outlined"
                fullWidth
                name="estado"
                value={responsavel.estado}
                onChange={handleResponsavelChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Número"
                variant="outlined"
                fullWidth
                name="number"
                value={responsavel.numero}
                onChange={handleResponsavelChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Número de Telefone"
                variant="outlined"
                fullWidth
                name="phoneNumber"
                value={responsavel.celular}
                onChange={handleResponsavelChange}
              />
            </Grid>
          </Grid>
        </StyledPaper>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            Dados da Empresa
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="CNPJ"
                variant="outlined"
                fullWidth
                name="displayName"
                value={empresa.cnpj}
                onChange={handleEmpresaChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Nome Fantasia"
                variant="outlined"
                fullWidth
                name="email"
                value={email}
                onChange={handleEmpresaChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Data de Nascimento"
                type="date"
                variant="outlined"
                fullWidth
                name="birthdate"
                value={responsavel.birthdate}
                onChange={handleEmpresaChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="CEP"
                variant="outlined"
                fullWidth
                name="cep"
                value={responsavel.cep}
                onChange={handleEmpresaChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Endereço"
                variant="outlined"
                fullWidth
                name="address"
                value={responsavel.endereco}
                onChange={handleEmpresaChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Bairro"
                variant="outlined"
                fullWidth
                name="bairro"
                value={responsavel.bairro}
                onChange={handleEmpresaChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Cidade"
                variant="outlined"
                fullWidth
                name="cidade"
                value={responsavel.cidade}
                onChange={handleEmpresaChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Estado"
                variant="outlined"
                fullWidth
                name="estado"
                value={responsavel.estado}
                onChange={handleEmpresaChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Número"
                variant="outlined"
                fullWidth
                name="number"
                value={responsavel.numero}
                onChange={handleEmpresaChange}
              />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <TextField
                label="Número de Telefone"
                variant="outlined"
                fullWidth
                name="phoneNumber"
                value={responsavel.celular}
                onChange={handleEmpresaChange}
              />
            </Grid>
          </Grid>
        </StyledPaper>
        <StyledPaper elevation={3}>
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
        </StyledPaper>

        <Button variant="contained" color="primary" onClick={handleUpdateUser}>
          Salvar
        </Button>
        <Link to="/admin/users" style={{ marginLeft: '10px' }}>
          Voltar
        </Link>
      </StyledPaper>
    </Container>
  )
}

export default EditUserPage
