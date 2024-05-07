import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFetchDocuments } from "../../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../../hooks/useDeleteDocment";
import styled from "styled-components";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";

const SectionPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardContent = styled.div`
  flex: 1;
`;

const PageButton = styled(Button)`
  && {
    margin-right: 5px;
    color: ${(props) => (props.current ? "#fff" : "#000")};
    background-color: ${(props) => (props.current ? "#007bff" : "transparent")};

    &:hover {
      background-color: ${(props) => (props.current ? "#007bff" : "#f0f0f0")};
    }
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

const Dashboard = () => {
  const [currentPageMaterials, setCurrentPageMaterials] = useState(1);
  const [currentPageNews, setCurrentPageNews] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // State para controlar o modal de confirmação
  const itemsPerPage = 5;

  const { documents: materials, loading: materialsLoading } = useFetchDocuments("materials");
  const { deleteDocument: deleteMaterial } = useDeleteDocument("materials");

  const { documents: news, loading: newsLoading } = useFetchDocuments("news");
  const { deleteDocument: deleteNews } = useDeleteDocument("news");

  const currentMaterials =
    materials && materials.length > 0 ? materials.slice((currentPageMaterials - 1) * itemsPerPage, currentPageMaterials * itemsPerPage) : [];

  const currentNews =
    news && news.length > 0 ? news.slice((currentPageNews - 1) * itemsPerPage, currentPageNews * itemsPerPage) : [];

  const paginateMaterials = (pageNumber) => setCurrentPageMaterials(pageNumber);
  const paginateNews = (pageNumber) => setCurrentPageNews(pageNumber);

  const handleDeleteConfirmation = (item) => {
    setDeleteConfirmation(item);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation) {
      if (deleteConfirmation.type === "material") {
        deleteMaterial(deleteConfirmation.id);
      } else if (deleteConfirmation.type === "news") {
        deleteNews(deleteConfirmation.id);
      }
    }
    setDeleteConfirmation(null);
  };

  const handleCloseModal = () => {
    setDeleteConfirmation(null);
  };

  return (
    <Container maxWidth="xl" style={{ paddingTop: "20px"}}>
      <Grid item xs={12}>
        <Paper elevation={2} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: "20px" }}>
        <Typography variant="h4" gutterBottom>
        Lista de Postagens
      </Typography>
      <Typography variant="body1">
        Gerencie todas as postagens feitas no site.
      </Typography>
        </Paper>
      </Grid>

      {/* Materiais */}
      <SectionPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Materiais ({materials ? materials.length : 0} postagens)
        </Typography>
        {materialsLoading ? (
          <CircularProgress />
        ) : (
          <>
            {currentMaterials.length > 0 ? (
              currentMaterials.map((material) => (
                <CardContainer key={material.id}>
                  <CardContent>
                    <Typography variant="subtitle1">{material.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Criador: {material.createdBy}
                    </Typography>
                  </CardContent>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <Button component={Link} to={`/posts/${material.id}`} variant="outlined" color="primary">
                      Ver
                    </Button>
                    <Button component={Link} to={`/admin/materials/post/edit/${material.id}`} variant="outlined">
                      Editar
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteConfirmation({ id: material.id, type: "material", title: material.title, createdBy: material.createdBy })}>
                      Excluir
                    </Button>
                  </div>
                </CardContainer>
              ))
            ) : (
              <Typography variant="body1">Não foram encontrados materiais</Typography>
            )}
            {/* Paginação para materiais */}
            {materials && materials.length > itemsPerPage && (
              <div style={{ marginTop: "20px" }}>
                {Array.from({ length: Math.ceil(materials.length / itemsPerPage) }, (_, i) => (
                  <PageButton
                    key={i + 1}
                    variant="outlined"
                    current={i + 1 === currentPageMaterials}
                    onClick={() => paginateMaterials(i + 1)}
                  >
                    {i + 1}
                  </PageButton>
                ))}
              </div>
            )}
          </>
        )}
      </SectionPaper>

      {/* Notícias */}
      <SectionPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Notícias ({news ? news.length : 0} postagens)
        </Typography>
        {newsLoading ? (
          <CircularProgress />
        ) : (
          <>
            {currentNews.length > 0 ? (
              currentNews.map((newsItem) => (
                <CardContainer key={newsItem.id}>
                  <CardContent>
                    <Typography variant="subtitle1">{newsItem.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Criador: {newsItem.createdBy}
                    </Typography>
                  </CardContent>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <Button component={Link} to={`/newsletter/post/${newsItem.id}`} variant="outlined" color="primary">
                      Ver
                    </Button>
                    <Button component={Link} to={`/admin/newsletter/post/edit/${newsItem.id}`} variant="outlined">
                      Editar
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteConfirmation({ id: newsItem.id, type: "news", title: newsItem.title, createdBy: newsItem.createdBy })}>
                      Excluir
                    </Button>
                  </div>
                </CardContainer>
              ))
            ) : (
              <Typography variant="body1">Não foram encontradas notícias</Typography>
            )}
            {/* Paginação para notícias */}
            {news && news.length > itemsPerPage && (
              <div style={{ marginTop: "20px" }}>
                {Array.from({ length: Math.ceil(news.length / itemsPerPage) }, (_, i) => (
                  <PageButton
                    key={i + 1}
                    variant="outlined"
                    current={i + 1 === currentPageNews}
                    onClick={() => paginateNews(i + 1)}
                  >
                    {i + 1}
                  </PageButton>
                ))}
              </div>
            )}
          </>
        )}
      </SectionPaper>

      {/* Modal de confirmação */}
      <StyledDialog open={Boolean(deleteConfirmation)} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent dividers>
          {deleteConfirmation && (
            <Typography variant="body1">
              Tem certeza que deseja excluir a postagem <strong>{deleteConfirmation.title}</strong> criada por{" "}
              <strong>{deleteConfirmation.createdBy}</strong>?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
</StyledDialog>
    </Container>
  );
};

export default Dashboard;
