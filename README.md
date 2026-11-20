<p align="center">
  <img src="public/images/logo.png" alt="RevCar" width="220">
</p>

# RevCar — Sistema de Revenda de Veículos

Frontend em **Angular 22** para o gerenciamento de uma revenda de veículos. A aplicação permite autenticar usuários, cadastrar veículos, marcas, modelos e acessórios, associar acessórios aos veículos e consultar o estoque com busca.

Este repositório contém apenas o **frontend**. Os dados são consumidos de uma API PHP/MySQL executada separadamente.

## Funcionalidades

- **Login e sessão** — autenticação via API PHP, com o cookie de sessão enviado em todas as requisições (`withCredentials`).
- **Cadastro de usuários** — criação de conta com validação de senha.
- **Listagem de veículos** — estoque com busca por marca, modelo, placa, cor, situação ou acessório, e destaque visual para veículos avariados.
- **Cadastro de veículos** — seleção de marca com carregamento dinâmico dos modelos correspondentes.
- **Marcas e modelos** — cadastro e exclusão; a exclusão exige a senha de um administrador.
- **Acessórios** — cadastro e listagem.
- **Veículo/Acessório** — marcação dos acessórios de cada veículo.
- **Rotas protegidas** — as telas internas só são acessadas por usuários autenticados (`authGuard`).

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Angular 22 | Framework da SPA |
| TypeScript 6 | Linguagem |
| Angular Router | Navegação e proteção de rotas |
| RxJS | Comunicação assíncrona |
| Vitest | Testes unitários |
| Prettier | Formatação de código |

## Pré-requisitos

- **Node.js** compatível com o Angular 22 (o projeto foi validado com Node 24)
- **npm**
- **PHP 8+** com PDO MySQL e **MySQL/MariaDB** (ex.: XAMPP)
- **API PHP** em execução em `http://localhost/apis-revendedora` — os arquivos estão em [`api/`](api/) e podem ser copiados para o `htdocs`

## Como executar

```bash
# instalar as dependências
npm install

# iniciar o servidor de desenvolvimento
npm start
```

Acesse <http://localhost:4200>. Sem sessão ativa, a aplicação redireciona para `/login`.

## Backend (API PHP)

O backend está em [`api/`](api/) e o schema do banco em [`database/schema.sql`](database/schema.sql).

### Instalação

1. **Banco de dados** — importe `database/schema.sql` no MySQL (phpMyAdmin ou `mysql -u root -p < database/schema.sql`).
2. **Usuário administrador** — o login precisa ser exatamente `admin` (definido em `api/comum.php`). Gere o hash da senha e cadastre:
   ```bash
   php -r "echo password_hash('SUA_SENHA', PASSWORD_DEFAULT), PHP_EOL;"
   ```
   ```sql
   INSERT INTO tb_usuario (login, senha) VALUES ('admin', '<hash gerado>');
   ```
3. **Arquivos da API** — copie a pasta `api/` para o Apache, por exemplo `C:\xampp\htdocs\apis-revendedora`.
4. **Credenciais** — copie `api/config.local.example.php` para `api/config.local.php` (na pasta publicada no `htdocs`) e ajuste host, banco, usuário e senha. Alternativamente, use as variáveis de ambiente `DB_HOST`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`.
5. **CORS/sessão** — as origens permitidas estão em `api/comum.php` (`http://localhost:4200` e `http://127.0.0.1:4200`).

> `api/config.local.php` está no `.gitignore` e não deve ser publicado.

## Configuração da API

A URL base da API fica em [`src/app/shared/api.ts`](src/app/shared/api.ts):

```ts
export const API = 'http://localhost/apis-revendedora';
```

> As telas de **login** e **cadastro de usuário** definem a URL completa diretamente nos componentes (`src/app/login/login.ts` e `src/app/cadastro-usuario/cadastro-usuario.ts`). Ao apontar para outro servidor, atualize esses dois arquivos também.

A API precisa aceitar requisições com credenciais (CORS com `Access-Control-Allow-Credentials: true` e origem `http://localhost:4200`) para que o cookie de sessão funcione.

### Banco de dados

O schema está em [`database/schema.sql`](database/schema.sql). O Angular não acessa o banco diretamente: todas as operações passam pela API PHP em `api/`.

### Endpoints utilizados

| Método | Endpoint | Uso |
| --- | --- | --- |
| POST | `/login.php` | Autenticação |
| POST | `/cadastro_usuario.php` | Cadastro de usuário |
| GET | `/sessao.php` | Verificação da sessão |
| POST | `/logout.php` | Encerramento da sessão |
| GET / POST | `/veiculo.php` | Listagem e cadastro de veículos |
| GET / POST / DELETE | `/marca.php` | Marcas (exclusão exige senha de admin) |
| GET / POST / DELETE | `/modelo.php` | Modelos (filtro por `id_marca`; exclusão exige senha de admin) |
| GET / POST | `/acessorio.php` | Acessórios |
| GET / POST | `/veiculo_acessorio.php` | Associação veículo/acessório |

## Rotas

| Rota | Tela | Protegida |
| --- | --- | --- |
| `/login` | Login | Não |
| `/cadastro` | Cadastro de usuário | Não |
| `/veiculos` | Listagem de veículos | Sim |
| `/cadastro-veiculo` | Cadastro de veículo | Sim |
| `/cadastro-acessorio` | Cadastro de acessório | Sim |
| `/veiculo-acessorio` | Associação veículo/acessório | Sim |
| `/cadastro-marca` | Marcas e modelos | Sim |
| `/cadastro-modelo` | Cadastro de modelo | Sim |

## Estrutura do projeto

```
api/                       # Backend PHP (copiar para htdocs/apis-revendedora)
database/schema.sql        # Estrutura do banco MySQL
src/app/
├── login/                 # Autenticação
├── cadastro-usuario/      # Cadastro de usuários
├── menu/                  # Cabeçalho e navegação interna
├── listagem-veiculos/     # Estoque com busca
├── cadastro-veiculo/      # Cadastro de veículos
├── cadastro-marca/        # Marcas e modelos (com exclusão restrita a admin)
├── cadastro-modelo/       # Cadastro de modelos
├── cadastro-acessorio/    # Cadastro de acessórios
├── veiculo-acessorio/     # Associação veículo/acessório
└── shared/                # API, sessão, guarda de rota e estilos comuns
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm start` | Servidor de desenvolvimento em `http://localhost:4200` |
| `npm run build` | Build de produção em `dist/` |
| `npm run watch` | Build contínuo em modo desenvolvimento |
| `npm test` | Testes unitários com Vitest |

## Autor

Desenvolvido por **Daniel Vinicius** como projeto interdisciplinar da ETEC.
