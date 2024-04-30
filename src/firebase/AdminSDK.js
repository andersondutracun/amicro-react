const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
// Importar métodos do Firestore corretamente
const { doc, setDoc, updateDoc, getDoc } = require('firebase/firestore');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(cors());

app.use(bodyParser.json());

// Firestore
const db = admin.firestore();

// Rota para obter todos os usuários
app.get('/admin/users', async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName
    }));
    res.json(users);
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    res.status(500).json({ error: 'Erro ao obter usuários' });
  }
});

// Rota para obter um usuário específico
app.get('/admin/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await admin.auth().getUser(userId);
    // Consultar Firestore para obter dados adicionais do usuário
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    // Combinar dados do usuário do Auth e do Firestore
    const mergedData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      birthdate: userData.birthdate,
      cep: userData.cep,
      address: userData.address,
      number: userData.number,
      bairro: userData.bairro,
      cidade: userData.cidade,
      estado: userData.estado,
      phoneNumber: userData.phoneNumber
      // Adicione aqui os campos do Firestore que deseja incluir
      // Exemplo: birthdate: userData.birthdate
    };
    res.json(mergedData);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

// Rota para excluir um usuário
app.delete('/admin/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    await admin.auth().deleteUser(userId);
    // Excluir documento correspondente no Firestore
    await db.collection('users').doc(userId).delete();
    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

// Rota para atualizar um usuário
app.put('/admin/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { displayName, email, birthdate, cep, address,  bairro, cidade, estado, number, phoneNumber } = req.body;
  try {
    // Verificar se o usuário já existe no Firestore
    const userDocRef = db.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
      // Se o documento do usuário não existir, retorna um erro
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualizar os dados do usuário
    await userDocRef.update({
      displayName,
      email,
      birthdate,
      cep,
      address,
      bairro,
      cidade,
      estado,
      number,
      phoneNumber
    });

    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    res.status(500).json({ error: 'Erro ao editar usuário' });
  }
});

app.get('/admin/profile', async (req, res) => {
  const uid = req.headers.uid; // UID do usuário autenticado
  try {
    const user = await admin.auth().getUser(uid);
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();
    const mergedData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      birthdate: userData.birthdate,
      cep: userData.cep,
      address: userData.address,
      number: userData.number,
      bairro: userData.bairro,
      cidade: userData.cidade,
      estado: userData.estado,
      phoneNumber: userData.phoneNumber
      // Adicione aqui os campos do Firestore que deseja incluir
      // Exemplo: birthdate: userData.birthdate
    };
    res.json(mergedData);
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    res.status(404).json({ error: 'Perfil de usuário não encontrado' });
  }
});

// Rota para atualizar o perfil do usuário
app.put('/admin/profile/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { displayName, email, birthdate, cep, address, number, bairro, cidade, estado, phoneNumber } = req.body;
  try {
    // Verificar se o usuário já existe no Firestore
    const userDocRef = db.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
      // Se o documento do usuário não existir, retorna um erro
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualizar os dados do usuário
    await userDocRef.update({
      displayName,
      email,
      birthdate,
      cep,
      address,
      number,
      bairro,
      cidade,
      estado,
      phoneNumber
    });

    res.status(200).json({ message: 'Perfil do usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil do usuário' });
  }
});

app.post('/admin/checkCnpjExists', async (req, res) => {
  const {cnpj} = req.body;

  if (!cnpj) {
    return res.status(400).json({ error: 'CNPJ não fornecido' });
  }

  try {
    const empresasRef = db.collection('empresas');
    const snapshot = await empresasRef.where('empresa.cnpj', '==', cnpj).get();
    console.log('Documentos encontrados:', snapshot.size);
    if (!snapshot.empty) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Erro ao verificar CNPJ:', error);
    res.status(500).json({ error: 'Erro ao verificar CNPJ' });
  }
});

app.post('/user/createUserAndEmpresa', async (req, res) => {
  const { email, password, role, confirmPassword, empresa, responsavel, socios, taxaAssociacao, servicosInteresse, outrosServicos, ativo } = req.body;

  try {
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "As senhas precisam ser iguais!" });
    }

    // Criar usuário no Firebase Authentication
    const user = await admin.auth().createUser({
      email,
      password,
      role
    });

    // Criar objeto com os dados da empresa
    const empresaData = {
      uid: user.uid,
      empresa,
      responsavel,
      taxaAssociacao,
      servicosInteresse,
      ativo
    };

    // Verificar se socios está definido e não é vazio
    if (socios && socios.length > 0) {
      empresaData.socios = socios;
    }

    if (outrosServicos && outrosServicos.length > 0) {
      empresaData.outrosServicos = outrosServicos;
    }

    // Inserir dados da empresa no Firestore
    await admin.firestore().collection('empresas').doc(user.uid).set(empresaData);

    res.status(201).json({ message: 'Usuário e dados da empresa criados com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar usuário ou salvar dados da empresa:', error);
    res.status(500).json({ error: 'Erro ao criar usuário ou salvar dados da empresa', details: error });
  }
});


app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
