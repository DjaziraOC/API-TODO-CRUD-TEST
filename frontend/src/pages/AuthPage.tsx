import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../lib/api';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/authSlice';

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 460px;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 20px;
`;

const Row = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 12px;
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: rgba(15, 23, 42, 0.8);
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

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  flex: 1;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  padding: 11px 12px;
  font-weight: 600;
  background: ${(p) => (p.$primary ? '#2563eb' : 'white')};
  color: ${(p) => (p.$primary ? 'white' : 'rgba(15, 23, 42, 0.9)')};
  transition: transform 0.05s ease;
  &:active {
    transform: scale(0.99);
  }
`;

const ErrorText = styled.div`
  margin-top: 12px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(220, 38, 38, 0.25);
  background: rgba(220, 38, 38, 0.08);
  color: rgb(127, 29, 29);
  font-size: 13px;
`;

export default function AuthPage() {
  // Dispatch Redux: on stocke le token et les infos utilisateur après login/register.
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // mode = 'login' => écran de connexion, mode = 'register' => inscription.
  const [mode, setMode] = useState<'login' | 'register'>('login');


  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Loading/Erreur UI pour éviter des doubles soumissions et afficher les messages.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Titre dépend du mode (login vs register).
  const title = useMemo(() => (mode === 'login' ? 'Connexion' : 'Inscription'), [mode]);


  // Soumission du formulaire (login ou register selon `mode`).
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        // Contrat API: POST /api/auth/login => { token, user }
        const data = await api.auth.login({ email, password });
        dispatch(
          setCredentials({
            token: data.token,
            email: data.user?.email,
            username: data.user?.username
          })
        );
      } else {
        // Contrat API: POST /api/auth/register => { token, user }
        const data = await api.auth.register({ username, email, password });
        dispatch(
          setCredentials({
            token: data.token,
            email: data.user?.email,
            username: data.user?.username
          })
        );
      }

      // Redirection après réussite.
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }


  return (
    <Page>
      <Card>
        <Title>{title}</Title>
        <form onSubmit={onSubmit}>
          <Row>
            {mode === 'register' && (
              <Field>
                <span>Nom</span>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
              </Field>
            )}
            <Field>
              <span>Email</span>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                autoComplete="username"
              />
            </Field>
            <Field>
              <span>Mot de passe</span>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </Field>
          </Row>

          <Actions>
            <Button type="submit" $primary disabled={loading}>
              {loading ? '...' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
            </Button>
            <Button type="button" onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}>
              {mode === 'login' ? 'Inscription' : 'Connexion'}
            </Button>
          </Actions>

          {error && <ErrorText>{error}</ErrorText>}
        </form>
      </Card>
    </Page>
  );
}

