const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (message.guild) return;

        let cachedUsers;

        const channel = message.client.modmailChannel;
        if (!channel) return console.error('Modmail channel not available.');

        try {
            cachedUsers = JSON.parse(fs.readFileSync("cachedUsers.json", 'utf-8'));
        } catch (e) {
            cachedUsers = [];
        }

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('Modmail')
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setFooter({
                text: `User ID: ${message.author.id}`
            });

        try {
            if (message.content) {
                embed.setDescription(message.content);
            }

            if (message.attachments.size > 0) {
                const embeds = [embed];

                const firstImage = message.attachments.first();
                if (firstImage.contentType.startsWith("image/")) {
                    embed.setImage(firstImage.url);
                }

                message.attachments.each(file => {
                    if (file.id === firstImage.id) return;
                    if (!file.contentType || !file.contentType.startsWith("image/")) return;
                    const embedImage = new EmbedBuilder()
                        .setColor('Orange')
                        .setImage(file.url)
                        .setTimestamp()
                        .setFooter({
                            text: `User ID: ${message.author.id}`
                        });
                    embeds.push(embedImage);
                })
                await channel.send({ embeds: embeds });
            } else {
                await channel.send({ embeds: [embed] });
            }
            await message.react('✅');

            if (!cachedUsers.includes(message.author.id)) {
                cachedUsers.push(message.author.id);
                fs.writeFile("cachedUsers.json", JSON.stringify(cachedUsers), (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('File written successfully!');
                })
            }
        } catch (e) {
            console.error('Failed to forward modmail:', e);
            await message.react('❌');
            await message.channel.send('❌ Failed to forward modmail! An error log has been reported to the developer.')
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                })
                .catch(console.error);
        }
    },
};