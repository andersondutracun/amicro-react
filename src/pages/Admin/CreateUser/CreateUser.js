import React, { useState } from 'react'
import { Box, Grid, TextField, Button, Paper, Typography, Select, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'

const StyledPaper = styled(Paper)({
  padding: '20px',
  marginBottom: '20px',
})

function EmpresaAssociadaForm() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Associado')
  const [showForm, setShowForm] = useState(false)
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
    email: '',
  })

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target
    setEmpresa((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResponsavelChange = (e) => {
    const { name, value } = e.target
    setResponsavel((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/empresa', { empresa, responsavel, email, role })
      alert('Dados salvos com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar os dados', error)
      alert('Erro ao salvar os dados')
    }
  }

  const handleConsultaCNPJ = async () => {
    try {
      const response = await axios.get(`https://api.cnpja.com/${empresa.cnpj}`)
      setEmpresa((prev) => ({
        ...prev,
        ...response.data,
      }))
    } catch (error) {
      console.error('Erro ao consultar CNPJ', error)
      alert('Erro ao consultar CNPJ')
    }
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledPaper elevation={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                displayEmpty
                style={{ marginLeft: '20px', minWidth: '200px' }}
              >
                <MenuItem value="Associado">Associado</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => setShowForm(!showForm)}
            style={{ marginBottom: '20px' }}
          >
            {showForm ? 'Ocultar Formulário' : 'Mostrar Formulário'}
          </Button>
        </Grid>
        {showForm && (
          <Grid item xs={12}>
            <StyledPaper elevation={2}>
              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                  Informações da Empresa
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CNPJ"
                      name="cnpj"
                      value={empresa.cnpj}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleConsultaCNPJ}
                      disabled={!empresa.cnpj}
                    >
                      Consultar CNPJ
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Fantasia"
                      name="nomeFantasia"
                      value={empresa.nomeFantasia}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Razão Social"
                      name="razaoSocial"
                      value={empresa.razaoSocial}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Inscrição Estadual"
                      name="inscricaoEstadual"
                      value={empresa.inscricaoEstadual}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tipo de Logradouro"
                      name="tipoLogradouro"
                      value={empresa.tipoLogradouro}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Endereço"
                      name="endereco"
                      value={empresa.endereco}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Número"
                      name="numero"
                      value={empresa.numero}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Complemento"
                      name="complemento"
                      value={empresa.complemento}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bairro"
                      name="bairro"
                      value={empresa.bairro}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      name="cidade"
                      value={empresa.cidade}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CEP"
                      name="cep"
                      value={empresa.cep}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="UF"
                      name="uf"
                      value={empresa.uf}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      name="telefone"
                      value={empresa.telefone}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Site"
                      name="site"
                      value={empresa.site}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={empresa.email}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ramo de Atividade"
                      name="ramoAtividade"
                      value={empresa.ramoAtividade}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Data de Fundação"
                      name="dataFundacao"
                      value={empresa.dataFundacao}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Número de Funcionários"
                      name="numFuncionarios"
                      value={empresa.numFuncionarios}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Porte da Empresa"
                      name="porteEmpresa"
                      value={empresa.porteEmpresa}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Setor de Atuação"
                      name="setorAtuacao"
                      value={empresa.setorAtuacao}
                      onChange={handleEmpresaChange}
                    />
                  </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                  Informações do Responsável
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      name="nomeCompleto"
                      value={responsavel.nomeCompleto}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CPF"
                      name="cpf"
                      value={responsavel.cpf}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="RG"
                      name="rg"
                      value={responsavel.rg}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Órgão Expedidor"
                      name="orgaoExpedidor"
                      value={responsavel.orgaoExpedidor}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CEP"
                      name="cep"
                      value={responsavel.cep}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Endereço"
                      name="endereco"
                      value={responsavel.endereco}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Número"
                      name="numero"
                      value={responsavel.numero}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bairro"
                      name="bairro"
                      value={responsavel.bairro}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      name="cidade"
                      value={responsavel.cidade}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      name="telefone"
                      value={responsavel.telefone}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={responsavel.email}
                      onChange={handleResponsavelChange}
                    />
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Button variant="contained" color="primary" type="submit">
                    Salvar
                  </Button>
                </Box>
              </Box>
            </StyledPaper>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default EmpresaAssociadaForm
