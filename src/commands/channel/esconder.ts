import { CommandInteraction, TextChannel } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PrismaClient } from '@prisma/client';

export default {
  bot: true,
  mod: false,
  data: new SlashCommandBuilder()
    .setName('esconder')
    .setDescription('Esconde um canal do servidor para você.')
    .addChannelOption((option) =>
      option
        .setName('canal')
        .setDescription('O usuário a ser removido')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
    const channel = interaction.options.getChannel('canal') as TextChannel | null;

    if (!channel) {
      return await interaction.reply({ content: 'Esse canal não está disponível', ephemeral: true });
    }

    let hiddenChannel = await prisma.hiddenChannel.findFirst({
      where: {
        channelId: channel.id,
        userId: interaction.user.id,
      },
    });

    if (hiddenChannel) {
      return await interaction.reply({ content: 'Você já escondeu esse canal.', ephemeral: true });
    }

    const permissions = channel.permissionOverwrites;
    await permissions.edit(interaction.user.id, {
      VIEW_CHANNEL: false,
    }, { reason: `${interaction.user.tag} usou o comando para esconder o canal.` });

    hiddenChannel = await prisma.hiddenChannel.create({
      data: {
        channelName: channel.name,
        channelId: channel.id,
        userId: interaction.user.id,
        guildId: channel.guild.id,
      },
    });

    await interaction.reply({ content: `O canal \`#${channel.name}\` foi escondido pra você.`, ephemeral: true });
  },
};