# Sistema de Gerenciamento de Hotel

> Projeto acadêmico desenvolvido para a disciplina de **Programação para a Web II** — Universidade Federal de Campina Grande (UFCG)

**Alunos:** Arthur Gabriel Santos Albuquerque · Victor Vili Xavier Luna

---

## Sobre o Projeto

Sistema front-end desenvolvido para gerenciar as operações diárias de um hotel. A aplicação oferece uma interface intuitiva com controle de acesso baseado em perfis de usuário, cobrindo desde o registro de hóspedes até o acompanhamento de quartos, administração de equipe e gerenciamento de eventos.

### Perfis de Usuário

| Perfil | Descrição |
|---|---|
| **Admin** | Acesso total ao sistema |
| **Manager** | Gerenciamento de funcionários, quartos e eventos |
| **Employee** | Operações de check-in, check-out, reservas e serviço de quarto |
| **Guest** | Reserva de quartos e acompanhamento de estadias |

---

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Chakra UI](https://chakra-ui.com/)

---

## Pré-requisitos

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) 
---

## Setup e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/Web-II-2025-2/frontend.git
```

### 2. Acesse a pasta do projeto
```bash
cd frontend
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o `.env` com a URL do backend:
```env
VITE_API_URL=URL_DO_BACKEND
```

### 5. Suba o Backend
Siga o passo a passo do [repositório do backend](https://github.com/Web-II-2025-2/projeto-hotel-backend).

### 6. Execute a aplicação
```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no seu navegador.

---

## Estrutura de Pastas

```
src/
├── assets/          # Imagens, vídeos e arquivos estáticos
│   ├── images/
│   └── videos/
├── components/      # Componentes React reutilizáveis
│   ├── common/      # Usados em múltiplos contextos
│   ├── layout/      # Estrutura visual da aplicação
│   └── ui/          # Componentes baseados no Chakra UI
├── constants/       # Constantes globais do sistema
├── hooks/           # Hooks customizados para reutilização de lógica
├── pages/           # Páginas principais da aplicação
├── services/        # Comunicação com o backend
├── styles/          # Estilização global (CSS)
├── types/           # Tipagens TypeScript específicas do domínio
├── utils/           # Funções utilitárias genéricas
├── App.tsx          # Componente raiz
└── main.tsx         # Ponto de entrada da aplicação
```

---

## Rotas da Aplicação

| Rota | Descrição |
|---|---|
| `/login` | Tela de autenticação |
| `/register` | Criação de novas contas |
| `/home` | Landing page |
| `/profile` | Visualização de dados do perfil |
| `/profile/reservations` | Reservas feitas pelo usuário |
| `/event` | Criação e agendamento de eventos |
| `/room` | Cadastro e configuração de quartos |
| `/rooms` | Listagem e gestão de todos os quartos |
| `/employees/new` | Registro de novos funcionários |

---

## Integração com o Backend

### Autenticação
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Login no sistema |
| `POST` | `/auth/register-guest` | Cadastro de hóspede |
| `POST` | `/auth/register-manager` | Cadastro de manager |
| `POST` | `/auth/register-employee` | Cadastro de funcionário |

### Hóspedes
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/guests/profile` | Retorna perfil do usuário |

### Reservas
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/reservations` | Cadastra uma reserva |
| `GET` | `/reservations/my-reservations` | Lista reservas do usuário |
| `PATCH` | `/reservations/{reservationId}/checkin` | Realiza check-in |
| `PATCH` | `/reservations/{reservationId}/checkout` | Realiza check-out |
| `DELETE` | `/reservations/{reservationId}` | Cancela uma reserva |

### Quartos
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/rooms/available` | Lista quartos disponíveis |
| `GET` | `/rooms/{roomId}` | Retorna um quarto específico |
| `POST` | `/rooms` | Cria um novo quarto |

### Funcionários
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/employees/new` | Cria um novo funcionário |

### Eventos
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/events` | Cria um evento/experiência |
| `GET` | `/event` | Retorna um evento/experiência |

---

## Design

O protótipo das telas foi desenvolvido no Figma e pode ser acessado [aqui](https://www.figma.com/design/iBDQRBWxh4IOyB6HJY7Dgi/Web-2?node-id=21-6&t=aUmeIKqAF0YPTz9v-1).