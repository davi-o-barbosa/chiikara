import { ApplicationCommandOptionType } from 'discord-api-types';
import { CommandInteraction, GuildChannel } from 'discord.js';
import { Command } from '../..';

export default <Command>{
	name: 'falar',
	description: 'Reproduzir uma mensagem em qualquer canal.',
	options: [{
		name: 'canal',
		type: ApplicationCommandOptionType.Channel,
		description: 'O canal em que a mensagem será enviada',
		required: true,
	}, {
		name: 'mensagem',
		type: ApplicationCommandOptionType.String,
		description: 'A mensagem a ser enviada',
		required: true,
	}],
	async execute(interaction: CommandInteraction): Promise<void> {
		const channel = interaction.options.getChannel('canal') as GuildChannel;
		const message = interaction.options.getString('mensagem') as string;

		if (channel.isText()) {
			await channel.send(message);
			await interaction.reply({
				content: 'Mensagem enviada com sucesso!',
				ephemeral: true,
			});
		}
		else {
			await interaction.reply({
				content: 'Preciso que você marque um canal de texto!',
				ephemeral: true,
			});
		}
	},
};