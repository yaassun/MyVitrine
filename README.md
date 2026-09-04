# MyVitrine — Frontend

> Onde marcas, afiliados e criadores se encontram.

Frontend da **MyVitrine**, uma plataforma que conecta lojistas, afiliados e criadores de conteúdo. O MVP permite criar uma conta de acordo com o perfil escolhido, manter as informações profissionais atualizadas e acessar uma área personalizada para acompanhar as atividades na plataforma.

## Sumário

- [MVP no ar](#mvp-no-ar)
- [Funcionalidades](#funcionalidades)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Integração com o backend](#integração-com-o-backend)
- [Como rodar](#como-rodar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Build de produção](#build-de-produção)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Equipe](#equipe)
- [Sobre o projeto](#sobre-o-projeto)

## MVP no ar

Acesse o produto publicado:

**https://my-vitrine-mv.vercel.app**

O frontend está publicado na Vercel e utiliza a API hospedada no Render. Como o backend utiliza um serviço gratuito, a primeira requisição pode levar alguns segundos enquanto o servidor é iniciado.

## Funcionalidades

- Cadastro e autenticação de usuários.
- Escolha de perfil entre **Lojista**, **Afiliado** e **Criador de conteúdo**.
- Página inicial autenticada com conteúdo específico para cada perfil.
- Visualização e atualização das informações do perfil.
- Dashboards personalizados para lojistas, afiliados e criadores.
- Área de trabalhos e detalhes de contratações para criadores.
- Recuperação e redefinição de senha.
- Navegação protegida para usuários autenticados.
- Interface responsiva seguindo a identidade visual da MyVitrine.

## Tecnologias utilizadas

| Categoria | Tecnologia |
|---|---|
| Frontend | React 18 e JavaScript |
| Rotas | React Router DOM 6 |
| Estilos | CSS3 |
| Build e desenvolvimento | Vite 5 |
| Comunicação com a API | Fetch API |
| Backend/API | Java, Spring Boot e PostgreSQL |
| Banco de dados em produção | Neon |
| Publicação do frontend | Vercel |
| Publicação do backend | Render |
| Versionamento | Git e GitHub |
| Apoio no desenvolvimento | ChatGPT, Claude e GitHub Copilot |

## Integração com o backend

Este repositório contém somente o frontend. A autenticação, os usuários, os perfis e os demais dados são fornecidos pela API da MyVitrine.

- Repositório do backend: **https://github.com/VictorASDev/my_vitrine_backend**
- API publicada: **https://my-vitrine-backend.onrender.com**
- Documentação local da API: **http://localhost:8080/swagger-ui.html**

O endereço usado nas requisições é definido pela variável `VITE_API_URL`. Quando essa variável não existe, o frontend utiliza `http://localhost:8080` como padrão.

## Como rodar

### Pré-requisitos

Antes de começar, tenha instalado:

- [Node.js](https://nodejs.org/) 18 ou superior.
- npm, instalado junto com o Node.js.
- [Git](https://git-scm.com/).
- Backend da MyVitrine em execução localmente ou acesso à API publicada.

### Instalação e execução local

```bash
# 1. Clone o repositório
git clone https://github.com/yaassun/MyVitrine.git

# 2. Entre na pasta do projeto
cd MyVitrine

# 3. Instale as dependências
npm install

# 4. Crie o arquivo de ambiente a partir do exemplo
cp .env.example .env

# 5. Inicie o frontend
npm run dev
```

No Windows PowerShell, o quarto passo pode ser executado assim:

```powershell
Copy-Item .env.example .env
```

Depois, abra no navegador o endereço exibido pelo Vite, normalmente:

```text
http://localhost:5173
```

## Variáveis de ambiente

O arquivo `.env.example` contém a configuração necessária para o frontend:

```env
VITE_API_URL=http://localhost:8080
```

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | Endereço base do backend, sem `/` no final. |

Para usar a API publicada, configure:

```env
VITE_API_URL=https://my-vitrine-backend.onrender.com
```

Na Vercel, adicione a mesma variável nas configurações do projeto e faça um novo deploy para aplicar a alteração.

> Não coloque senhas, tokens ou outras informações secretas em arquivos versionados.

## Build de produção

Para verificar se a aplicação está pronta para publicação:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist`.

Para testar esse build localmente:

```bash
npm run preview
```

## Estrutura do projeto

```text
src/
├── auth/          # Contexto de autenticação e cliente da API
├── components/    # Componentes reutilizáveis da interface
├── pages/         # Páginas de acesso, perfis e dashboards
├── App.jsx        # Rotas principais da aplicação
├── global.css     # Estilos globais e identidade visual
└── main.jsx       # Ponto de entrada do React
```

O projeto utiliza componentes funcionais do React. As páginas consomem a API por meio da URL centralizada em `auth/authClient.js`, evitando endereços do backend espalhados pelo código.

## Equipe

| Integrante | Papel |
|---|---|
| Natália | Product Owner / PM |
| Victor | Desenvolvedor Backend |
| Yasmin | Desenvolvedora Frontend |
| Kayky | Desenvolvimento |
| Késia | Desenvolvimento |

## Sobre o projeto

Trabalho desenvolvido para a disciplina **Difusão e Inovação**, do curso de Bacharelado em Sistemas de Informação do **Instituto Federal da Bahia — Campus Feira de Santana**, sob orientação do professor Fábio Barreto.

O MVP foi construído como parte da entrega final da disciplina, contemplando produto publicado, repositórios versionados e apresentação do pitch da startup.
