//import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import './App.css';

import Header from './components/Layout/Header';
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import WelcomePage from './pages/welcome/WelcomePage';
//import AuthContext from './components/store/auth-context';
import ProfilePage from './pages/profile/ProfilePage';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';
import Expenses from './pages/Expenses/Expenses';

function App() {
  // const authCtx = useContext(AuthContext);
  const isLoggedIn = useSelector(state => state.auth.isAuthenticated);
  const userEmail = useSelector(state => state.auth.email);
  const userToken = useSelector(state => state.auth.token);

  useEffect(() => {
    console.log("useeffect called");
    if (isLoggedIn) {
      console.log(isLoggedIn)
      localStorage.setItem('email', userEmail);
      localStorage.setItem('token', userToken);
    }
  }, [isLoggedIn, userEmail, userToken])

  const email = localStorage.getItem('email');
  const isAuth = !!email;
  console.log(isAuth)

  return (
    <Switch>
      <Route path='/' exact>
        {!isAuth && <Redirect to='/auth' />}
        {isAuth && <Redirect to='/welcome' />}
      </Route>
      <Route path="/auth">
        <Header />
        <ExpenseForm />
      </Route>
      <Route path="/welcome">
        {isAuth && <WelcomePage />}
        {!isAuth && <Redirect to="/auth" />}
      </Route>
      <Route path="/profile">
        <ProfilePage />
      </Route>
      <Route path="/forgot-password">
        <ForgotPassword />
      </Route>
      <Route path="/expenses">
        <Header />
       {isAuth && <Expenses />}
       {!isAuth && <Redirect to="/auth" />}
      </Route>
      <Route path='*'>
        <Redirect to='/' />
      </Route>
    </Switch>
  );
}

export default App;
