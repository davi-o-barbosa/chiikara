import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getAnime } from '../../helpers/anilist';

export default {
	data: new SlashCommandBuilder()
		.setName('anime')
		.setDescription('Pesquise informações sobre um anime.')
		.addStringOption((option) =>
			option
				.setName('anime')
				.setDescription('Nome do anime para buscar')
				.setRequired(true),
		),

	async execute(interaction: CommandInteraction): Promise<void> {
		const animeName = interaction.options.getString('anime') as string;
		const embed = await getAnime(animeName);

		if (!embed) {
			return await interaction.reply({
				content: 'Desculpa, não pude encontrar os dados do anime!',
				ephemeral: true,
			});
		}

		await interaction.reply({ embeds: [embed] });
	},
};