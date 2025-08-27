const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#ffefd6')
            .setTitle('Welcome to Pâtisserie Plain!')
            .setAuthor({
                name: member.user.tag,
                iconURL: member.displayAvatarURL({ format: 'png', size: 128})
            })
            .setThumbnail('https://cdn.discordapp.com/icons/1373475501749960776/018439d314abdad0fc0462bb058b6b95.png?size=128')
            .setDescription('Before you start talking, be sure to check out the <#1405387046649991251> and introduce yourself in <#1405387163687977071>!')
            .setImage('https://c.tenor.com/ovJxRSyjPQEAAAAC/tenor.gif');

        await member.guild.channels.fetch('1405931638415818783')
            .then(channel => {
                channel.send({
                    content: `<@${member.id}>`,
                    embeds: [welcomeEmbed]
                });
            })
            .catch(console.error);
    },
};