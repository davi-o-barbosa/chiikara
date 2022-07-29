import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  bot: false,
  mod: false,
  data: new SlashCommandBuilder()
    .setName('rola')
    .setDescription('Dado pro rola e rola'),

  async execute(interaction: CommandInteraction): Promise<void> {
    const roll = Math.floor(Math.random() * 100) + 1;

    const embed = new MessageEmbed()
      .setTitle('Rola e Rola')
      .setColor('AQUA');

    if (roll <= 25) {
      embed.setDescription('Você tirou **1**');
    }
    else if (roll > 25 && roll <= 50) {
      embed.setDescription('Você tirou **2**');
    }
    else if (roll > 50 && roll <= 75) {
      embed.setDescription('Você tirou **3**');
    }
    else if (roll > 75 && roll <= 95) {
      embed.setDescription('Você passou a vez!');
    }
    else {
      embed.setDescription('Você perdeu tudo :)');
    }

    interaction.reply({ embeds: [embed] });
  },
};