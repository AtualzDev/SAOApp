# 🏥 Sistema SAO - Gestão Integrada de Assistência Social

<div align="center">

![SAO System](https://img.shields.io/badge/SAO-Sistema_de_Assistência-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Plataforma completa para gestão de estoque, assistência social, logística e administração de instituições beneficentes**

[🚀 Demo](#) • [📖 Documentação](#) • [🐛 Reportar Bug](https://github.com/AtualzDev/SAOApp/issues)

</div>

---

## 📋 Sobre o Projeto

O **Sistema SAO** é uma solução completa e integrada desenvolvida para otimizar a gestão de instituições de assistência social. O sistema oferece controle total sobre:

- 📦 **Gestão de Estoque** - Controle de entradas, saídas, validades e níveis críticos
- 👥 **Assistência Social** - Cadastro e acompanhamento de beneficiários
- 🚚 **Logística** - Gerenciamento de rotas e entregas
- 💰 **Financeiro** - Controle de doações, despesas e relatórios
- 📊 **Relatórios** - Dashboards e análises em tempo real
- 🏥 **Módulo Médico** - Agendamentos e prontuários (em desenvolvimento)

---

## ✨ Funcionalidades Principais

### 🎯 Gestão de Estoque
- ✅ Lançamento de entradas (doações/compras) com controle automático de estoque
- ✅ Edição completa de lançamentos com reversão inteligente de estoque
- ✅ Controle de validade com alertas automáticos
- ✅ Categorização por setores (Alimentação, Limpeza, Escritório, etc.)
- ✅ Rastreamento de fornecedores e instituições beneficiadas
- ✅ Histórico completo de movimentações

### 👨‍👩‍👧‍👦 Assistência Social
- 📝 Cadastro completo de beneficiários
- 🔍 Sistema de busca e filtros avançados
- 📋 Solicitações de cestas básicas e kits
- 📊 Acompanhamento de atendimentos

### 🚛 Logística
- 🗺️ Planejamento de rotas de entrega
- 📍 Controle de endereços e regiões
- ⏱️ Agendamento de entregas

### 💼 Administração
- 👤 Gestão de usuários e permissões
- 🏢 Controle de unidades/filiais
- 📈 Relatórios gerenciais
- ⚙️ Configurações do sistema

---

## 🛠️ Tecnologias Utilizadas

### Frontend
```
React 19.2.3          - Biblioteca UI
TypeScript 5.8.2      - Tipagem estática
Vite 6.2.0           - Build tool
Lucide React 0.562.0 - Ícones
Tailwind CSS         - Estilização (planejado)
```

### Backend
```
Node.js + Express 4.18.2  - API REST
Supabase 2.39.0          - Banco de dados PostgreSQL
Nodemon 3.0.2            - Hot reload (dev)
CORS 2.8.5               - Segurança
dotenv 16.3.1            - Variáveis de ambiente
```

### Banco de Dados
```
PostgreSQL (via Supabase)
- Tabelas: produtos, categorias, fornecedores, unidades
- Tabelas: lancamentos, lancamentos_itens
- RLS (Row Level Security) configurado
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/AtualzDev/SAOApp.git
cd SAOApp
```

### 2️⃣ Instale as dependências

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/`:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anon_do_supabase
PORT=3001
```

### 4️⃣ Execute o projeto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

O sistema estará disponível em:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

---

## 📁 Estrutura do Projeto

```
SAOApp/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── config/            # Configuração Supabase
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── routes/            # Rotas da API
│   │   └── server.js          # Servidor principal
│   ├── database/              # Schemas SQL
│   └── package.json
│
├── components/                 # Componentes React
│   ├── auth/                  # Login, cadastro, recuperação
│   ├── stock/                 # Gestão de estoque
│   ├── social/                # Assistência social
│   ├── logistics/             # Rotas e entregas
│   ├── financial/             # Financeiro
│   ├── management/            # Administração
│   ├── medical/               # Módulo médico
│   ├── layout/                # Sidebar, header
│   └── common/                # Componentes reutilizáveis
│
├── services/                   # Serviços de API
│   ├── inventoryService.ts    # CRUD de estoque
│   ├── supabase.ts            # Cliente Supabase
│   └── geminiService.ts       # IA (futuro)
│
├── utils/                      # Utilitários
├── App.tsx                     # Componente principal
└── package.json
```

---

## 🔑 Principais Endpoints da API

### Produtos
```http
GET    /api/inventory/products          # Listar produtos
POST   /api/inventory/products          # Criar produto
```

### Lançamentos
```http
GET    /api/inventory/transactions      # Listar lançamentos
POST   /api/inventory/launch            # Criar lançamento
PUT    /api/inventory/launch/:id        # Atualizar lançamento
```

### Categorias
```http
GET    /api/inventory/categories        # Listar categorias
POST   /api/inventory/categories        # Criar categoria
```

### Fornecedores
```http
GET    /api/inventory/suppliers         # Listar fornecedores
POST   /api/inventory/suppliers         # Criar fornecedor
```

---

## 🎨 Screenshots

### Dashboard Principal
![Dashboard](docs/screenshots/dashboard.png)

### Gestão de Estoque
![Estoque](docs/screenshots/stock.png)

### Lançamento de Entrada
![Lançamento](docs/screenshots/launch.png)

---

## 🗺️ Roadmap

- [x] Sistema de autenticação
- [x] CRUD de produtos
- [x] Lançamentos de entrada/saída
- [x] Edição de lançamentos com controle de estoque
- [x] Controle de validade
- [ ] CRUD completo de produtos (em andamento)
- [ ] Módulo de relatórios PDF
- [ ] Dashboard com gráficos
- [ ] Módulo médico completo
- [ ] App mobile (React Native)
- [ ] Integração com IA para previsão de demanda

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**AtualzDev Team**

- GitHub: [@AtualzDev](https://github.com/AtualzDev)
- Email: contato@atualzdev.com

---

## 🙏 Agradecimentos

- Comunidade React
- Supabase Team
- Todos os contribuidores

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

Made with ❤️ by AtualzDev

</div>
