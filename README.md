# Chiikara
![alt text](https://cdn.discordapp.com/attachments/606631846473629726/720362002563858513/uwu2.png "Arte feita pelo Remmy, do nosso servidor do Discord.")

Chiikara é um bot para um servidor de Discord, o [Debauchy Tea Party](https://discord.gg/rwepVYF).

## Funções:
 - Usuários podem esconder canais que não querem ver, e também exibir de volta.
 - Pesquisar animes no Anilist e mostrar informações, além do tempo até o próximo episódio.
 - Ela guarda a última mensagem dos usuários e pode:
   - Pesquisar quando e qual foi a última mensagem de um membro.
   - Pesquisar por cargo quais membros estão inativos por um tempo determinado.
- Mandar mensagens em qualquer canal.
- E ainda mais vindo no futuro! 

## Instruções para desenvolvimento:
0) Clone o repositório e use `cd chiikara`
1) `yarn install` - Instalar as dependências do projeto.
2) `yarn database` - Preparar a database com o [Prisma](https://www.prisma.io/).
3) Crie um arquivo `.env` no root do projeto com as variáveis necessárias:
```
TOKEN=Token do bot
CLIENTID=ID do servidor do Discord que você usará para desenvolvimento
GUILDID=ID do cliente do bot
```
4) `yarn deploy` - Essa comando executa uma instância do bot e realiza o reploy dos comandos no servidor configurado no arquivo acima. Para realizar um deploy global use `yarn deploy -global`.
5) `yarn dev` - Bot será executado usando [ts-node-dev](https://www.npmjs.com/package/ts-node-dev), onde a cada mudança nos arquivos o bot será reiniciado. Não sei o motivo, mas essa função de reiniciar **não** funciona em Linux.

## Instruções para uso:
[Issue #4](https://github.com/deiveria/chiikara/issues/4)