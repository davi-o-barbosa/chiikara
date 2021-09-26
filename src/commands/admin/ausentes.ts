import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Role } from 'discord.js';
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
        .setName('visivel')
        .setDescription('Se a resposta do bot deve ser visível para outros membros ou não.')
        .setRequired(false),
    ),

  async execute(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
    const time = interaction.options.getInteger('tempo') as number;
    const role = interaction.options.getRole('cargo') as Role;
    let ephemeral = interaction.options.getBoolean('visivel') as boolean | undefined;
    ephemeral = ephemeral ?? false;

    await interaction.guild?.members.fetch();

    let response = `Membros do cargo <@&${role.id}> inativos por mais de ${time} dias:\n`;
    const initialSize = response.length;
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
        const daysSinceJoined = getDaysDiff(member.joinedAt as Date, interaction.createdAt);
        if (daysSinceJoined >= time) response += `<@${member.id}> - Entrou há **${daysSinceJoined}** dias e não tem mensagens no registro.\n`;
        continue;
      }

      const daysWithoutMessage = getDaysDiff(lm?.createdAt as Date, interaction.createdAt);
      if (daysWithoutMessage >= time) response += `<@${member.id}> - **${daysWithoutMessage}** dias desde a última mensagem.\n`;
    }
    if (response.length === initialSize) return await interaction.reply({ embeds: [base('Nenhum membro se encaixa nos requisitos.', 'warning')], ephemeral: !ephemeral });
    await interaction.reply({ content: response, ephemeral: !ephemeral });
  },
};

function getDaysDiff(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}