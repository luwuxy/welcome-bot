const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        if (oldMember.pending === true && newMember.pending === false) {
            const channel = newMember.client.modmailWelcome;

            const welcomeEmbed = new EmbedBuilder()
                .setColor('#ffefd6')
                .setTitle(`Welcome to ${newMember.guild.name}!`)
                .setAuthor({
                    name: newMember.user.tag,
                    iconURL: newMember.displayAvatarURL({ format: 'png', size: 128 })
                })
                .setThumbnail(newMember.guild.iconURL({ size: 128, extension: 'png' }))
                .setDescription(`Before you start talking, be sure to check out the <#${process.env.CHANNEL_ID2}> and introduce yourself in <#${process.env.CHANNEL_ID3}>!`)
                .setImage('https://c.tenor.com/ovJxRSyjPQEAAAAC/tenor.gif');

            channel.send({
                content: `<@${newMember.id}>`,
                embeds: [welcomeEmbed]
            });
        }
    },
};