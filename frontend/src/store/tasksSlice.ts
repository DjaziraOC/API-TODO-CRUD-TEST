import { createSlice } from '@reduxjs/toolkit';

// Modèle minimal utilisé côté frontend.
// NB: Le backend peut renvoyer d'autres champs ; ici on ne conserve que ceux nécessaires.
export type Task = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  user?: string;
  createdAt?: string;
};


type TasksState = {
  items: Task[];
};

const initialState: TasksState = {
  items: []
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Remplace complètement la liste (généralement après un fetch GET).
    setTasks: (state, action: { payload: Task[] }) => {
      state.items = action.payload;
    },

    // Supprime une tâche localement (optimistic UI si désiré).
    removeTask: (state, action: { payload: string }) => {
      state.items = state.items.filter((t) => t._id !== action.payload);
    },

    // Insère ou met à jour une tâche selon l'_id.
    // Utile pour synchroniser l'UI après create/update sans relancer un fetch.
    upsertTask: (state, action: { payload: Task }) => {
      const idx = state.items.findIndex((t) => t._id === action.payload._id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    }
  }
});


export const { setTasks, removeTask, upsertTask } = tasksSlice.actions;
export default tasksSlice.reducer;

