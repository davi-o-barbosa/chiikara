import { CommandInteraction } from 'discord.js';
import { Command } from '../..';
import { ApplicationCommandOptionType } from 'discord-api-types';

export default <Command>{
	name: 'kick',
	description: 'Remove um membro do servidor',
	options: [{
		name: 'membro',
		type: ApplicationCommandOptionType.User,
		description: 'O usuário a ser removido',
		required: true,
	}],
	async execute(interaction: CommandInteraction): Promise<void> {
		const member = interaction.options.getMember('membro');
		console.log(member + 'b');
	},
};