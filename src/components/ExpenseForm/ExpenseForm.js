import { Link, useHistory } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

import classes from './ExpenseForm.module.css';
//import AuthContext from '../store/auth-context';
import { authActions } from '../store/authSlice';

const ExpenseForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  //const authCtx = useContext(AuthContext);
  const history = useHistory();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDVwF6i9dS799ypPfAAs_hK9hvvxhF1Zfo'
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDVwF6i9dS799ypPfAAs_hK9hvvxhF1Zfo'
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((res) => {
      setIsLoading(false);
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data) => {
          let errorMessage = "Authetication failed";
          throw new Error(errorMessage);
        })
      }
    })
      .then((data) => {
       // authCtx.login(data.idToken, enteredEmail);
       const email = enteredEmail.replace('@','').replace('.','');
       dispatch(authActions.login({token: data.idToken, email: email}))
       localStorage.setItem('email', email)
       localStorage.setItem('token',data.idToken);
        history.replace("/welcome");
      })
      .catch((err) => {
        alert(err.message);
      })
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler} >
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input
            type='email'
            id='email'
            required
            ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Confirm Password</label>
          <input
            type='password'
            id='confirmpassword'
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request...</p>}
          {isLogin && <Link to='/forgot-password' style={{color:"black", marginTop: "0.5rem"}}>Forgot Password?</Link>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ExpenseForm;