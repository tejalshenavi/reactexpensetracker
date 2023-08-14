import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import themeSlice from "./themeSlice";

const store = configureStore({
  reducer: { auth: authSlice.reducer, theme: themeSlice.reducer}  
});

export default store;