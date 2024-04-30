import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { doc, getDoc } from 'firebase/firestore';

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  const checkIfIsCancelled = () => {
    // Função para verificar se o hook foi cancelado
    return;
  };

  const createUser = async (data) => {
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(user, {
        displayName: data.displayName,
        role: data.role
      });

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log("UID encontrado:", user.uid);
      } else {
        console.error("UID do usuário não encontrado após o tempo de espera");
      }

      return user;
    } catch (error) {
      let systemErrorMessage;

      if (error.code.includes("Password")) {
        systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
      } else if (error.code.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setError(systemErrorMessage);
    }

    setLoading(false);
  };

  const logout = () => {
    signOut(auth);
    setIsAuthenticated(false); // Define autenticação como false ao fazer logout
  };

  const login = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);

      const empresaDocRef = doc(db, 'empresas', auth.currentUser.uid);
      const empresaDocSnap = await getDoc(empresaDocRef);

      if (empresaDocSnap.exists()) {
        const empresaData = empresaDocSnap.data();
        const ativo = empresaData.ativo;

        if (!ativo) {
          throw new Error("Usuário não está ativo. Contate o suporte para mais informações.");
        }
      } else {
        throw new Error("Informações da empresa não encontradas. Contate o suporte para mais informações.");
      }

      setIsAuthenticated(true); // Define como autenticado se o login for bem-sucedido
      navigate("/"); // Redireciona para a página principal após o login
    } catch (error) {
      console.error("Erro durante o login:", error);
      setError(error.message || "Ocorreu um erro durante o login. Por favor, tente novamente.");
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => checkIfIsCancelled();
  }, []);

  return {
    auth,
    createUser,
    error,
    logout,
    login,
    loading,
    isAuthenticated,
  };
};
