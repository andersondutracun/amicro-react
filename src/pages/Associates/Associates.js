import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from "react-router-dom";
import styles from './Associates.module.css'
import { useAuthentication } from '../../hooks/useAuthentication';
import { db } from '../../firebase/config';

const Associates = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [isPasswordReset, setIsPasswordReset] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { logout, login, error: authError, loading, resetPassword } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Realizar o login com o email e senha fornecidos
      await login(email, password);

      // Após o login bem-sucedido, verificar se o usuário está ativo
      const user = auth.currentUser;
      const empresaDocRef = db.collection("empresas").doc(user.uid);
      const empresaDoc = await empresaDocRef.get();

      if (empresaDoc.exists) {
        const empresaData = empresaDoc.data();
        const ativo = empresaData.ativo;

        if (!ativo) {
          setError("Usuário não está ativo. Contate o suporte para mais informações.");
          // Realizar o logout, pois o usuário não está ativo
          await logout(); // Certifique-se de importar logout do hook useAuthentication
          return;
        }

        // Usuário está ativo, redirecionar para a página principal
       // navigate("/");
      } else {
        setError("Informações da empresa não encontradas. Contate o suporte para mais informações.");
        // Realizar o logout se não encontrou informações da empresa
        await logout(); // Certifique-se de importar logout do hook useAuthentication
      }
    } catch (error) {
      setError("Email ou senha incorretos. Por favor, verifique e tente novamente.");
    }
  };

  return (
    <div className='section'>
      <div className='header'>
        <div className='container'>
          <div className='banner'>
            <h1>Associados</h1>
            <p>Acesse sua conta de associado e aproveite os benefícios!</p>
          </div>
        </div>
      </div>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.associate}>
            <div className={styles.title}>
              <h1>Seja um Associado</h1>
            </div>
            <div className={styles.content_associate}>
              <p className={styles.subtitle}>
                Torne-se um Associado Amicro e desfrute de vários benefícios
              </p>
              <ul>
                <li>
                  <p>Acesso a download de Materiais</p>
                </li>
                <li>
                  <p>Serviços de Consultoria</p>
                </li>
                <li>
                  <p>Cursos de qualificação</p>
                </li>
                <li>
                  <p>Plano de Saúde</p>
                </li>
                <li>
                  <p>Mentoria empresarial</p>
                </li>
                <li>
                  <p>Consultoria Jurídica</p>
                </li>
              </ul>
              <Link className="btn" to="/associate">
                Seja um Associado
              </Link>
            </div>
          </div>
          <div className={styles.pageLogin}>
            <div className={styles.login}>
              <div className={styles.panel}>
              <h1>{isPasswordReset ? 'Recuperação de Senha' : 'Entrar'}</h1>
                <form onSubmit={handleSubmit}>
                  {isPasswordReset ? (
                    <div>
                      <label>
                        <span>E-mail:</span>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="Insira seu E-mail"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </label>
                      {/* Exibir mensagem de erro */}
                      {error && <p className={styles.msgError}>{error}</p>}
                      {/* Exibir mensagem de sucesso */}
                      {successMessage && <p className={styles.msgSuccess}>{successMessage}</p>}
                      <div className={styles.buttonsRestore}>
                        <button type="button" className={`${styles.btnReturn} btn`} onClick={() => setIsPasswordReset(false)}>Voltar</button> {/* Botão para voltar ao login */}
                        <button className="btn">Enviar</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label>
                        <span>E-mail:</span>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="Insira seu E-mail"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </label>
                      <label>
                        <span>Senha:</span>
                        <input
                          type="password"
                          name="password"
                          required
                          placeholder="Insira a senha"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />
                      </label>
                      <div className={styles.restore}>
                        <button
                          type="button"
                          className={styles.restoreButton}
                          onClick={() => setIsPasswordReset(true)}
                        >
                          Esqueceu sua senha?
                        </button>
                      </div>

                      {!loading && <button className="btn">Entrar</button>}
                      {loading && <button className="btn" disabled>Aguarde... </button>}
                      {error && <p className="error">{error}</p>}
                      
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Associates;
