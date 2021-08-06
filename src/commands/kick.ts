import { Interaction } from 'discord.js';
import { Command } from '..';

export default <Command>{
	name: 'kick',
	description: 'Remove um membro do servidor',
	options: [{
		name: 'membro',
		type: 'USER',
		description: 'O usuário a ser removido',
		required: true,
	}],
	async execute(interaction: Interaction): Promise<void> {
		console.log(interaction);
	},
};