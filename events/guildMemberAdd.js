const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
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

        await member.guild.channels.fetch(process.env.CHANNEL_ID)
            .then(channel => {
                channel.send({
                    content: `<@${member.id}>`,
                    embeds: [welcomeEmbed]
                });
            })
            .catch(console.error);
    },
};