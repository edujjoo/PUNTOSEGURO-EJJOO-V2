'use client';
import { useFormState } from 'react-dom';
import { login } from './actions';

export default function Login() {
  const [estado, accion] = useFormState(login, null);
  return (
    <main className="login">
      <form action={accion} className="box">
        <h1>Punto Seguro</h1>
        <p className="mu">Acceso del administrador</p>
        <label>Correo<input name="email" type="email" required autoComplete="username" /></label>
        <label>Contraseña<input name="password" type="password" required autoComplete="current-password" /></label>
        {estado?.error && <p className="err">{estado.error}</p>}
        <button className="p">Entrar</button>
      </form>
    </main>
  );
}
