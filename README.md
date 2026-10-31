# ☕ CafeScore

App mobile de diário de degustação de cafés. Você registra o nome do café, dá uma nota de 1 a 5 e o app guarda tudo em um banco de dados local no celular.

<!-- Adicione aqui um print do app: ![Tela do CafeScore](./assets/preview.png) -->

## Funcionalidades

- Cadastro de degustações com nome do café e nota de 1 a 5
- Lista das degustações salvas, com data e contador
- Exclusão de registros
- Validação do formulário com mensagens de erro e de sucesso
- Dados salvos localmente com SQLite, então continuam no app depois de fechar

## Tecnologias

- [React Native](https://reactnative.dev) com [Expo](https://expo.dev)
- TypeScript
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) para o banco de dados local

## Como rodar

Precisa ter o [Node.js](https://nodejs.org) instalado e o app **Expo Go** no celular.

```bash
git clone https://github.com/Gunngn1r/CafeScoreApp.git
cd CafeScoreApp
npm install
npx expo start
```

Depois é só ler o QR Code com o Expo Go (Android) ou com a câmera (iPhone).

## Estrutura

```
App.tsx               # tela principal: formulário e lista
service/database.ts   # criação da tabela e funções de salvar, listar e remover
```

## Autor

Feito por **Vinicius Anjos** · [LinkedIn](https://linkedin.com/in/vinicius-a-459a07129) · [Portfólio](https://gunngn1r.github.io)
