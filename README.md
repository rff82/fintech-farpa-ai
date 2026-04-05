# HealthTech CDHR1

Plataforma de Ciência Aberta dedicada à compreensão e monitoramento de distrofias retinianas, com foco especial no gene CDHR1.

## 🎯 Objetivo

Criar uma plataforma educacional acessível que combine:
- **Museu Educacional**: Conteúdo sobre o gene CDHR1 e distrofias retinianas
- **Simulador de Visão**: Visualização interativa da progressão da doença
- **Feed de Descobertas**: Acesso a pesquisas científicas atualizadas

## ♿ Acessibilidade

O site segue os padrões **WCAG 2.2 AAA**, incluindo:
- Alto contraste ajustável
- Navegação por teclado completa
- Suporte a leitores de tela
- Imagens com descrições detalhadas
- Tipografia legível

## 🚀 Início Rápido

### Desenvolvimento Local

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`

### Deploy no Cloudflare Pages

```bash
npm run deploy
```

## 📁 Estrutura do Projeto

```
health-farpa-ai/
├── index.html           # Landing page
├── pages/
│   ├── museum.html      # Museu Educacional
│   ├── simulator.html   # Simulador de Visão
│   └── discoveries.html # Descobertas Científicas
├── css/
│   └── style.css        # Estilos globais
├── js/
│   └── script.js        # Scripts interativos
└── package.json         # Configuração do projeto
```

## 🔧 Configuração do Cloudflare

O projeto está configurado para usar os seguintes recursos do Cloudflare:

- **D1 Database**: `health-db` - Armazenamento de dados estruturados
- **R2 Storage**: `health-assets` - Armazenamento de arquivos
- **KV Store**: `health-kv-store` - Cache e dados em tempo real
- **Vectorize**: `health-vector-store` - Índice vetorial para RAG

## 📝 Licença

MIT

## 👥 Contribuições

Este é um projeto de ciência aberta. Contribuições são bem-vindas!

## 📞 Contato

Para dúvidas ou sugestões, abra uma issue no repositório GitHub.
