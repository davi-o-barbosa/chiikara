import { PrismaClient } from '@prisma/client';
import { CommandInteraction, GuildChannel } from 'discord.js';
import { base } from '../../../helpers/embed';

export default async function bot(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
  const channel = interaction.options.getChannel('canal') as GuildChannel | null;

  const guildBotChannels = await prisma.guildBotChannels.findMany({
    where: { guildId: interaction.guild?.id },
  });

  async function add() {
    if (guildBotChannels.find(obj => obj.channelId === channel?.id)) {
      return await interaction.reply({ embeds: [base('O canal já está na minha lista.', 'info')], ephemeral: true });
    }

    await prisma.guildBotChannels.create({
      data: {
        guildId: interaction.guild?.id as string,
        channelId: channel?.id as string,
      },
    });

    return await interaction.reply({ embeds: [base('O canal foi adicionado com sucesso!', 'sucesso')], ephemeral: true });
  }

  async function remove() {
    const channelRecord = guildBotChannels.find(obj => obj.channelId === channel?.id);
    if (channelRecord == undefined) return await interaction.reply({ embeds: [base('O canal não está na minha lista.', 'info')], ephemeral: true });

    await prisma.guildBotChannels.delete({
      where: {
        id: channelRecord?.id,
      },
    });

    return await interaction.reply({ embeds: [base('O canal foi removido com sucesso!', 'sucess')], ephemeral: true });
  }

  async function view() {
    if (guildBotChannels.length === 0) return await interaction.reply({ embeds: [base('Você não configurou isso ainda.', 'warning')], ephemeral: true });
    const string = `<#${guildBotChannels.map(c => c.channelId).join('> <#')}>`;
    return await interaction.reply({ embeds: [base('Canais atualmente configurados para aceitar comandos:\n' + string, 'info')], ephemeral: true });
  }

  const subCommand = interaction.options.getSubcommand();
  switch (subCommand) {
    case 'add':
      await add();
      break;
    case 'remover':
      await remove();
      break;
    case 'ver':
      await view();
      break;
    default:
      return;
  }
}