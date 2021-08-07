# Chiikara
WIP, ainda trabalhando nas funções antigas do bot.
## Instruções para desenvolvimento:
1) `yarn install` - Instalar as dependências do projeto.
2) `yarn database` - Preparar a database com o [Prisma](https://www.prisma.io/).
3) Crie um arquivo `.env` no root do projeto com as variáveis necessárias:
```
TOKEN= Token do bot
CLIENTID= ID do servidor do Discord que você usará para desenvolvimento
GUILDID= ID do cliente do bot
```
4) `yarn deploy` - Essa comando executa uma instância do bot e realiza o reploy dos comandos no servidor configurado no arquivo acima. Para realizar um deploy global use `yarn deploy -global`.
5) `yarn dev` - Bot será executado usando [ts-node-dev](https://www.npmjs.com/package/ts-node-dev), onde a cada mudança nos arquivos o bot será reiniciado.

## Instruções para uso:
1) Execute os passos acima até o número **4.**
2) `yarn build` - Compilar o código em typescript.
3) `yarn start` - Executar o código.