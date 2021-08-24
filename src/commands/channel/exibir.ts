import { CommandInteraction, MessageActionRow, MessageSelectMenu, SelectMenuInteraction, Message, Interaction, PermissionOverwrites } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { HiddenChannel, PrismaClient } from '@prisma/client';

export default {
	data: new SlashCommandBuilder()
		.setName('exibir')
		.setDescription('Exibe um menu para você exibir seus canais de volta.'),

	async execute(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
		const hiddenChannel = await prisma.hiddenChannel.findMany({
			where: {
				userId: interaction.user.id,
				guildId: interaction.guild?.id,
			},
		});

		const options = [];
		for (const channel of hiddenChannel) {
			if (!channel.self) continue;
			options.push({ label: channel.channelName, value: channel.channelId });
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('channelSelect')
					.setPlaceholder('Nada selecionado')
					.setMinValues(1)
					.addOptions(options),
			);

		const message = await interaction.reply({
			content: 'Escolha o canal que deseja exibir novamente: ',
			components: [row],
			fetchReply: true,
		}) as Message;

		const filter = (i: SelectMenuInteraction) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		const response = await message.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 });

		for (const channelId of response.values) {
			const thisChannel = await prisma.hiddenChannel.findFirst({
				where: {
					channelId: channelId,
					userId: interaction.user.id,
					guildId: interaction.guild?.id,
				},
			}) as HiddenChannel;

			if (!thisChannel.self) return;

			await prisma.hiddenChannel.delete({
				where: {
					id: thisChannel.id,
				},
			});

			const channel = await interaction.guild?.channels.fetch(thisChannel.channelId);
			if (!channel) return;

			const permissions = channel.permissionOverwrites;
			await permissions.edit(interaction.user.id, {
				VIEW_CHANNEL: null,
			}, { reason: `Usuário ${interaction.user.tag} usou o comando para exibir o canal.` });

			const newPerms = permissions.cache.get(interaction.user.id) as PermissionOverwrites;
			const bitfieldValue = newPerms.deny.bitfield + newPerms.allow.bitfield;
			if (bitfieldValue === 0n) {
				await permissions.delete(interaction.user.id, 'Deletando o registro de permissões do usuário já que se encontra vazio.');
			}
		}
	},
};
