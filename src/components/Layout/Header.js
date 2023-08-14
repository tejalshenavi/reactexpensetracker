import { useHistory } from 'react-router-dom';

import classes from './Header.module.css';

const Header = () =>{
   const history = useHistory();

   const redirectHandler = () =>{
      history.replace('/welcome');
   }
   const email = localStorage.getItem('email');
   const isAuth = !!email;
   return (
      <header className={classes.header}>
         <h1>Expense Tracker</h1>
         {isAuth && <button onClick={redirectHandler}>Go Back</button>}
      </header>
   )
}

export default Header;