import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord-api-types';
import { Command } from '../..';
import { getAnime } from '../../helpers/anilist';

export default <Command>{
	name: 'anime',
	description: 'Pesquise informações sobre um anime.',
	options: [{
		name: 'anime',
		type: ApplicationCommandOptionType.String,
		description: 'Nome do anime para buscar',
		required: true,
	}],
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