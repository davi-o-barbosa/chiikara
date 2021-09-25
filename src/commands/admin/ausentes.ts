import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default {
  bot: false,
  mod: true,
  data: new SlashCommandBuilder()
    .setName('ausentes')
    .setDescription('Listar os membros que não mandam mensagem há [x] dias, opcionalmente separado por cargo.')
    .addIntegerOption(option =>
      option
        .setName('tempo')
        .setDescription('O número de dias sem mensagens de um usuário.')
        .setRequired(true),
    )
    .addRoleOption((option) =>
      option
        .setName('cargo')
        .setDescription('O cargo para filtrar, opcional, caso não seja selecionado eu irei listar entre todos os membros.')
        .setRequired(false),
    ),

  async execute(interaction: CommandInteraction): Promise<void> {
    //
  },
};