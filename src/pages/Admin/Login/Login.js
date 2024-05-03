import styles from "./Login.module.css";

import { useEffect, useState } from "react";
import { useAuthentication } from "../../../hooks/useAuthentication";
import { NavLink } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import logo from "../../../images/logo.png"
import logo2 from "../../../images/logo_3.png"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  const { login, error: authError, loading } = useAuthentication();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      email,
      password,
    };

    const res = await login(user);

    console.log(res);
  };

  useEffect(() => {
    console.log(authError);
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
  <>
    <div className={styles.login}>
    <img src={logo} alt="Logo" />
      <div className={styles.panel}>       
        <div className={styles.form}>
          <div className={styles.forms}>
            <div className={styles.sets}>
              <div className={styles.title}>
                <h4>Entrar</h4>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={styles.stack}>
                  <div className={styles.stacklogin}>
                    <label className={styles.stackloginlabel}>
                      Email
                    </label>
                    <div className={styles.stacklogininput}>
                      <input type="email" className={styles.formemail}  required onChange={(e) => setEmail(e.target.value)} value={email}/>
                      <fieldset aria-hidden="true" className={styles.outline}>
                        <legend className={styles.legendOutline}>
                          <span>Email</span>
                        </legend>
                      </fieldset>
                    </div>
                  </div>
                  <div className={styles.stacklogin}>
                    <label className={styles.stackloginlabel}>
                        Senha
                    </label>
                    <div className={styles.stackpasswordinput}>
                      <input type={showPassword? 'text' : 'password'} className={styles.formemail}name="password" required onChange={(e) => setPassword(e.target.value)} value={password} />
                      {showPassword ? (
                        <FaEye
                        onClick={togglePasswordVisibility}
                        className={`${styles.passwordIcon} ${styles.hidden}`}
                      />    
                        ) : (
                          <FaEyeSlash
                          onClick={togglePasswordVisibility}
                          className={`${styles.passwordIcon} ${styles.visible}`}
                        />
                        )}
                      <fieldset aria-hidden="true" className={styles.outline}>
                        <legend className={styles.legendOutline}>
                          <span>Senha</span>
                        </legend>
                      </fieldset>
                    </div>
                  </div>
                  <div>
                    <NavLink className={styles.resetpassword} to="/user/resetpassword">
                      Esqueceu sua senha?
                    </NavLink>
                  </div>
                  {!loading && <button className={styles.button} onClick={handleSubmit}>Entrar</button>}
                  {loading && (<button className={styles.button} disabled>Aguarde... </button>
                )}
                </div>
                
                {error && <p className="error">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    </>
  );
};

export default Login;


