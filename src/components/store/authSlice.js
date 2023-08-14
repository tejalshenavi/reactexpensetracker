import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem('token');
const initialAuthState = {isAuthenticated: false, token: initialToken, email: null}

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true
            state.token = action.payload.token
            state.email = action.payload.email
        },
        logout(state) {
            state.isAuthenticated = false
            state.token = null
            state.email = null
        }
    }
})

export const authActions = authSlice.actions;
export default authSlice;