import { CommandInteraction } from 'discord.js';
import { Command } from '..';
import { ApplicationCommandOptionType } from 'discord-api-types';


export default <Command>{
	name: 'avatar',
	description: 'Vê o avatar de um membro ou si mesmo',
	options: [{
		name: 'membro',
		type: ApplicationCommandOptionType.User,
		description: 'O usuário que deseja ver o avatar',
		required: false,
	}],
	async execute(interaction: CommandInteraction): Promise<void> {
		const member = interaction.options.getMember('membro');
		console.log(member);
	},
};