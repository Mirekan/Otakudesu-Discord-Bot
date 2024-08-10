require ('dotenv').config();
const axios = require('axios');
const { Client, GatewayIntentBits, Embed } = require('discord.js');
const { text } = require('stream/consumers');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const URL = process.env.URL;
const TOKEN = process.env.DISCORD_TOKEN;

client.login(TOKEN);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


async function getAnimeDetail(anime_title) {
  try {
    const response = await axios.get(`${URL}/api/v1/detail/${anime_title}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    try {
        if (message.content.startsWith('.anime')) {
            const anime_title = message.content.split('.anime ')[1];
            if (!anime_title) {
                message.channel.send('Please provide an anime title.');
                return;
            }

            const data = await getAnimeDetail(anime_title);
            const { title, thumb, sinopsis, detail} = data.anime_detail;

            let detailMessages = `Title: ${title}\n`;
            let sinopsisMessage = "";

            sinopsis.forEach((item) => {
                sinopsisMessage += `${item}\n`;
            });

            detail.forEach((item) => {
                 detailMessages += `${item}\n`;
            });

            message.channel.send({
                embeds: [
                    {
                        title: title,
                        thumbnail: {
                            url: thumb
                        },
                        description: sinopsisMessage,
                        footer: {
                            text: 'Powered by Ade'
                        }
                    }
                ],
                content: detailMessages
            });
        } 
        
    } catch (error) {
    console.error(error);
  } 

});