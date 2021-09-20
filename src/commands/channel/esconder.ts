import { CommandInteraction, TextChannel } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PrismaClient } from '@prisma/client';
import { base } from '../../helpers/embed';

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
      return await interaction.reply({ embeds: [ base('Esse canal não está disponível', 'error')], ephemeral: true });
    }

    const protectedChannels = await prisma.guildProtectedChannels.findMany({
      where: { channelId: channel.id },
    });

    if (protectedChannels.find(c => c.channelId === channel.id)) {
      return await interaction.reply({ embeds:[ base('Você não pode esconder esse canal, sinto muito =(', 'warning')], ephemeral: true });
    }

    let hiddenChannel = await prisma.hiddenChannel.findFirst({
      where: {
        channelId: channel.id,
        userId: interaction.user.id,
      },
    });

    if (hiddenChannel) {
      return await interaction.reply({ embeds:[ base('Você já escondeu esse canal.', 'warning')], ephemeral: true });
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

    await interaction.reply({ embeds:[ base(`O canal \`#${channel.name}\` foi escondido pra você.`, 'sucess')], ephemeral: true });
  },
};