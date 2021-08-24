import { Interaction } from 'discord.js';
import { Bot } from '..';

export default {
	name: 'interactionCreate',
	once: false,
	async execute(interaction: Interaction, { commands, prisma }: Bot): Promise<void> {
		if (!interaction.isCommand() || !commands.has(interaction.commandName)) return;

		try {
			await commands.get(interaction.commandName)?.execute(interaction, prisma);
		}
		catch (e) {
			console.error(e);
			await interaction.reply({
				content: 'Houve um erro inesperado ao executar o seu comando.',
				ephemeral: true,
			});
		}
	},
};