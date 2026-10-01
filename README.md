# Coach4me — Horários disponíveis dos coaches

Continuação do projeto Coach4me do Prof. Flávio Augusto de Freitas
(https://github.com/zz4fff/react-native-coach4me), com as bibliotecas atualizadas.

## O que foi feito
- **Atualização das bibliotecas**: Expo SDK 40 → SDK 57, React Navigation 5 → 7, Knex 0.21 → 3, Express 4 → 5, Axios 0.21 → 1.x.
- **Tarefa**: a rota `GET /classes` faz um JOIN com a tabela `class_schedule` e devolve, junto com cada coach, o array `schedule` com os dias e horários disponíveis. O app mobile mostra esses horários no card, logo abaixo da bio (inclusive em Favoritos).

## Como executar
### API
```bash
cd server
npm install
npm run knex:migrate
npm start
```
### Mobile
1. Em `mobile/src/services/api.ts`, coloque o IP do seu computador.
2. Rode:
```bash
cd mobile
npm install
npx expo start
```
3. Leia o QR Code com o app Expo Go (o celular deve estar no mesmo Wi-Fi).

## Licença
MIT — atribuição original preservada.
