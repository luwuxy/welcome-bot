const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}.`);

        client.user.setActivity('DM me to contact staff!');
        try {
            client.modmailGuild = await client.guilds.fetch(process.env.GUILD_ID);
            client.modmailChannel = await client.channels.fetch(process.env.MODMAIL_ID);
            client.modmailWelcome = await client.channels.fetch(process.env.CHANNEL_ID);
            console.log("Guild and modmail channel has been fetched!");
        } catch (e) {
            console.error("Failed to fetch modmail channel:", e);
        }
    },
};