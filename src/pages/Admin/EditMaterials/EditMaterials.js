import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Grid, Paper, TextField, Button, CircularProgress, Container } from '@mui/material';
import { useAuthValue } from '../../../context/AuthContext';
import { useFetchDocument } from '../../../hooks/useFetchDocument';
import { useUpdateDocument } from '../../../hooks/useUpdateDocument';
import styled from 'styled-components';

// Estilizando componentes do Material-UI com styled-components
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

const EditMaterials = () => {
  const { id } = useParams();
  const { user } = useAuthValue();
  const navigate = useNavigate();

  const { document: post = {}, loading: postLoading, error: postError } = useFetchDocument('materials', id);
  const { updateDocument, response } = useUpdateDocument('materials');

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    type: '',
    preview: '',
    link: ''
  });

  useEffect(() => {
    if (post && Object.keys(post).length > 0) {
      setFormData({
        title: post.title || '',
        image: post.image || '',
        type: post.type || '',
        preview: post.preview || '',
        link: post.link || ''
      });
    }
  }, [post]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, image, type, preview, link } = formData;

    if (title && image && type && preview && link) {
      try {
        await updateDocument(id, {
          title,
          image,
          type,
          preview,
          link
        });

        navigate('/admin/postlist');
      } catch (error) {
        console.error('Erro ao atualizar material:', error);
      }
    } else {
      console.error('Todos os campos são necessários');
    }
  };

  if (postLoading) {
    return <div>Carregando...</div>;
  }

  if (!post || Object.keys(post).length === 0) {
    return <div>Dados não encontrados.</div>;
  }

  return (
    <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
      
      <Grid item xs={12}>
        <Paper elevation={2} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: "20px" }}>
        <Typography variant="h4" gutterBottom>
        Editar Material
      </Typography>
      <Typography variant="body1">
        Edite o Material: {post.title}
      </Typography>
        </Paper>
      </Grid>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Editar Material
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Título"
                variant="outlined"
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }} // Exibir label acima do campo
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL da Imagem"
                variant="outlined"
                fullWidth
                name="image"
                value={formData.image}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              {formData.image && (
                <img src={formData.image} alt="Preview da Imagem" style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }} />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tipo de Material"
                variant="outlined"
                fullWidth
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Conteúdo"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="preview"
                value={formData.preview}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Link"
                variant="outlined"
                fullWidth
                name="link"
                value={formData.link}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              {!response.loading ? (
                <StyledButton variant="contained" color="primary" type="submit">
                  Salvar Alterações
                </StyledButton>
              ) : (
                <StyledButton variant="contained" color="primary" disabled>
                  <CircularProgress size={24} />
                  Aguarde ...
                </StyledButton>
              )}
              {(response.error || postError) && (
                <ErrorText>{response.error || postError}</ErrorText>
              )}
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default EditMaterials;
