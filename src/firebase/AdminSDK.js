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
    const users = [];

    for (const userRecord of listUsersResult.users) {
      const userData = {}; 

      const userDocRef = db.collection('empresas').doc(userRecord.uid);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userDataFromFirestore = userDoc.data();
        userData.role = userDataFromFirestore.role; 
      } else {
        userData.role = 'No role assigned';
      }

      if (userDoc.exists) {
        const userDataFromFirestore = userDoc.data();
        userData.ativo = userDataFromFirestore.ativo; 
      } else {
        userData.ativo = 'No role assigned';
      }

      const user = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: userData.role,
        ativo: userData.ativo
      };

      users.push(user);
    }

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
    // Consultar Firestore para obter documentos na coleção "empresas" relacionados ao userId
    const userDocsSnapshot = await db.collection('empresas').where('userId', '==', userId).get();
    
    if (userDocsSnapshot.empty) {
      // Se não há documentos correspondentes, retornar uma resposta indicando que o usuário não foi encontrado
      return res.status(404).json({ error: 'Nenhum documento encontrado para este usuário' });
    }

    // Array para armazenar os dados encontrados
    const userData = [];

    // Iterar sobre os documentos encontrados
    userDocsSnapshot.forEach((doc) => {
      // Obter dados do documento atual
      const userDataFromDoc = doc.data();
      // Adicionar dados ao array
      userData.push(userDataFromDoc);
    });

    // Retornar os dados encontrados como resposta
    res.json(userData);
  } catch (error) {
    console.error('Erro ao obter dados do usuário no Firestore:', error);
    res.status(500).json({ error: 'Erro ao obter dados do usuário' });
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
  const { displayName, email, role, birthdate, cep, address,  bairro, cidade, estado, number, phoneNumber } = req.body;
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
      role,
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
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "As senhas precisam ser iguais!" });
    }

    const user = await admin.auth().createUser({
      displayName: responsavel.nomeCompleto,
      email,
      password,
    });

    const empresaData = {
      uid: user.uid,
      role: "associado",
      empresa,
      responsavel,
      email,
      taxaAssociacao,
      servicosInteresse,
      ativo
    };

    if (socios && socios.length > 0) {
      empresaData.socios = socios;
    }

    if (outrosServicos && outrosServicos.length > 0) {
      empresaData.outrosServicos = outrosServicos;
    }

    await admin.firestore().collection('empresas').doc(user.uid).set(empresaData);

    res.status(201).json({ message: 'Usuário e dados da empresa criados com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar usuário ou salvar dados da empresa:', error);
    res.status(500).json({ error: 'Erro ao criar usuário ou salvar dados da empresa', details: error });
  }
});

app.get('/countUsers', async (req, res) => {
  try {
    const userRecords = await admin.auth().listUsers();
    const userCount = userRecords.users.length;

    res.json({ userCount });
  } catch (error) {
    console.error('Erro ao contar usuários autenticados:', error);
    res.status(500).json({ error: 'Erro ao contar usuários autenticados' });
  }
});

app.get('/countNews', async (req, res) => {
  try {
    const newsRef = db.collection('news');
    const snapshot = await newsRef.get();
    const newsCount = snapshot.size; 

    res.json({ newsCount });
  } catch (error) {
    console.error('Erro ao contar as postagens de notícias:', error);
    res.status(500).json({ error: 'Erro ao contar as postagens de notícias' });
  }
});

app.get('/countMaterials', async (req, res) => {
  try {
    const materialsRef = db.collection('materials');
    const snapshot = await materialsRef.get();
    const materialsCount = snapshot.size; // Tamanho da coleção (número de documentos)

    res.json({ materialsCount });
  } catch (error) {
    console.error('Erro ao contar os materiais:', error);
    res.status(500).json({ error: 'Erro ao contar os materiais' });
  }
});

app.post('/admin/monthlyPayments', async (req, res) => {
  const { year, month } = req.body; // Ano e mês dos pagamentos a serem calculados

  try {
    // Consultar os pagamentos do mês e ano especificados
    const paymentsRef = collection(db, 'payments');
    const q = query(
      paymentsRef,
      where('payment', '==', true), // Considerar apenas pagamentos confirmados
      where('year', '==', year), // Filtrar pelo ano especificado
      where('month', '==', month) // Filtrar pelo mês especificado
    );
    const snapshot = await getDocs(q);

    let totalPayments = 0;

    snapshot.forEach((doc) => {
      const payment = doc.data();
      totalPayments += payment.value;
    });

    const monthlyPaymentsDocRef = doc(db, 'monthlyPayments', `${year}-${month}`);
    await setDoc(monthlyPaymentsDocRef, {
      year,
      month,
      totalPayments,
    });

    res.status(200).json({ message: `Pagamentos do mês ${month}/${year} calculados e salvos com sucesso.` });
  } catch (error) {
    console.error('Erro ao calcular e salvar os pagamentos mensais:', error);
    res.status(500).json({ error: 'Erro ao calcular e salvar os pagamentos mensais' });
  }
});

app.get('/countViews', async (req, res) => {
  try {
    const viewsSnapshot = await db.collection('views').get();
    const totalViews = viewsSnapshot.size;
    res.json({ viewCount: totalViews });
  } catch (error) {
    console.error('Erro ao contar visualizações:', error);
    res.status(500).json({ error: 'Erro ao contar visualizações' });
  }
});

app.post('/recordView', async (req, res) => {
  try {
    const viewsRef = db.collection('views');
    await viewsRef.add({ timestamp: new Date() });
    res.status(200).send('Visualização registrada com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar visualização:', error);
    res.status(500).json({ error: 'Erro ao registrar visualização' });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});


