import { useHistory } from 'react-router-dom';
import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import classes from './ProfilePage.module.css';
//import AuthContext from '../../components/store/auth-context';

const ProfilePage = () => {
    const token = useSelector(state => state.auth.token);
    const nameInputRef = useRef();
    const photoUrlInputRef = useRef();
   // const authCtx = useContext(AuthContext);
    const history = useHistory();

    const formSumbitHandler = (event) => {
        event.preventDefault();
        const enteredName = nameInputRef.current.value;
        const enteredPhotoUrl = photoUrlInputRef.current.value;
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDVwF6i9dS799ypPfAAs_hK9hvvxhF1Zfo'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                //idToken: authCtx.token,
                idToken: token,
                displayName: enteredName,
                photoUrl: enteredPhotoUrl,
                returnSecureToken: true,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                let errorMessage = "Failed to update Details";
                throw new Error(errorMessage);
            }
        }).then((data) => {
            console.log(data);
        }).catch((error) => {
            alert(error.message);
        })
    }

    const cancelButtonHandler = () => {
        history.replace('/welcome');
    }

    useEffect(() => {
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDVwF6i9dS799ypPfAAs_hK9hvvxhF1Zfo', {
            method: 'POST',
            body: JSON.stringify({
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
                let errorMessage = "Failed to fetch Details";
                throw new Error(errorMessage);
            }
        }).then((data) => {
            //  const email = localStorage.getItem('email');
            const users = data.users;
            users.forEach((user) => {
                //  if(user.email === email){
                if (user.displayName !== undefined && user.photoUrl !== undefined) {
                    nameInputRef.current.value = user.displayName;
                    photoUrlInputRef.current.value = user.photoUrl;
                }
                //  }
            })

        }).catch((error) => {
            alert(error.message);
        })
    }, [token]);

    return (
        <section >
            <div className={classes.heading}>
                <h1>Winners never quite, Quitters never win.</h1>
                <p>Your Profile is 64% completed. A complete Profile has
                    higher chances of landing a job. Complete now
                </p>
            </div>
            <div className={classes.profile}>

                <div className={classes.title}>
                    <header>Contact Details</header>
                    <button onClick={cancelButtonHandler}>Cancel</button>
                </div>
                <form onSubmit={formSumbitHandler}>
                    <div className={classes['profile-info']}>
                        <label htmlFor='text'>Full Name</label>
                        <input type='text' id='name' ref={nameInputRef} required />
                        <label htmlFor='text'>Profile Photo URL</label>
                        <input type='text' id='url' ref={photoUrlInputRef} required />
                    </div>
                    <div className={classes.actions}>
                        <button>Update</button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ProfilePage;