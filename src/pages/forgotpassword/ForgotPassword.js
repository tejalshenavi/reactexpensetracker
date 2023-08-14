import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import classes from './ForgotPassword.module.css';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const emailInputRef = useRef();

    const forgotPasswordHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const enteredEmail = emailInputRef.current.value;

        await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDVwF6i9dS799ypPfAAs_hK9hvvxhF1Zfo', {
            method: 'POST',
            body: JSON.stringify({
                requestType: "PASSWORD_RESET",
                email: enteredEmail,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                let errorMessage = "Failed to send reset mail";
                throw new Error(errorMessage);
            }
        }).then((data) => {

            console.log(data);
        }).catch((err) => {
            alert(err.message);
        })
        setIsLoading(false);
    }

    return (
        <section className={classes['forgot-password-section']}>
            <header>Expense Tracker</header>
            <form onSubmit={forgotPasswordHandler}>
                <label htmlFor='text'>Enter your email with which you have registered.</label>
                <input type='email' ref={emailInputRef} required />
                <div className={classes['password-action']}>
                    {!isLoading && <button>Send Link</button>}
                    {isLoading && <p>Loading...</p>}
                </div>
                <p>Already a user? <NavLink to='/auth' style={{color:"beige"}}>Login</NavLink></p>
            </form>
        </section>
    )
}

export default ForgotPassword;