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

        try {
            const channel = await message.client.channels.fetch(process.env.MODMAIL_ID);
            await channel.send({ embeds: [embed] });
            message.react('✅');
        } catch (e) {
            console.error('Failed to forward modmail:', e);
            await message.react('❌');
            message.channel.send('❌ Failed to forward modmail! An error log has been reported to the developer.')
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                })
                .catch(console.error);
        }
    },
};