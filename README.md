# Coach4me: horários disponíveis dos coaches

Projeto desenvolvido para a disciplina **Desenvolvimento de Aplicações Móveis II** da Especialização em Desenvolvimento Web e Mobile (IF Sudeste MG, Campus Rio Pomba).

Este repositório é a continuação do projeto [Coach4me](https://github.com/zz4fff/react-native-coach4me), criado pelo Prof. Flávio Augusto de Freitas nas vídeo-aulas. O projeto original foi atualizado para as versões atuais das bibliotecas e recebeu a funcionalidade pedida na atividade.

## Sumário

1. [Sobre a atividade](#sobre-a-atividade)
2. [O que foi implementado](#o-que-foi-implementado)
3. [Atualização das bibliotecas](#atualização-das-bibliotecas)
4. [Estrutura do projeto](#estrutura-do-projeto)
5. [Pré-requisitos](#pré-requisitos)
6. [Como executar o projeto](#como-executar-o-projeto)
7. [Como testar a funcionalidade](#como-testar-a-funcionalidade)
8. [Rotas da API](#rotas-da-api)
9. [Solução de problemas](#solução-de-problemas)
10. [Tecnologias utilizadas](#tecnologias-utilizadas)
11. [Créditos e licença](#créditos-e-licença)

## Sobre a atividade

No cadastro de coaches é possível cadastrar vários horários de aula disponíveis. Porém, na listagem de coaches do aplicativo, esses horários não eram exibidos abaixo da bio de cada coach, como mostra o layout do Figma.

O objetivo da atividade foi trazer, junto com os dados de cada coach, os dias e horários disponíveis, usando um **JOIN com a tabela `class_schedule`**, e exibir essas informações no card do coach.

## O que foi implementado

- **Backend** (`server/src/controllers/ClassesController.ts`): a rota `GET /classes` faz um JOIN com a tabela `class_schedule` e retorna, junto com cada coach, o array `schedule` com seus dias e horários disponíveis.
- **Mobile** (`mobile/src/components/CoachItem`): o card do coach exibe os horários logo abaixo da bio, inclusive na aba Favoritos.

## Atualização das bibliotecas

O projeto original foi gravado com versões de 2020/2021, que não funcionam mais no Expo Go atual. As principais atualizações foram:

| Biblioteca       | Versão original | Versão atual        |
| ---------------- | --------------- | ------------------- |
| Expo SDK         | 40              | 57                  |
| React            | 16.13           | 19.2                |
| React Native     | 0.63            | 0.86                |
| React Navigation | 5.x             | 7.x                 |
| Axios            | 0.21            | 1.x                 |
| Express          | 4.x             | 5.x                 |
| Knex             | 0.21            | 3.x                 |
| SQLite3          | 5.x             | 6.x                 |
| ts-node-dev      | 1.x             | substituído por tsx |

Mudanças de código necessárias para a atualização:

- `App.tsx`: remoção do pacote `expo-app-loading`, que foi descontinuado, e uso do `GestureHandlerRootView`.
- `StudyTabs.tsx`: a opção `tabBarOptions` foi substituída por `screenOptions`, conforme o React Navigation 7. Os ícones `ios-easel` e `ios-heart` passaram a se chamar `easel` e `heart`.
- `CoachList` e `Favorites`: o `useFocusEffect` passou a usar `useCallback`.
- Migrations: `import Knex from 'knex'` foi trocado por `import { Knex } from 'knex'`, conforme o Knex 3.

## Estrutura do projeto

```
coach4me-react-native/
├── mobile/                  Aplicativo React Native (Expo)
│   ├── App.tsx
│   └── src/
│       ├── assets/          Imagens e ícones
│       ├── components/
│       │   ├── CoachItem/   Card do coach (exibe os horários)
│       │   └── PageHeader/
│       ├── pages/
│       │   ├── CoachList/   Listagem e filtro de coaches
│       │   ├── Favorites/   Coaches favoritos
│       │   ├── GiveClasses/
│       │   └── Landing/     Tela inicial
│       ├── routes/          Navegação (stack e abas)
│       └── services/api.ts  Endereço da API
├── server/                  API Node.js
│   └── src/
│       ├── controllers/
│       │   ├── ClassesController.ts      Listagem com JOIN e cadastro
│       │   └── ConnectionsController.ts
│       ├── database/
│       │   ├── connection.ts
│       │   └── migrations/  Criação das tabelas
│       ├── routes.ts
│       └── server.ts
├── web/                     Versão web original (não alterada)
├── LICENSE
└── README.md
```

## Pré-requisitos

Instale no computador:

- [Node.js](https://nodejs.org/) versão 20 ou superior (testado com a versão 24). Para conferir, rode `node -v` no terminal.
- npm, que já vem junto com o Node.js. Para conferir, rode `npm -v`.
- [Git](https://git-scm.com/).
- [Visual Studio Code](https://code.visualstudio.com/) (recomendado).
- [Insomnia](https://insomnia.rest/) ou outra ferramenta para testar a API (por exemplo, a extensão Thunder Client do VS Code).

No celular:

- Aplicativo **Expo Go**, disponível na Play Store (Android) e na App Store (iPhone).

O celular e o computador precisam estar conectados **na mesma rede Wi-Fi**.

> Não é necessário instalar o Yarn. Todo o projeto usa o npm.

## Como executar o projeto

Você vai precisar de **dois terminais abertos ao mesmo tempo**: um para a API e outro para o aplicativo. No VS Code, para abrir um novo terminal, clique no botão **+** do painel de terminais.

### Passo 1: clonar o repositório

```bash
git clone https://github.com/rhaymarthins/coach4me-react-native.git
cd coach4me-react-native
```

### Passo 2: instalar e iniciar a API (terminal 1)

```bash
cd server
npm install
npm run knex:migrate
npm start
```

- `npm install` baixa as dependências da API.
- `npm run knex:migrate` cria o banco de dados SQLite e as tabelas `coaches`, `classes`, `class_schedule` e `connections`. A mensagem esperada é `Batch 1 run: 4 migrations`.
- `npm start` inicia a API na porta **3333**. O terminal fica parado sem mostrar mensagens, e isso é normal. **Não feche esse terminal.**

Para confirmar que a API está no ar, abra `http://localhost:3333/classes` no navegador. A resposta esperada é:

```json
{ "error": "Missing filters to search classes" }
```

Essa mensagem indica que a API está funcionando e apenas faltaram os filtros da busca.

### Passo 3: cadastrar coaches

O banco começa vazio e o aplicativo mobile não possui tela de cadastro. Por isso, os coaches são cadastrados diretamente na API.

No Insomnia:

1. Crie uma requisição do tipo **POST** para `http://localhost:3333/classes`.
2. Na aba **Body**, escolha **JSON** e cole o conteúdo abaixo.
3. Clique em **Send**. A resposta esperada é **201 Created**.

```json
{
  "name": "Ana Souza",
  "avatar": "https://i.pravatar.cc/150?img=5",
  "whatsapp": "5588999999999",
  "bio": "Professora de matemática há 10 anos.",
  "subject": "Matemática",
  "cost": "80",
  "schedule": [
    { "week_day": 1, "from": "08:00", "to": "12:00" },
    { "week_day": 3, "from": "14:00", "to": "18:00" }
  ]
}
```

Repita o processo com outros coaches para ter mais resultados:

```json
{
  "name": "Carlos Lima",
  "avatar": "https://i.pravatar.cc/150?img=12",
  "whatsapp": "5588988888888",
  "bio": "Engenheiro e professor de cálculo.",
  "subject": "Matemática",
  "cost": "100",
  "schedule": [
    { "week_day": 1, "from": "07:00", "to": "10:00" },
    { "week_day": 2, "from": "13:00", "to": "17:00" },
    { "week_day": 5, "from": "19:00", "to": "22:00" }
  ]
}
```

```json
{
  "name": "Beatriz Rocha",
  "avatar": "https://i.pravatar.cc/150?img=9",
  "whatsapp": "5588977777777",
  "bio": "Professora de física apaixonada por experimentos.",
  "subject": "Física",
  "cost": "90",
  "schedule": [{ "week_day": 4, "from": "08:00", "to": "11:00" }]
}
```

Os dias da semana são numerados assim:

| Número | Dia           |
| ------ | ------------- |
| 0      | Domingo       |
| 1      | Segunda-feira |
| 2      | Terça-feira   |
| 3      | Quarta-feira  |
| 4      | Quinta-feira  |
| 5      | Sexta-feira   |
| 6      | Sábado        |

### Passo 4: configurar o endereço da API no aplicativo

O celular precisa saber o endereço do computador onde a API está rodando.

1. Em um terminal, rode:

   ```bash
   ipconfig
   ```

   No macOS ou Linux, use `ifconfig` ou `ip addr`.

2. Procure o adaptador **Wi-Fi** e copie o **Endereço IPv4** (algo como `192.168.0.15`). Ignore adaptadores como `vEthernet`, `WSL` ou `VirtualBox`.

3. Dentro da pasta `mobile`, crie um arquivo chamado `.env` com o seu IP:

   ```env
   EXPO_PUBLIC_API_URL=http://192.168.0.15:3333
   ```

   Esse arquivo não é enviado ao GitHub. Depois de criar ou alterar o `.env`, reinicie o Expo com `npx expo start -c`.

> Não use `localhost` ao testar no celular. Para o celular, `localhost` é o próprio celular, e não o computador.

### Passo 5: instalar e iniciar o aplicativo (terminal 2)

```bash
cd mobile
npm install
npx expo start
```

Quando o QR Code aparecer no terminal, escolha uma das opções:

**No celular (recomendado)**

- Android: abra o Expo Go e toque em **Scan QR code**.
- iPhone: aponte a câmera do celular para o QR Code.

**No navegador do computador**

Aperte **w** no terminal do Expo. O aplicativo abre no navegador.

Para ver o aplicativo no formato de celular, no Google Chrome aperte **F12** e depois **Ctrl + Shift + M**, e escolha um aparelho na barra superior.

> No navegador, o botão "Entrar em contato" não abre o WhatsApp. As demais funções funcionam normalmente.

Atalhos úteis no terminal do Expo:

| Tecla    | Ação                                    |
| -------- | --------------------------------------- |
| r        | Recarrega o aplicativo                  |
| w        | Abre no navegador                       |
| a        | Abre no emulador Android (se instalado) |
| Ctrl + C | Encerra o Expo                          |

## Como testar a funcionalidade

1. Na tela inicial, toque em **Estudar**.
2. Toque no ícone de **filtro** no canto superior direito.
3. Preencha:
   - Matéria: `Matemática` (com M maiúsculo e acento)
   - Dia da semana: `1`
   - Horário: `09:00`
4. Toque em **Filtrar**.
5. Os coaches Ana Souza e Carlos Lima aparecem na lista. **Abaixo da bio de cada um são exibidos todos os seus dias e horários disponíveis.**
6. Toque no botão de coração para favoritar um coach.
7. Abra a aba **Favoritos**. O coach aparece com os horários.

Observações:

- O filtro mostra os coaches que estão disponíveis no dia e horário pesquisados. O card mostra **todos** os horários cadastrados daquela aula, inclusive de outros dias.
- Se algum campo do filtro ficar vazio, o aplicativo mostra um aviso pedindo o preenchimento.

## Rotas da API

| Método | Rota                                | Descrição                                                                                      |
| ------ | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| GET    | `/classes?subject=&week_day=&time=` | Lista os coaches disponíveis com seus horários (`schedule`). Os três filtros são obrigatórios. |
| POST   | `/classes`                          | Cadastra um coach, sua aula e seus horários.                                                   |
| GET    | `/connections`                      | Retorna o total de conexões realizadas.                                                        |
| POST   | `/connections`                      | Registra uma nova conexão com um coach.                                                        |

Exemplo de busca:

```
GET http://localhost:3333/classes?subject=Matemática&week_day=1&time=09:00
```

## Tecnologias utilizadas

**Aplicativo mobile**

- React Native e Expo (SDK 57)
- TypeScript
- React Navigation 7 (stack e bottom tabs)
- AsyncStorage (armazenamento dos favoritos)
- Axios (requisições HTTP)
- Expo Google Fonts (Archivo e Poppins)

**API**

- Node.js e Express 5
- TypeScript e tsx
- Knex 3 (consultas e migrations)
- SQLite

**Ferramentas**

- Visual Studio Code
- Insomnia
- Expo Go
- Git e GitHub
- Figma (layout do projeto)

## Créditos e licença

Projeto-base desenvolvido pelo **Prof. Flávio Augusto de Freitas** ([repositório original](https://github.com/zz4fff/react-native-coach4me)), na Especialização em Desenvolvimento Web e Mobile do Instituto Federal de Educação, Ciência e Tecnologia do Sudeste de Minas Gerais, Campus Rio Pomba.

Atualização das bibliotecas e implementação da exibição dos horários por **Ray Martins**.

Este projeto está sob a licença MIT, com a atribuição original preservada. Veja o arquivo [LICENSE](LICENSE).
