const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(member) {
        if (member.pending === false) return;
        
        const channel = member.client.modmailWelcome;

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#ffefd6')
            .setTitle(`Welcome to ${member.guild.name}!`)
            .setAuthor({
                name: member.user.tag,
                iconURL: member.displayAvatarURL({ format: 'png', size: 128})
            })
            .setThumbnail(member.guild.iconURL({size: 128, extension: 'png'}))
            .setDescription(`Before you start talking, be sure to check out the <#${process.env.CHANNEL_ID2}> and introduce yourself in <#${process.env.CHANNEL_ID3}>!`)
            .setImage('https://c.tenor.com/ovJxRSyjPQEAAAAC/tenor.gif');

        channel.send({
            content: `<@${member.id}>`,
            embeds: [welcomeEmbed]
        });
    },
};