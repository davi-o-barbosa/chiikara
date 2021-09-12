import { CommandInteraction } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { SlashCommandBuilder } from '@discordjs/builders';
import bot from './config/bot';

export default {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Configurar o funcionamento do bot neste servidor.')

		.addSubcommandGroup(subCommandGroup =>
			subCommandGroup
				.setName('bot')
				.setDescription('Configura qual canal será usado pela chiikara para aceitar comandos.')
				.addSubcommand(subCommand =>
					subCommand
						.setName('add')
						.setDescription('Adiciona à lista de canais que a Chiikara aceita comandos.')
						.addChannelOption(option =>
							option
								.setName('canal')
								.setDescription('O canal a ser adicionado.')
								.setRequired(true),
						),
				)
				.addSubcommand(subCommand =>
					subCommand
						.setName('remover')
						.setDescription('Remove o canal da lista de Chiikara.')
						.addChannelOption(option =>
							option
								.setName('canal')
								.setDescription('O canal a ser removido.')
								.setRequired(true),
						),
				)
				.addSubcommand(subCommand =>
					subCommand
						.setName('ver')
						.setDescription('Ver os canais configurados.'),
				),
		)

		.addSubcommandGroup(subCommandGroup =>
			subCommandGroup
				.setName('proteger')
				.setDescription('Configura quais canais serão protegidos do comando de esconder canais.')
				.addSubcommand(subCommand =>
					subCommand
						.setName('add')
						.setDescription('Protege um canal de ser escondido por usuários do bot.')
						.addChannelOption(option =>
							option
								.setName('canal')
								.setDescription('Canal a ser adicionado.')
								.setRequired(true),
						),
				)
				.addSubcommand(subCommand =>
					subCommand
						.setName('remover')
						.setDescription('Desprotege um canal.')
						.addChannelOption(option =>
							option
								.setName('canal')
								.setDescription('Canal a ser desprotegido.')
								.setRequired(true),
						),
				),
		)

		.addSubcommandGroup(subCommandGroup =>
			subCommandGroup
				.setName('mod')
				.setDescription('Configura quais cargos tem permissão pra usar os comandos de moderação.')
				.addSubcommand(subCommand =>
					subCommand
						.setName('add')
						.setDescription('Adiciona um cargo a lista dos moderadores do grupo.')
						.addRoleOption(option =>
							option
								.setName('cargo')
								.setDescription('Cargo a ser adicionado.')
								.setRequired(true),
						),
				)
				.addSubcommand(subCommand =>
					subCommand
						.setName('remover')
						.setDescription('Remove um cargo.')
						.addRoleOption(option =>
							option
								.setName('cargo')
								.setDescription('Cargo a ser removido.')
								.setRequired(true),
						),
				),
		),

	async execute(interaction: CommandInteraction, prisma: PrismaClient): Promise<void> {
		const subCommandGroup = interaction.options.getSubcommandGroup();

		switch (subCommandGroup) {
			case 'bot':
				await bot(interaction, prisma);
				break;
			case 'mod':
				break;
			case 'proteger':
				break;
			default:
				return;
		}

	},
};