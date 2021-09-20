import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildChannel } from 'discord.js';
import { base } from '../../helpers/embed';

export default {
  bot: false,
  mod: true,
  data: new SlashCommandBuilder()
    .setName('falar')
    .setDescription('Reproduzir uma mensagem em qualquer canal.')
    .addChannelOption((option) =>
      option
        .setName('canal')
        .setDescription('O canal em que a mensagem será enviada')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('mensagem')
        .setDescription('A mensagem a ser enviada')
        .setRequired(true),
    ),

  async execute(interaction: CommandInteraction): Promise<void> {
    const channel = interaction.options.getChannel('canal') as GuildChannel;
    const message = interaction.options.getString('mensagem') as string;

    if (!channel.isText()) {
      return await interaction.reply({
        embeds: [base('Preciso que você marque um canal de texto!', 'warning')],
        ephemeral: true,
      });
    }

    await channel.send(message);
    return await interaction.reply({
      embeds:[base('Mensagem enviada com sucesso!', 'sucess')],
      ephemeral: true,
    });
  },
};