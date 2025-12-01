const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
let cachedUsers;
let bumpCount = {};

try {
    cachedUsers = JSON.parse(fs.readFileSync("cachedUsers.json", "utf-8"));
    bumpCount = JSON.parse(fs.readFileSync("bumpCount.json", "utf-8"));
} catch (e) {
    cachedUsers = [];
    bumpCount.totalCount = 0;
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (
            message.author.bot &&
            message.author.id === '302050872383242240' &&
            message.interaction.commandName === 'bump'
        ) {
            console.log('The server was bumped!');
            bumpCount.totalCount++;

            if (!bumpCount[message.interaction.user.id]) {
                bumpCount[message.interaction.user.id] = {
                    author: message.interaction.user.username,
                    userBumpCount: 1,
                    date: message.createdTimestamp
                }
            } else {
                bumpCount[message.interaction.user.id].author = message.interaction.user.username;
                bumpCount[message.interaction.user.id].userBumpCount++;
                bumpCount[message.interaction.user.id].date = message.createdTimestamp;
            }

            fs.writeFileSync("bumpCount.json", JSON.stringify(bumpCount), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('File written successfully!');
            })
            return;
        } else if (message.author.bot || message.guild) {
            return;
        }

        const channel = message.client.modmailChannel;
        if (!channel) return console.error('Modmail channel not available.');

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
                fs.writeFileSync("cachedUsers.json", JSON.stringify(cachedUsers), (err) => {
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