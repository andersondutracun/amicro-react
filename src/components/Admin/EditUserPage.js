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
  Box,
  Tabs,
  Tab,
} from '@mui/material'
import styled from 'styled-components'

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  

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

        setTaxaAssociacao(userData.taxaAssociacao)

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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Dados do Responsável" {...a11yProps(0)} />
          <Tab label="Dados da Empresa" {...a11yProps(1)} />
          <Tab label="Sócios" {...a11yProps(2)} />
          <Tab label="Taxa de Associação" {...a11yProps(3)} />
          <Tab label="Serviços" {...a11yProps(4)} />
          <Tab label="Dados de Acesso" {...a11yProps(5)} />
          <Tab label="Cargo" {...a11yProps(6)} />
          <Tab label="Status" {...a11yProps(7)} />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>
                Dados do Responsável
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Nome"
                    variant="outlined"
                    fullWidth
                    name="displayName"
                    value={responsavel.nomeCompleto}
                    onChange={handleResponsavelChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="CPF"
                    variant="outlined"
                    fullWidth
                    name="cpf"
                    value={responsavel.cpf}
                    onChange={handleResponsavelChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="RG"
                    type="text"
                    variant="outlined"
                    fullWidth
                    name="rg"
                    value={responsavel.rg}
                    onChange={handleResponsavelChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Orgão Expedidor"
                    variant="outlined"
                    fullWidth
                    name="orgaoExpedidor"
                    value={responsavel.orgaoExpedidor}
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
                    name="endereco"
                    value={responsavel.endereco}
                    onChange={handleResponsavelChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Numero"
                    variant="outlined"
                    fullWidth
   Taxa                 name="numero"
                    value={responsavel.numero}
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
                    label="Telefone"
                    variant="outlined"
                    fullWidth
                    name="telefone"
                    value={responsavel.telefone}
                    onChange={handleResponsavelChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Celular"
                    variant="outlined"
                    fullWidth
                    name="celular"
                    value={responsavel.celular}
                    onChange={handleResponsavelChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="E-Mail"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={email}
                    onChange={handleResponsavelChange}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
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
                    name="nomeFantasia"
                    value={empresa.nomeFantasia}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Razão Social"
                    type="text"
                    variant="outlined"
                    fullWidth
                    name="razaoSocial"
                    value={empresa.razaoSocial}
                    onChange={handleEmpresaChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Inscrição Estadual"
                    variant="outlined"
                    fullWidth
                    name="inscricaoEstadual"
                    value={empresa.inscricaoEstadual}
                    onChange={handleEmpresaChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Tipo de Logradouro (Rua, Alameda, Avenida)"
                    variant="outlined"
                    fullWidth
                    name="tipoLogradouro"
                    value={empresa.tipoLogradouro}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Endereço"
                    variant="outlined"
                    fullWidth
                    name="endereco"
                    value={empresa.endereco}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Número"
                    variant="outlined"
                    fullWidth
                    name="numero"
                    value={empresa.numero}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Complemento"
                    variant="outlined"
                    fullWidth
                    name="complemento"
                    value={empresa.complemento}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Bairro"
                    variant="outlined"
                    fullWidth
                    name="bairro"
                    value={empresa.bairro}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="CEP"
                    variant="outlined"
                    fullWidth
                    name="cep"
                    value={empresa.cep}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Cidade"
                    variant="outlined"
                    fullWidth
                    name="cidade"
                    value={empresa.cidade}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Estado"
                    variant="outlined"
                    fullWidth
                    name="estado"
                    value={empresa.estado}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Telefone"
                    variant="outlined"
                    fullWidth
                    name="telefone"
                    value={empresa.telefone}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Site"
                    variant="outlined"
                    fullWidth
                    name="site"
                    value={empresa.site}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="E-Mail"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={empresa.email}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Ramo de Atividade"
                    variant="outlined"
                    fullWidth
                    name="ramoAtividade"
                    value={empresa.ramoAtividade}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Data de Fundação"
                    variant="outlined"
                    fullWidth
                    name="dataFundacao"
                    value={empresa.dataFundacao}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <TextField
                    label="Número de Funcionários"
                    variant="outlined"
                    fullWidth
                    name="numFuncionarios"
                    value={empresa.numFuncionarios}
                    onChange={handleEmpresaChange}
                  />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <Select
                    label="Porte da Empresa"
                    variant="outlined"
                    fullWidth
                    name="porteEmpresa"
                    value={empresa.porteEmpresa}
                    onChange={handleEmpresaChange}
                  >
                    <MenuItem value="MEI">MEI - Microempreendedor Individual</MenuItem>
                    <MenuItem value="ME">ME - Microempresa</MenuItem>
                    <MenuItem value="EPP">EPP - Empresa de Pequeno Porte</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                  <Select
                    label="Setor de Atuação"
                    variant="outlined"
                    fullWidth
                    name="setorAtuacao"
                    value={empresa.setorAtuacao}
                    onChange={handleEmpresaChange}
                  >
                    <MenuItem value="comercio">Comércio</MenuItem>
                    <MenuItem value="servicos">Serviços</MenuItem>
                    <MenuItem value="industria">Industria</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </StyledPaper>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <StyledPaper elevation={3}>
              Socios
            </StyledPaper>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <StyledPaper elevation={3}>
              <Grid item xs={12} lg={4} sm={6}>
                  <Select
                    label="Taxa de Associação"
                    variant="outlined"
                    fullWidth
                    name="taxaAssociacao"
                    value={taxaAssociacao}
                    onChange={handleEmpresaChange}
                  >
                    <MenuItem value="Mensal">Mensal R$ 50,00</MenuItem>
                    <MenuItem value="Semestral">Semestral R$ 210,00</MenuItem>
                    <MenuItem value="Anual">Anual R$ 300,00</MenuItem>
                  </Select>
                </Grid>
            </StyledPaper>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <StyledPaper elevation={3}>
              Serviços
            </StyledPaper>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <StyledPaper elevation={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={12} sm={12}>
                  <Typography>Para mudar o email de acesso do usuário, utilize o campo a baixo</Typography>
                </Grid>
                <Grid item xs={12} lg={12} sm={12}>
                  <TextField
                    label="E-Mail"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={email}
                    onChange={handleResponsavelChange}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={6}>
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
          </CustomTabPanel>
          <CustomTabPanel value={value} index={7}>
            <StyledPaper elevation={3}>
              Status
            </StyledPaper>
          </CustomTabPanel>
        </Box>
        
        
        

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
