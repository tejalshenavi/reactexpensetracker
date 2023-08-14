//import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import classes from './WelcomePage.module.css';
import { authActions } from "../../components/store/authSlice";
//import AuthContext from "../../components/store/auth-context";

const WelcomePage = () => {
    //const authCtx = useContext(AuthContext);
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const dispatch = useDispatch();

    const verifyEmailHandler = () => {
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDVwF6i9dS799ypPfAAs_hK9hvvxhF1Zfo'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                requestType: "VERIFY_EMAIL",
                //idToken: authCtx.token,
                idToken: token,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                let errorMessage = "Failed to Verify Email";
                throw new Error(errorMessage);
            }
        }).then((data) => {
            console.log(data);
            alert("Please check your mail to verify account");
        }).catch((err) => {
            alert(err.message);
        })
    }

    const logoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        dispatch(authActions.logout())
        history.replace('/auth');
    }

    const addClickHandler = () => {
        history.replace('/expenses');
    }

    return (
        <>
            <section className={classes.welcome}>
                <h1>Welcome to Expense Tracker!!!</h1>
                <div className={classes['actions-logout']}>
                    <p>Your profile is Incomplete.<Link to="/profile">Complete now</Link></p>
                    <button onClick={logoutHandler}>Logout</button>
                </div>
            </section>
            <div className={classes.actions}>
                <button onClick={verifyEmailHandler}>Verify Email</button>
                <button onClick={addClickHandler}>Add Expenses</button>
            </div>
        </>
    )
}

export default WelcomePage;