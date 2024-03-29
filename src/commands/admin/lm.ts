import {
  CommandInteraction,
  GuildMember,
  MessageEmbed,
  TextChannel,
  Message,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PrismaClient } from '@prisma/client';
import { base } from '../../helpers/embed';

export default {
  bot: false,
  mod: true,
  data: new SlashCommandBuilder()
    .setName('lm')
    .setDescription('Veja a última mensagem de um usuário.')
    .addUserOption(option =>
      option
        .setName('membro')
        .setDescription('Usuário no qual você deseja ver a última mensagem.')
        .setRequired(false),
    )
    .addBooleanOption(option =>
      option
        .setName('visivel')
        .setDescription('Se a resposta do bot deve ser visível para outros membros ou não.')
        .setRequired(false),
    ),

  async execute(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
    let member = interaction.options.getMember('membro') as GuildMember | null;
    member = member ?? interaction.member as GuildMember;

    let ephemeral = interaction.options.getBoolean('visivel') as boolean | undefined;
    ephemeral = ephemeral ?? false;

    const lMessage = await prisma.lastMessage.findUnique({
      where: {
        userId_guildId: {
          userId: member.user.id,
          guildId: member.guild.id,
        },
      },
    });

    if (!lMessage) {
      return await interaction.reply({
        embeds: [base('Esse usuário não possui uma mensagem salva nos meus registros.', 'error')],
        ephemeral: true,
      });
    }

    const channel = await interaction.guild?.channels.fetch(lMessage.channelId).catch(async () => {
      await interaction.reply({ embeds: [base('O canal dessa mensagem não está mais disponível.', 'error')], ephemeral: true });
    }) as TextChannel;

    if (!channel) return;

    const fetchedMessage = await channel.messages.fetch(lMessage.id).catch(async () => {
      return await interaction.reply({ embeds: [base('A mensagem enviada por este usuário não existe mais.', 'error')], ephemeral: true });
    }) as Message;

    if (!fetchedMessage) return;

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel('Clique para ir até a mensagem')
          .setStyle('LINK')
          .setURL(fetchedMessage.url),
      );

    return await interaction.reply({
      embeds: [generateEmbed(fetchedMessage)],
      components: [row],
      ephemeral: !ephemeral,
    });
  },
};

function generateEmbed(message: Message): MessageEmbed {
  return new MessageEmbed()
    .setTitle(`Última mensagem do(a) ${message.author.tag}`)
    .addField('Conteúdo', message.content, true)
    .addField('Canal', `<#${message.channel.id}>`, true)
    .addField('Data', `<t:${Math.floor(message.createdTimestamp / 1000)}>`)
    .setColor('RANDOM')
    .setThumbnail(message.author.avatarURL() ?? 'https://discord.com/assets/9f6f9cd156ce35e2d94c0e62e3eff462.png');
}