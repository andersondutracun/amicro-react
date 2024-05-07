import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Users.module.css';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

const ErrorText = styled.p`
  color: red;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const StyledTableHead = styled.th`
  background-color: #f0f0f0;
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const StyledTableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #dc3545;

  &:hover {
    background-color: #bd2130;
  }
`;

const PaginationContainer = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const PageNumber = styled.li`
  margin-right: 8px;
`;

const PageButton = styled.button`
  padding: 8px;
  background-color: ${({ isActive }) => (isActive ? '#007bff' : '#fff')};
  color: ${({ isActive }) => (isActive ? '#fff' : '#007bff')};
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #0056b3;
    color: #fff;
  }
`;

const StyledDialog = styled(Dialog)`
  && {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999; /* Garante que o modal esteja na frente de outros elementos */
    background-color: white; /* Cor de fundo do modal */

    .MuiDialogTitle-root {
      padding: 20px 24px;
      background-color: #f8f9fa; /* Cor de fundo do título */
    }

    .MuiDialogContent-root {
      padding: 16px 24px;
    }

    .MuiDialogActions-root {
      padding: 8px 24px;
    }
  }
`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [deleteUserId, setDeleteUserId] = useState(null); // Armazenar o ID do usuário a ser excluído
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controlar a abertura do modal

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  // Paginar usuários
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Mudar de página
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const openDeleteModal = (userId) => {
    const userToDelete = users.find((user) => user.uid === userId);
    setDeleteUserId(userId);
    setIsDeleteModalOpen(true);
  };

  // Função para fechar o modal de exclusão
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteUserId(null);
  };

  // Função para excluir usuário
  const deleteUser = async (userId) => {
    // Exibir caixa de diálogo de confirmação
    try {
      await axios.delete(`http://localhost:3001/admin/users/${userId}`);
      // Recarregar a lista de usuários após a exclusão
      const response = await axios.get('http://localhost:3001/admin/users');
      setUsers(response.data);
      closeDeleteModal();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  return (
    <Container maxWidth="xl" style={{ paddingTop: "20px" }}>
      <Grid item xs={12}> 
        <Paper elevation={2} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: "20px" }}>
          <Typography variant='h4' gutterBottom>
            Usuários
          </Typography>
          <Typography variant="body1">
            Gerencie todos os usuários do site.
          </Typography>
        </Paper>
      </Grid>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>Lista de Usuários</Typography>
       
        {loading ? (
          <p className={styles.loading}>Carregando usuários...</p>
        ) : (
          <>
            <StyledTable>
              <thead>
                <tr>
                  <StyledTableHead>ID</StyledTableHead>
                  <StyledTableHead>Email</StyledTableHead>
                  <StyledTableHead>Nome</StyledTableHead>
                  <StyledTableHead>Cargo</StyledTableHead>
                  <StyledTableHead>Ações</StyledTableHead>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.uid}>
                    <StyledTableCell>{user.uid}</StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>{user.displayName}</StyledTableCell>
                    <StyledTableCell>{user.role}</StyledTableCell>
                    <StyledTableCell>
                      <ActionButtonsContainer>
                        <Button component={Link} to={`/admin/users/edit/${user.uid}`} variant="outlined">
                          Editar
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => openDeleteModal(user.uid)}>
                          Excluir
                        </Button>
                      
                      </ActionButtonsContainer>
                    </StyledTableCell>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            <PaginationContainer>
              {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
                <PageNumber key={i}>
                  <PageButton
                    isActive={currentPage === i + 1}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </PageButton>
                </PageNumber>
              ))}
            </PaginationContainer>
          </>
        )}
        
      </StyledPaper>

      <StyledDialog open={isDeleteModalOpen} onClose={closeDeleteModal}>
        <DialogTitle>Confirmação de Exclusão</DialogTitle>
        <DialogContent>
          {deleteUserId && (
            <Typography>
              Você está prestes a excluir o usuário:
              <br />
              <strong>{users.find((user) => user.uid === deleteUserId)?.displayName}</strong>
              <br />
              Email: {users.find((user) => user.uid === deleteUserId)?.email}
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
      </StyledDialog>


    </Container>

    
  );
};

export default Users;
