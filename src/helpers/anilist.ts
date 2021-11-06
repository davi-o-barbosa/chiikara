import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

const statusDict: { [key: string]: string } = {
  'FINISHED': 'Finalizado',
  'RELEASING': 'Sendo transmitido',
  'NOT_YET_RELEASED': 'Em breve',
  'CANCELLED': 'Cancelado',
  'HIATUS': 'Hiato',
};

const seasonDict: { [key: string]: string } = {
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

function getStreaming(data: any): string {
  const streamWebsites = ['Crunchyroll', 'Netflix', 'Funimation', 'Hidive', 'Hulu'];
  let output = '\n**Streaming:** ';

  for (const site of data) {
    if (streamWebsites.includes(site.site)) {
      output += `[${site.site}](${site.url}), `;
    }
  }

  return output.substring(0, output.length - 2);
}

export async function getAnime(anime: string): Promise<MessageEmbed | null> {
  const data = await fetchAnime(anime);
  if (!data) return null;

  const season = data.season ? seasonDict[data.season] : 'N/A';
  const seasonYear = data.seasonYear ?? 'N/A';
  const meanScore = data.meanScore ? `${data.meanScore / 10}/10` : 'N/A';
  const episodes = data.episodes ? `${data.episodes}` : 'N/A';
  const streaming = data.isLicensed ? getStreaming(data.externalLinks) : 'Nenhum streaming disponível =(';

  const embed = new MessageEmbed()
    .setTitle(data.title.romaji)
    .setDescription(data.title.native)
    .setColor('RANDOM')
    .setURL(data.siteUrl)
    .setImage(data.bannerImage)
    .setFooter('Dados disponibilizados pelo AniList e trace.moe.', 'https://anilist.co/img/icons/android-chrome-512x512.png')
    .addField('Temporada', `${season} - ${seasonYear}`, true)
    .addField('Avaliação', meanScore, true)
    .addField('Episódios:', episodes, true)
    .addField('Status', statusDict[data.status] + streaming, true);

  if (data.status === 'RELEASING') {
    if (!data.nextAiringEpisode.airingAt) return embed;

    const episode = data.nextAiringEpisode.episode;
    const time = `<t:${data.nextAiringEpisode.airingAt}:R>`;

    embed.addField('Próximo episódio: ', `**Episódio:** ${episode}\n**Horário:** ${time}`, true);
  }

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