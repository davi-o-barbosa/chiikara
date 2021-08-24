import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { LastMessage, PrismaClient } from '@prisma/client';

export default {
	data: new SlashCommandBuilder()
		.setName('lm')
		.setDescription('Veja a última mensagem de um usuário.')
		.addUserOption((option) =>
			option
				.setName('membro')
				.setDescription('Usuário no qual você deseja ver a última mensagem.')
				.setRequired(false),
		),
	async execute(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
		let member = interaction.options.getMember('membro') as GuildMember | null;
		member = member ?? interaction.member as GuildMember;

		const user = await prisma.lastMessage.findUnique({
			where: {
				userId_guildId: {
					userId: member.user.id,
					guildId: member.guild.id,
				},
			},
		});

		if (!user) {
			return await interaction.reply({
				content: 'Esse usuário não possui uma mensagem nos meus registros.',
				ephemeral: true,
			});
		}

		return await interaction.reply({
			embeds: [generateEmbed(user)],
		});

	},
};

function generateEmbed(data: LastMessage): MessageEmbed {
	return new MessageEmbed().setDescription(data.id as string);
}