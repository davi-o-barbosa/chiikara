import { CommandInteraction, PermissionOverwrites } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PrismaClient } from '@prisma/client';

export default {
	data: new SlashCommandBuilder()
		.setName('exibir')
		.setDescription('Exibir um canal escondido previamente.')
		.addStringOption((option) =>
			option
				.setName('canal')
				.setDescription('O canal para ser exibido de volta.')
				.setRequired(true),
		),

	async execute(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
		const channelName = interaction.options.getString('canal') as string;

		const hiddenChannel = await prisma.hiddenChannel.findFirst({
			where: {
				channelName: channelName,
				userId: interaction.user.id,
				guildId: interaction.guild?.id,
			},
		});

		if (!hiddenChannel || !hiddenChannel.self) {
			return await interaction.reply({
				content: 'Você não escondeu esse canal ou digitou o nome incorretamente.',
				ephemeral: true,
			});
		}

		const channel = await interaction.guild?.channels.fetch(hiddenChannel.channelId);

		if (!channel) return await interaction.reply({ content: 'Esse canal não existe mais.', ephemeral: true });

		const permissions = channel.permissionOverwrites;
		await permissions.edit(interaction.user.id, {
			VIEW_CHANNEL: null,
		});

		const newPerms = permissions.cache.get(interaction.user.id) as PermissionOverwrites;
		const bitfieldValue = newPerms.deny.bitfield + newPerms.allow.bitfield;
		if (bitfieldValue === 0n) {
			await permissions.delete(interaction.user.id);
		}

		await prisma.hiddenChannel.delete({
			where: {
				id: hiddenChannel.id,
			},
		});

		await interaction.reply({ content: `Prontinho, você deve conseguir ver o canal <#${channel.id}> novamente.`, ephemeral: true });
	},
};