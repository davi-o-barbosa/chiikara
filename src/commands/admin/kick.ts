import { CommandInteraction, GuildMember } from 'discord.js';
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
	},
	{
		name: 'motivo',
		type: ApplicationCommandOptionType.String,
		description: 'Motivo para a remoção do usuário',
		required: false,
	}],
	async execute(interaction: CommandInteraction): Promise<void> {
		const member = interaction.options.getMember('membro') as GuildMember | null;
		const reason = interaction.options.getString('motivo');

		if (member == interaction.member) {
			await interaction.reply({
				content: 'Você não pode se kickar do servidor.',
				ephemeral: true,
			});
		}
		else if (member?.id == interaction.client.user?.id) {
			await interaction.reply({
				content: 'Ei, você não pode mandar eu me kickar!',
				ephemeral: true,
			});
		}
		else {
			const kicked = await member?.kick(reason ?? undefined);
			if (kicked != undefined) {
				await interaction.reply({
					content: `**${kicked?.user.tag}** foi kickado do servidor`,
					ephemeral: true,
				});
			}
			else {
				await interaction.reply({
					content: 'Não pude kickar essa pessoa.',
					ephemeral: true,
				});
			}
		}
	},
};