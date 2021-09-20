import { PrismaClient } from '@prisma/client';
import { CommandInteraction } from 'discord.js';

export default async function mod(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
  const role = interaction.options.getRole('cargo');

  const guildModRoles = await prisma.guildModRoles.findMany({
    where: { guildId: interaction.guild?.id },
  });

  async function add() {
    if (guildModRoles.find(obj => obj.roleId === role?.id)) {
      return await interaction.reply({ content: 'Esse cargo já se encontra na lista.', ephemeral: true });
    }

    await prisma.guildModRoles.create({
      data: {
        guildId: interaction.guild?.id as string,
        roleId: role?.id as string,
      },
    });

    return await interaction.reply({ content: 'Cargo configurado com sucesso!', ephemeral: true });
  }

  async function remove() {
    const roleRecord = guildModRoles.find(obj => obj.roleId === role?.id);
    if (roleRecord == undefined) return await interaction.reply({ content: 'O cargo não está na minha lista.', ephemeral: true });

    await prisma.guildModRoles.delete({
      where: {
        id: roleRecord?.id,
      },
    });

    return await interaction.reply({ content: 'O cargo foi removido com sucesso!', ephemeral: true });
  }

  async function view() {
    console.log(interaction?.guild?.commands);
    if (guildModRoles.length === 0) return await interaction.reply({ content: 'Você não configurou isso ainda.', ephemeral: true });
    const string = `<@&${guildModRoles.map(c => c.roleId).join('> <@&')}>`;
    return await interaction.reply({ content: 'Cargos configurados como moderadores:\n' + string, ephemeral: true });
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