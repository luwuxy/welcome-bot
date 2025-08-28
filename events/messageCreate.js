const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (message.guild) return;

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('Modmail')
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL()
            })
            .setDescription(message.content)
            .setTimestamp()
            .setFooter({
                text: `User ID: ${message.author.id}`
            });

        await message.client.channels.fetch(process.env.MODMAIL_ID)
            .then((channel) => channel.send({
                embeds: [embed]
            }));
        message.react('✅');
    },
};