import styles from './HomeAdm.module.css'

import { useAuthValue } from '../../../context/AuthContext'

const HomeAdm = () => {

  const { user } = useAuthValue();
  console.log(user)
  return (
    
    <aside className={styles.homeadm}>
      
      {user && <h1>Olá </h1>}
      <p>Seja bem vindo ao painel da Amicro</p>
    </aside>
  )
}

export default HomeAdm
