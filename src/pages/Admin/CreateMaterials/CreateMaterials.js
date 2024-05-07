import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthValue } from '../../../context/AuthContext';
import { useInsertDocument } from '../../../hooks/useInsertDocument';
import styled from 'styled-components';
import { Container, Typography, TextField, Button, CircularProgress, Grid, Paper } from '@mui/material';

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;


const CreateMaterials = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    type: '',
    preview: '',
    link: ''
  });

  const handleImageChange = async (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      image: value
    }));

    // Example: Fetch image data from a URL if needed
  };

  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument('materials');
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, image, type, preview, link } = formData;

    // Validar campos
    if (!title || !image || !type || !preview || !link) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Inserir documento no banco de dados
    insertDocument({
      title,
      image,
      type,
      preview,
      uid: user.uid,
      createdBy: user.displayName,
      link
    });

    // Navegar para a lista de materiais após a inserção
    navigate('/admin/postlist');
  };

  return (
    <Container maxWidth="xl" style={{ paddingTop: "20px" }}>
      <Grid item xs={12}>
        <Paper elevation={2} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Criar Postagem
          </Typography>
          <Typography variant="body1">
            Criar postagem (Materiais)
          </Typography>
        </Paper>
      </Grid>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Criar Postagem
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL da Imagem"
                variant="outlined"
                fullWidth
                name="image"
                value={formData.image}
                onChange={handleImageChange}
              />
            </Grid>
            <Grid item xs={12}>
              {formData.image && <img src={formData.image} alt="Preview da Imagem" style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }} />}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tipo de Notícia"
                variant="outlined"
                fullWidth
                name="type"
                value={formData.type}
                onChange={handleFormChange}
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
              />
            </Grid>
            <Grid item xs={12}>
              {!response.loading ? (
                <StyledButton variant="contained" color="primary" type="submit">
                  Postar Material
                </StyledButton>
              ) : (
                <StyledButton variant="contained" color="primary" disabled>
                  <CircularProgress size={24} />
                  Aguarde ...
                </StyledButton>
              )}
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default CreateMaterials;
