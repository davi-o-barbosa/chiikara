import { ColorResolvable, MessageEmbed } from 'discord.js';

const colorDictionary: { [key: string]: string } = {
  'sucess': '#54F395',
  'error': '#FF4842',
  'info': '#42C6FF',
  'warning': '#F4D03F',
};

export function base(text: string, state = 'info'): MessageEmbed {
  const color = colorDictionary[state];

  const embed = new MessageEmbed()
    .setDescription(text)
    .setColor(color as ColorResolvable);

  return embed;
}

export async function image(url: string, title: string | null = null): Promise<MessageEmbed> {

  const embed = new MessageEmbed()
    .setImage(url)
    .setColor('RANDOM');

  if (title != null) embed.setTitle(title);

  return embed;
}