import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Breadcrumbs,
} from '@mui/material'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed; /* Garante que a tabela ocupe todo o espaço disponível */
`

const StyledTableHead = styled.th`
  background-color: #f0f0f0;
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
`

const StyledTableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  word-wrap: break-word;
`

const PaginationContainer = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin-top: 20px;
`

const PageNumber = styled.li`
  margin-right: 8px;
`

const PageButton = styled.button`
  padding: 8px;
  background-color: ${({ isActive }) => (isActive ? '#007bff' : '#fff')};
  color: ${({ isActive }) => (isActive ? '#fff' : '#007bff')};
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: #0056b3;
    color: #fff;
  }
`

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState({ field: 'displayName', asc: true })
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:3001/admin/users')
        setUsers(response.data)
      } catch (error) {
        console.error('Erro ao carregar usuários:', error)
      }
      setLoading(false)
    }

    loadUsers()
  }, [])

  const handleSort = (field) => {
    setSortBy((prev) => ({
      field,
      asc: prev.field === field ? !prev.asc : true,
    }))
  }

  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      const aValue = a[sortBy.field]
      const bValue = b[sortBy.field]

      if (sortBy.asc) {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    return sorted
  }, [users, sortBy])

  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return sortedUsers
    }

    const normalizedSearch = searchTerm.toLowerCase().trim()
    return sortedUsers.filter(
      (user) =>
        user.displayName.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.role.toLowerCase().includes(normalizedSearch) ||
        (user.ativo === 'true' ? 'Sim' : 'Não').toLowerCase().includes(normalizedSearch),
    )
  }, [sortedUsers, searchTerm])

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const openDeleteModal = (userId) => {
    setDeleteUserId(userId)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteUserId(null)
  }

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3001/admin/users/${userId}`)
      const response = await axios.get('http://localhost:3001/admin/users')
      setUsers(response.data)
      closeDeleteModal()
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
    }
  }

  return (
    <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
      <Grid item xs={12}>
        <Paper elevation={2} style={{ padding: '20px', marginBottom: '20px' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography>Usuários</Typography>
            <Typography>Listar Usuários</Typography>
          </Breadcrumbs>
          <Typography style={{ marginTop: '15px' }} variant="h4" gutterBottom>
            Usuários
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">Gerencie todos os usuários do site.</Typography>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
              <Button variant="outlined" component={Link} to={`/admin/users/createuser`}>
                Criar Usuário
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Lista de Usuários
        </Typography>
        <TextField
          label="Pesquisa"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginTop: '5px', marginBottom: '5px' }}
        />
        <StyledTable>
          <thead>
            <tr>
              <StyledTableHead onClick={() => handleSort('displayName')}>
                Nome {sortBy.field === 'displayName' && (sortBy.asc ? '▲' : '▼')}
              </StyledTableHead>
              <StyledTableHead onClick={() => handleSort('email')}>
                Email {sortBy.field === 'email' && (sortBy.asc ? '▲' : '▼')}
              </StyledTableHead>
              <StyledTableHead onClick={() => handleSort('role')}>
                Cargo {sortBy.field === 'role' && (sortBy.asc ? '▲' : '▼')}
              </StyledTableHead>
              <StyledTableHead onClick={() => handleSort('ativo')}>
                Ativo {sortBy.field === 'ativo' && (sortBy.asc ? '▲' : '▼')}
              </StyledTableHead>
              <StyledTableHead>Ações</StyledTableHead>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.uid}>
                <StyledTableCell>{user.displayName}</StyledTableCell>
                <StyledTableCell>{user.email}</StyledTableCell>
                <StyledTableCell>{user.role}</StyledTableCell>
                <StyledTableCell>{user.ativo === 'true' ? 'Sim' : 'Não'}</StyledTableCell>
                <StyledTableCell>
                  <Button component={Link} to={`/admin/users/edit/${user.uid}`} variant="outlined">
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => openDeleteModal(user.uid)}
                  >
                    Excluir
                  </Button>
                </StyledTableCell>
              </tr>
            ))}
          </tbody>
        </StyledTable>
        <PaginationContainer>
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
            <PageNumber key={i}>
              <PageButton isActive={currentPage === i + 1} onClick={() => paginate(i + 1)}>
                {i + 1}
              </PageButton>
            </PageNumber>
          ))}
        </PaginationContainer>
      </StyledPaper>
      <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal}>
        <DialogTitle>Confirmação de Exclusão</DialogTitle>
        <DialogContent>
          {deleteUserId && (
            <Typography>
              Você está prestes a excluir o usuário:
              <br />
              <strong>
                {filteredUsers.find((user) => user.uid === deleteUserId)?.displayName}
              </strong>
              <br />
              Email: {filteredUsers.find((user) => user.uid === deleteUserId)?.email}
            </Typography>
          )}
          <Typography variant="body2">Tem certeza de que deseja excluir este usuário?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => deleteUser(deleteUserId)} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Users
