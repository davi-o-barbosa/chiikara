import { Message } from 'discord.js';
import { PrismaClient } from '@prisma/client';

export default {
	name: 'messageCreate',
	once: false,
	async execute(message: Message): Promise<void> {
		if (message.interaction || message.author.bot || !message.guild) return;

		const prisma = new PrismaClient();

		await prisma.lastMessage.upsert({
			where: {
				userId_guildId: {
					userId: message.author.id,
					guildId: message.guild.id,
				},
			},
			update: {
				id: message.id,
				channelId: message.channel.id,
				createdAt: message.createdAt,
			},
			create: {
				id: message.id,
				channelId: message.channel.id,
				guildId: message.guild.id,
				userId: message.author.id,
			},
		});

		console.log(message.content);
	},
};