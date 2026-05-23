import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { api } from '../lib/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { removeTask, setTasks, upsertTask, type Task as TaskT } from '../store/tasksSlice';

const Shell = styled.div`
  min-height: 100vh;
  padding: 24px;
  display: grid;
  justify-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 980px;
  display: grid;
  gap: 16px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const H = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const Button = styled.button`
  cursor: pointer;
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: white;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 860px) {
    grid-template-columns: 340px 1fr;
    align-items: start;
  }
`;

const Panel = styled.div`
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 14px;
  color: rgba(15, 23, 42, 0.85);
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.8);
  margin-top: 10px;
`;

const Input = styled.input`
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 10px 12px;
  outline: none;
  &:focus {
    border-color: rgba(59, 130, 246, 0.65);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }
`;

const Textarea = styled.textarea`
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 10px 12px;
  outline: none;
  min-height: 92px;
  resize: vertical;
  &:focus {
    border-color: rgba(59, 130, 246, 0.65);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }
`;

const Select = styled.select`
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 10px 12px;
  outline: none;
`;

const Primary = styled.button<{ $danger?: boolean }>`
  cursor: pointer;
  margin-top: 14px;
  width: 100%;
  border-radius: 12px;
  padding: 11px 12px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: ${(p) => (p.$danger ? 'rgba(220,38,38,0.1)' : '#2563eb')};
  color: ${(p) => (p.$danger ? 'rgb(127,29,29)' : 'white')};
  font-weight: 700;
`;

const List = styled.div`
  display: grid;
  gap: 10px;
`;

const Item = styled.div`
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 10px;
`;

const ItemTop = styled.div`
  display: flex;
  gap: 12px;
  align-items: start;
  justify-content: space-between;
`;

const Check = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  margin-top: 3px;
`;

const Title = styled.div<{ $done?: boolean }>`
  font-weight: 800;
  text-decoration: ${(p) => (p.$done ? 'line-through' : 'none')};
`;

const Desc = styled.div`
  color: rgba(15, 23, 42, 0.72);
  font-size: 13px;
  white-space: pre-wrap;
`;

const RowActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const SmallBtn = styled.button`
  cursor: pointer;
  border-radius: 12px;
  padding: 8px 10px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: white;
  font-weight: 700;
`;

const Muted = styled.div`
  color: rgba(15, 23, 42, 0.6);
  font-size: 13px;
`;

export default function TasksPage() {
  // Accès au store Redux :
  // - token : nécessaire pour authentifier les requêtes vers le backend
  // - items  : liste des tâches chargées depuis le backend
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { items } = useAppSelector((s) => s.tasks);


  // Un seul état 'loading' est partagé entre :
  // - chargement initial des tâches
  // - création / mise à jour / suppression
  // (ça simplifie mais peut rendre l'UI légèrement moins fine)
  const [loading, setLoading] = useState(false);
  // Message d'erreur affiché dans l'UI (non persisté)
  const [error, setError] = useState<string | null>(null);


  // Champs du formulaire de création de tâche
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Filtres côté client (déjà chargés en mémoire)
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  // Recherche texte côté client (concat title + description)
  const [query, setQuery] = useState('');


  // Chargement des tâches au moment où l'utilisateur est authentifié.
  // Le flag `cancelled` évite de mettre à jour l'état si le composant est démonté.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Contrat: GET /api/tasks renvoie { tasks: [...] }
        const data = await api.tasks.list(token);
        if (!cancelled) dispatch(setTasks(data.tasks as TaskT[]));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, token]);


  // Filtrage + recherche côté client.
  // On sépare en 2 passes :
  // 1) statut (all/active/done)
  // 2) query texte (title + description)
  const filtered = useMemo((): TaskT[] => {
    const q = query.trim().toLowerCase();
    return items
      .filter((t: TaskT) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'done') return t.completed;
        return true;
      })
      .filter((t: TaskT) => {
        if (!q) return true;
        return `${t.title} ${t.description ?? ''}`.toLowerCase().includes(q);
      });
  }, [items, filter, query]);



  // Création d'une tâche via le formulaire.
  // Contrat:
  // - Entrée: title (obligatoire), description optionnelle
  // - Sortie: upsert dans le store pour synchroniser l'UI sans recharger toute la liste
  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setLoading(true);
    try {
      // API: POST /api/tasks { title, description? }
      const created = await api.tasks.create(token, { title, description: description || undefined });

      // Backend renvoie normalement { task }.
      // On upsert pour garder la UI synchronisée.
      const createdTask = created.task as Partial<TaskT> | undefined;

      dispatch(
        upsertTask({
          _id: (createdTask?._id as string) ?? ('tmp-' + Date.now()),
          title: (createdTask?.title as string) ?? title,
          description: createdTask?.description as TaskT['description'],
          completed: Boolean(createdTask?.completed),
          user: createdTask?.user as TaskT['user'],
          createdAt: createdTask?.createdAt as TaskT['createdAt']
        } as TaskT)
      );



      // Reset du formulaire après succès
      setTitle('');
      setDescription('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }


  // Toggle 'completed' d'une tâche.
  // L'UI s'appuie sur la valeur existante `t.completed`.
  async function toggleTask(t: TaskT) {
    if (!token) return;
    setError(null);

    try {
      // API: PUT /api/tasks/:id { completed }
      const updated = await api.tasks.update(token, t._id, { completed: !t.completed });
      // Upsert => mise à jour locale du store
      dispatch(upsertTask(updated.task as TaskT));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    }
  }


  // Suppression d'une tâche par identifiant.
  // On supprime ensuite le state Redux pour refléter immédiatement l'action.
  async function removeTaskById(id: string) {
    if (!token) return;
    setError(null);

    try {
      // API: DELETE /api/tasks/:id
      await api.tasks.remove(token, id);
      dispatch(removeTask(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    }
  }


  return (
    <Shell>
      <Container>
        <TopBar>
          <H>Mes tâches</H>
          <Button
            onClick={() => {
              dispatch(logout());
            }}
          >
            Déconnexion
          </Button>
        </TopBar>

        <Grid>
          <Panel>
            <SectionTitle>Créer une tâche</SectionTitle>
            <form onSubmit={onCreate}>
              <Field>
                <span>Titre</span>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Field>
              <Field>
                <span>Description (optionnel)</span>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>
              <Primary type="submit" disabled={loading}>
                {loading ? '...' : 'Ajouter'}
              </Primary>
            </form>

            <SectionTitle style={{ marginTop: 18 }}>Filtres</SectionTitle>

            <Field>
              <span>Statut</span>
              <Select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'done')}>
                <option value="all">Toutes</option>
                <option value="active">Actives</option>
                <option value="done">Complétées</option>
              </Select>
            </Field>


            <Field>
              <span>Recherche</span>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ex: lait" />
            </Field>

            {error && (
              <Muted style={{ marginTop: 12, color: 'rgb(127,29,29)' }}>⚠ {error}</Muted>
            )}
          </Panel>

          <Panel>
            <SectionTitle>
              {filtered.length} tâche{filtered.length > 1 ? 's' : ''}
            </SectionTitle>

            {loading && items.length === 0 ? (
              <Muted>Chargement...</Muted>
            ) : (
              <List>
                {filtered.map((t) => (
                  <Item key={t._id}>
                    <ItemTop>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <Check checked={t.completed} onChange={() => toggleTask(t)} />
                        <Title $done={t.completed}>{t.title}</Title>
                      </div>
                      <RowActions>
                        <SmallBtn
                          onClick={() => {
                            const nextTitle = prompt('Modifier le titre', t.title);
                            if (nextTitle === null) return;
                            // update title
                            (async () => {
                              if (!token) return;
                              setLoading(true);
                              setError(null);
                              try {
                                const updated = await api.tasks.update(token, t._id, { title: nextTitle });
                                dispatch(upsertTask(updated.task as TaskT));
                              } catch (e) {
                                setError(e instanceof Error ? e.message : 'Erreur');
                              } finally {
                                setLoading(false);
                              }
                            })();
                          }}
                        >
                          Éditer
                        </SmallBtn>
                        <SmallBtn
                          onClick={() => {
                            if (!confirm('Supprimer cette tâche ?')) return;
                            removeTaskById(t._id);
                          }}
                        >
                          Supprimer
                        </SmallBtn>
                      </RowActions>
                    </ItemTop>
                    {t.description ? <Desc>{t.description}</Desc> : null}
                  </Item>
                ))}

                {filtered.length === 0 && !loading && <Muted>Aucune tâche.</Muted>}
              </List>
            )}
          </Panel>
        </Grid>
      </Container>
    </Shell>
  );
}

