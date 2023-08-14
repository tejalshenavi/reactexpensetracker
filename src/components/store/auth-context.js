// import React, {useState} from 'react';

// const AuthContext = React.createContext({
//     token: '',
//     isLoggedIn: false,
//     login: () => { }
// });

// export const AuthContextProvider = (props) =>{
//     const initialToken = localStorage.getItem('token');
//     const [token, setToken]= useState(initialToken);

//     const userIsLoggedIn = !!token;

//     const loginHandler = (token, email) =>{
//         localStorage.setItem('token',token);
//         localStorage.setItem('email', email);
//         setToken(token);
//     }

//     const contextValue = {
//         token: token,
//         isLoggedIn: userIsLoggedIn,
//         login: loginHandler,
//     }

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {props.children}
//         </AuthContext.Provider>
//     )
// }

// export default AuthContext;