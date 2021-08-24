import { Interaction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('lm')
		.setDescription('Veja a última mensagem de um usuário.')
		.addUserOption((option) =>
			option
				.setName('usuário')
				.setDescription('Usuário no qual você deseja ver a última mensagem.')
				.setRequired(false),
		),
	async execute(interaction: Interaction): Promise<void> {
		console.log(interaction.channel?.id);
	},
};