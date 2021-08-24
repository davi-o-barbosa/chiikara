import { CommandInteraction, GuildMember, MessageEmbed, TextChannel, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PrismaClient } from '@prisma/client';

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

		const lMessage = await prisma.lastMessage.findUnique({
			where: {
				userId_guildId: {
					userId: member.user.id,
					guildId: member.guild.id,
				},
			},
		});

		if (!lMessage) {
			return await interaction.reply({
				content: 'Esse usuário não possui uma mensagem salva nos meus registros.',
				ephemeral: true,
			});
		}

		const channel = await interaction.guild?.channels.fetch(lMessage.channelId) as TextChannel | null;

		if (!channel) return await interaction.reply({ content: 'O canal dessa mensagem não está mais disponível.', ephemeral: true });

		try {
			const fetchedMessage = await channel.messages.fetch(lMessage.id);
			return await interaction.reply({
				embeds: [generateEmbed(fetchedMessage)],
			});
		}
		catch (e) {
			return await interaction.reply({ content: 'A mensagem enviada por este usuário não existe mais.', ephemeral: true });
		}
	},
};

function generateEmbed(message: Message): MessageEmbed {
	const date = new Date(message.createdAt);
	const string = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

	return new MessageEmbed()
		.setTitle(`Última mensagem do(a) ${message.author.tag}`)
		.addField('Conteúdo', message.content)
		.addField('Data', string)
		.setColor('RANDOM')
		.setThumbnail(message.author.avatarURL() ?? 'https://discord.com/assets/9f6f9cd156ce35e2d94c0e62e3eff462.png');
}