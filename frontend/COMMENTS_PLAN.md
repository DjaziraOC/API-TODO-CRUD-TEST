# Plan: Ajouter des commentaires dans les fichiers React (frontend)

## Information Gathered
- `frontend/src/pages/TasksPage.tsx` : page principale TODO (création, listing, filtres, édition via `prompt`, suppression, toggle completed). Utilise `styled-components`, hooks React, et Redux slices (`authSlice`, `tasksSlice`).
- `frontend/src/pages/AuthPage.tsx` : page login/register (state mode, champs, appel `api.auth.login/register`, dispatch `setCredentials`, navigation).
- `frontend/src/lib/api.ts` : client fetch (base URL via `import.meta.env`, gestion erreurs, endpoints auth/tasks).
- `frontend/src/store/tasksSlice.ts` : reducers `setTasks`, `removeTask`, `upsertTask`.
- `frontend/src/store/authSlice.ts` : reducers `setCredentials`, `logout`.
- `frontend/src/store/store.ts` : configureStore + redux-persist (whitelist auth).
- `frontend/src/store/types.ts` : types Redux.

## Plan
1. Ajouter des commentaires explicatifs (JSDoc / commentaires inline) dans :
   - `TasksPage.tsx`
     - rôle des états (`loading`, `error`, `title`, `description`, `filter`, `query`).
     - intention des `useEffect` (chargement tâches au login).
     - logique `filtered` (filtres + recherche).
     - intention des handlers (`onCreate`, `toggleTask`, `removeTaskById`).
     - points UX/risques : `prompt`/confirm, gestion `loading` concurrent, cas `loading && items.length === 0`.
   - `AuthPage.tsx`
     - rôle de `mode` (login/register), champs, `title` via `useMemo`.
     - intention `onSubmit` et gestion erreurs.
   - (optionnel mais utile) `api.ts` et slices : commentaires pour la structure des requêtes, mapping erreurs, et reducers.
2. Garder les commentaires concis mais utiles : expliquer le *pourquoi* et le *contrat* (entrées/sorties), pas relire toute la logique.
3. Vérifier que rien n’est cassé : pas de changement fonctionnel, seulement ajout de commentaires.

## Dependent Files to be edited
- `frontend/src/pages/TasksPage.tsx`
- `frontend/src/pages/AuthPage.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/store/tasksSlice.ts`
- `frontend/src/store/authSlice.ts`
- `frontend/src/store/store.ts`


## Followup steps
- Lancer `npm test` si existant, ou `npm run build`/`npm run lint` dans `frontend`.
- Vérifier le build TypeScript.

<ask_followup_question>
Confirme : tu veux uniquement des commentaires sur les fichiers *React pages* (`TasksPage.tsx` et `AuthPage.tsx`), ou tu veux aussi commenter `frontend/src/lib/api.ts` et les slices Redux pour clarifier le fonctionnement global ?
</ask_followup_question>

