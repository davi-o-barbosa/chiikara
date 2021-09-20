import { PrismaClient } from '@prisma/client';
import { CommandInteraction } from 'discord.js';
import { base } from '../../../helpers/embed';

export default async function mod(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
  const role = interaction.options.getRole('cargo');

  const guildModRoles = await prisma.guildModRoles.findMany({
    where: { guildId: interaction.guild?.id },
  });

  async function add() {
    if (guildModRoles.find(obj => obj.roleId === role?.id)) {
      return await interaction.reply({ embeds: [base('Esse cargo já se encontra na lista.', 'warning')], ephemeral: true });
    }

    await prisma.guildModRoles.create({
      data: {
        guildId: interaction.guild?.id as string,
        roleId: role?.id as string,
      },
    });

    return await interaction.reply({ embeds: [base('Cargo configurado com sucesso!', 'sucess')], ephemeral: true });
  }

  async function remove() {
    const roleRecord = guildModRoles.find(obj => obj.roleId === role?.id);
    if (roleRecord == undefined) return await interaction.reply({ embeds: [base('O cargo não está na minha lista.', 'error')], ephemeral: true });

    await prisma.guildModRoles.delete({
      where: {
        id: roleRecord?.id,
      },
    });

    return await interaction.reply({ embeds: [base('O cargo foi removido com sucesso!', 'sucess')], ephemeral: true });
  }

  async function view() {
    if (guildModRoles.length === 0) return await interaction.reply({ embeds: [base('Você não configurou isso ainda.', 'warning')], ephemeral: true });
    const string = `<@&${guildModRoles.map(c => c.roleId).join('> <@&')}>`;
    return await interaction.reply({ embeds: [base('Cargos configurados como moderadores:\n' + string, 'info')], ephemeral: true });
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