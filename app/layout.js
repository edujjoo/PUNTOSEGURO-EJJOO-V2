import './globals.css';

export const metadata = { title: 'Punto Seguro', description: 'Gestión preventiva de trabajadores en terreno' };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
