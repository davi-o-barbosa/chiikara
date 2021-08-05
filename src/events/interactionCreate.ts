import { Interaction } from 'discord.js';

module.exports = {
	name: 'interactionCreate',
	execute(interaction: Interaction): void {
		console.log(interaction);
	},
};