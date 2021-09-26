import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Role, TextChannel } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { base } from '../../helpers/embed';

export default {
  bot: false,
  mod: true,
  data: new SlashCommandBuilder()
    .setName('ausentes')
    .setDescription('Listar os membros que não mandam mensagem há [x] dias, opcionalmente separado por cargo.')
    .addRoleOption((option) =>
      option
        .setName('cargo')
        .setDescription('O cargo para filtrar, opcional, caso não seja selecionado eu irei listar entre todos os membros.')
        .setRequired(true),
    )
    .addIntegerOption(option =>
      option
        .setName('tempo')
        .setDescription('O número de dias sem mensagens de um usuário.')
        .setRequired(true),
    )
    .addBooleanOption(option =>
      option
        .setName('nomsg')
        .setDescription('Se o bot deve listar pessoas que não tem mensagens no registro ou não. (Padrão é não)')
        .setRequired(false),
    ),

  async execute(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
    const time = interaction.options.getInteger('tempo') as number;
    const role = interaction.options.getRole('cargo') as Role;

    let nomsg = interaction.options.getBoolean('nomsg') as boolean | undefined;
    nomsg = nomsg ?? false;

    await interaction.guild?.members.fetch();

    const response = [];

    response.push(`**Membros do cargo <@&${role.id}> inativos por mais de ${time} dias:**
    ${nomsg ? 'Inclui pessoas que não tem mensagem no registro.' : 'Apenas pessoas que tem mensagem no registro'}\n\n`);

    let temp = '';
    let count = 0;
    for await (const member of role.members.values()) {
      const lm = await prisma.lastMessage.findUnique({
        where: {
          userId_guildId: {
            userId: member.id,
            guildId: member.guild.id,
          },
        },
      });

      if (member.user.bot) continue;

      if (lm == null) {
        if (!nomsg) continue;
        const daysSinceJoined = getDaysDiff(member.joinedAt as Date, interaction.createdAt);
        if (daysSinceJoined >= time) temp += `<@${member.id}> - Entrou há **${daysSinceJoined}** dias e não tem mensagens no registro.\n`;
        count++;
      }
      else {
        const daysWithoutMessage = getDaysDiff(lm?.createdAt as Date, interaction.createdAt);
        if (daysWithoutMessage >= time) {
          temp += `<@${member.id}> - **${daysWithoutMessage}** dias desde a última mensagem.\n`;
          count++;
        }
      }

      if (count === 20) {
        response.push(temp);
        temp = '';
        count = 0;
      }
    }

    if (temp != '') response.push(temp);

    if (response.length === 1) {
      return interaction.reply({ embeds: [base('Nenhum membro se encaixa nos requisitos.', 'warning')] });
    }
    else if (response.length === 2) {
      return interaction.reply({ embeds: [base(response.join(''), 'info')] });
    }
    else {
      await interaction.reply({ embeds: [base('Estarei enviando a lista separada em várias mensagens', 'info')], ephemeral: true });

      for (let msg of response) {
        if (response.indexOf(msg) === 0) msg = msg + response.splice(2, 1);
        const channel = interaction.guild?.channels.cache.get(interaction.channelId) as TextChannel;
        await channel.send({ embeds: [base(msg, 'info')] });
      }
    }
  },
};

function getDaysDiff(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}