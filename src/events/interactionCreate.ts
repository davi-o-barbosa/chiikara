import { Interaction, GuildMember } from 'discord.js';
import { Bot } from '..';
import { base } from '../helpers/embed';

export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction: Interaction, { commands, prisma }: Bot): Promise<void> {
    if (!interaction.isCommand() || !commands.has(interaction.commandName)) return;
    if (!interaction.guildId) return await interaction.reply({ embeds: [base('Por favor, use meus comandos dentro de servidores.', 'warning')] });

    const guildBotChannels = await prisma.guildBotChannels.findMany({
      where: { guildId: interaction.guild?.id },
    });

    const guildModRoles = await prisma.guildModRoles.findMany({
      where: { guildId: interaction.guild?.id },
    });

    try {
      const command = commands.get(interaction.commandName);
      if (!command) return;

      if (command.bot && guildBotChannels.length > 0 && !guildBotChannels.find(obj => obj.channelId === interaction?.channel?.id)) {
        return await interaction.reply({ embeds: [base('Você só pode usar esse comando no canal de bots.', 'warning')], ephemeral: true });
      }

      const member = interaction.member as GuildMember;
      if (command.mod && !checkRoles(member, guildModRoles.map(r => r.roleId))) {
        return await interaction.reply({ embeds: [base('Você não tem permissão pra usar esse comando.', 'error')], ephemeral: true });
      }
      await command.execute(interaction, prisma);
    }
    catch (e) {
      console.error(e);
      await interaction.reply({
        embeds: [base('Houve um erro inesperado ao executar o seu comando.', 'error')],
        ephemeral: true,
      });
    }
  },
};

function checkRoles(member: GuildMember, roles: Array<string>): boolean {
  if (roles.length === 0 && member.permissions.has('ADMINISTRATOR')) return true;
  return member.roles.cache.some(role => roles.includes(role.id));
}