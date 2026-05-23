import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
  email?: string;
  username?: string;
};

const initialState: AuthState = {
  token: null
};

// Slice d'authentification.
// Conserve le token JWT (persisté via redux-persist) + quelques infos utilisateur.
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Stocke les crédentials après login/register.
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; email?: string; username?: string }>
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.username = action.payload.username;
    },

    // Déconnexion: on vide le token.
    logout: (state) => {
      state.token = null;
      state.email = undefined;
      state.username = undefined;
    }
  }
});


export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

