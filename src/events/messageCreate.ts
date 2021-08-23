import { Message } from 'discord.js';
import { PrismaClient } from '@prisma/client';

export default {
	name: 'messageCreate',
	once: false,
	async execute(message: Message): Promise<void> {
		if (message.interaction) return;

		const prisma = new PrismaClient();

		await prisma.lastMessage.upsert({
			where: {
				userId_guildId: {
					userId: message.member?.id as string,
					guildId: message.guild?.id as string,
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
				guildId: message.guild?.id as string,
				userId: message.member?.id as string,
			},
		});

		console.log(message.content);
	},
};