import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { image, base } from '../../helpers/embed';

export default {
  bot: true,
  mod: false,
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Vê o avatar de um membro ou si mesmo')
    .addUserOption((option) =>
      option
        .setName('membro')
        .setDescription('O usuário que deseja ver o avatar')
        .setRequired(false),
    ),

  async execute(interaction: CommandInteraction): Promise<void> {
    let member = interaction.options.getMember('membro') as GuildMember | null;
    member = member ?? interaction.member as GuildMember;

    const url = member.user.avatarURL({ format: 'png', size: 2048 });

    if (url == null) {
      return await interaction.reply({
        embeds: [base('Esse usuário não tem uma foto de perfil.', 'error')],
        ephemeral: true,
      });
    }

    await interaction.reply({
      embeds: [await image(url, `Avatar - ${member.user.tag}`)],
    });
  },
};