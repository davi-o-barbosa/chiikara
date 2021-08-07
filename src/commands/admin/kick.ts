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
			return await interaction.reply({
				content: 'Você não pode se kickar do servidor.',
				ephemeral: true,
			});
		}

		if (member?.id == interaction.client.user?.id) {
			return await interaction.reply({
				content: 'Ei, você não pode mandar eu me kickar!',
				ephemeral: true,
			});
		}

		const kicked = await member?.kick(reason ?? undefined);

		if (kicked == undefined) {
			return await interaction.reply({
				content: 'Não pude kickar essa pessoa.',
				ephemeral: true,
			});
		}

		return await interaction.reply({
			content: `**${kicked?.user.tag}** foi kickado do servidor`,
			ephemeral: true,
		});
	},
};