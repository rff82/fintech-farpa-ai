import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>404 - Página não encontrada</h1>
      <p style={{ margin: '1rem 0' }}>A página que você procura não existe.</p>
      <Link to="/" className="btn btn-primary">
        Voltar ao início
      </Link>
    </div>
  )
}
