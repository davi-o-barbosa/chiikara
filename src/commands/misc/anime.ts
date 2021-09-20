import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getAnime } from '../../helpers/anilist';
import { base } from '../../helpers/embed';


export default {
  bot: false,
  mod: false,
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Pesquise informações sobre um anime.')
    .addStringOption((option) =>
      option
        .setName('nome')
        .setDescription('Nome do anime para buscar')
        .setRequired(true),
    ),

  async execute(interaction: CommandInteraction): Promise<void> {
    const animeName = interaction.options.getString('nome') as string;
    const embed = await getAnime(animeName);

    if (!embed) {
      return await interaction.reply({
        embeds: [base('Desculpa, não pude encontrar o anime!', 'error')],
        ephemeral: true,
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};