import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tasksReducer from './tasksSlice';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Configuration redux-persist.
// On persiste uniquement `auth` (token) pour garder l'utilisateur connecté au refresh.
const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};


const store = configureStore({
  reducer: {
    // Cast pour satisfaire les types Redux Toolkit + redux-persist
    auth: persistReducer(rootPersistConfig as unknown as never, authReducer) as never,
    tasks: tasksReducer
  } as unknown as { auth: typeof authReducer; tasks: typeof tasksReducer },

  // `serializableCheck: false` car redux-persist peut introduire des valeurs non-serialisables.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});

// persistor permet à <PersistGate /> (si présent) de contrôler la rehydratation.
const persistor = persistStore(store);

export { store, persistor };


