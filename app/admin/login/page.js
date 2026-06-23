'use client'

import { useFormState } from 'react-dom';
import { login } from '../auth-actions';

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null);

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', textAlign: 'center', background: '#111', borderRadius: '12px' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 500 }}>Acceso de Administrador</h1>
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="password" 
          name="password" 
          placeholder="Contraseña" 
          required 
          style={{ 
            padding: '1rem', 
            borderRadius: '6px', 
            background: '#222', 
            color: 'white', 
            border: '1px solid #333',
            fontSize: '1rem'
          }}
        />
        {state?.error && <p style={{ color: '#ff4444', fontSize: '0.875rem' }}>{state.error}</p>}
        <button type="submit" className="btn-primary" style={{ padding: '1rem', width: '100%' }}>
          Ingresar al Panel
        </button>
      </form>
    </div>
  );
}
