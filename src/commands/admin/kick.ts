import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  bot: false,
  mod: true,
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Remove um membro do servidor')
    .setDefaultPermission(false)
    .addUserOption((option) =>
      option
        .setName('membro')
        .setDescription('O usuário a ser removido')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('motivo')
        .setDescription('Motivo para a remoção do usuário')
        .setRequired(false),
    ),
  async execute(interaction: CommandInteraction): Promise<void> {
    const member = interaction.options.getMember('membro') as GuildMember | null;
    const reason = interaction.options.getString('motivo') as string | undefined;

    if (member == interaction.member) {
      return await interaction.reply({
        content: 'Você não pode se kickar do servidor.',
        ephemeral: true,
      });
    }

    if (member?.id == interaction.client.user?.id) {
      return await interaction.reply({
        content: 'Ei, você não pode mandar eu me kickar!',
        ephemeral: true,
      });
    }

    const kicked = await member?.kick(reason);

    if (kicked == undefined) {
      return await interaction.reply({
        content: 'Não pude kickar essa pessoa.',
        ephemeral: true,
      });
    }

    return await interaction.reply({
      content: `**${kicked?.user.tag}** foi kickado do servidor`,
      ephemeral: true,
    });
  },
};