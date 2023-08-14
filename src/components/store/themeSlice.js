import { createSlice } from "@reduxjs/toolkit";

const initialThemeState = {darkTheme: false} 

const themeSlice = createSlice({
    name: "themeChange",
    initialState: initialThemeState,
    reducers: {
        toggleTheme(state, action) {
           state.darkTheme = action.payload.value
        }
    }
})

export const themeActions = themeSlice.actions;
export default themeSlice;