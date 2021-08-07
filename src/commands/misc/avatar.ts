import { CommandInteraction, GuildMember } from 'discord.js';
import { Command } from '../..';
import { image } from '../../helpers/embed';
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
		let member = interaction.options.getMember('membro') as GuildMember | null;
		member = member ?? interaction.member as GuildMember;

		const url = member.user.avatarURL({ format: 'png', size: 2048 });

		if (url == null) {
			interaction.reply({
				content: 'Não encontrei nenhuma foto de perfil...',
				ephemeral: true,
			});
		}
		else {
			interaction.reply({
				embeds: [await image(url, `Avatar - ${member.user.tag}`)],
			});
		}
	},
};