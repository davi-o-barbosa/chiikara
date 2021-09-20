import { PrismaClient } from '@prisma/client';
import { CommandInteraction, GuildChannel } from 'discord.js';
import { base } from '../../../helpers/embed';

export default async function bot(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
  const channel = interaction.options.getChannel('canal') as GuildChannel | null;

  const guildProtectedChannels = await prisma.guildProtectedChannels.findMany({
    where: { guildId: interaction.guild?.id },
  });

  async function add() {
    if (guildProtectedChannels.find(obj => obj.channelId === channel?.id)) {
      return await interaction.reply({ embeds: [base('O canal já está na minha lista.', 'warning')], ephemeral: true });
    }

    await prisma.guildProtectedChannels.create({
      data: {
        guildId: interaction.guild?.id as string,
        channelId: channel?.id as string,
      },
    });

    return await interaction.reply({ embeds: [base('O canal foi adicionado com sucesso!', 'sucess')], ephemeral: true });
  }

  async function remove() {
    const channelRecord = guildProtectedChannels.find(obj => obj.channelId === channel?.id);
    if (channelRecord == undefined) return await interaction.reply({ embeds: [base('O canal não está na minha lista.', 'warning')], ephemeral: true });

    await prisma.guildProtectedChannels.delete({
      where: {
        id: channelRecord?.id,
      },
    });

    return await interaction.reply({ embeds: [base('O canal foi removido com sucesso!', 'sucess')], ephemeral: true });
  }

  async function view() {
    if (guildProtectedChannels.length === 0) return await interaction.reply({ embeds: [base('Você não configurou isso ainda.', 'warning')], ephemeral: true });
    const string = `<#${guildProtectedChannels.map(c => c.channelId).join('> <#')}>`;
    return await interaction.reply({ embeds: [base('Canais atualmente protegidos dos comandos de esconder/exibir canais:\n' + string, 'info')], ephemeral: true });
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