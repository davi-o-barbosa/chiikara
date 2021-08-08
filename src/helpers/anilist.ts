import { MessageEmbed } from 'discord.js';
import fetch, { Response } from 'node-fetch';

const status: { [key: string]: string } = {
	'FINISHED': 'Finalizado',
	'RELEASING': 'Lançando',
	'NOT_YET_RELEASED': 'Em breve',
	'CANCELLED': 'Cancelado',
	'HIATUS': 'Hiato',
};

const season: { [key: string]: string } = {
	'WINTER': 'Inverno',
	'SPRING': 'Primavera',
	'SUMMER': 'Verão',
	'FALL': 'Outono',
};


async function fetchAnime(anime: string): Promise<any> {
	const url = 'https://graphql.anilist.co';
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({
			query: animeQuery,
			variables: { search: anime },
		}),
	};
	const response = await fetch(url, options);
	const json = await response.json();
	return json.data.Media;
}

export async function getAnime(anime: string): Promise<MessageEmbed | null> {
	const data = await fetchAnime(anime);

	if (!data) return null;

	const embed = new MessageEmbed()
		.setTitle(data.title.romaji)
		.setDescription(data.title.native)
		.setColor('RANDOM')
		.setURL(data.siteUrl)
		.setImage(data.bannerImage)
		.setFooter('Dados disponibilizados pelo AniList e trace.moe.', 'https://anilist.co/img/icons/android-chrome-512x512.png')
		.addField('Temporada', `${season[data.season]} - ${data.seasonYear}`, true)
		.addField('Status', status[data.status], true)
		.addField('Nota - Anilist', `${data.meanScore / 10}/10`, true);
	return embed;
}

const animeQuery = `
query ($search: String) {
	Media(search: $search, type: ANIME) {
		id
		title {
			romaji
			native
		}
		status
		meanScore
		episodes
		nextAiringEpisode {
			timeUntilAiring
			airingAt
			episode
		}
		season
		seasonYear
		isLicensed
		externalLinks {
			site
			url
		}
		bannerImage
		siteUrl
		coverImage {
			large
		}
	}
}
`;