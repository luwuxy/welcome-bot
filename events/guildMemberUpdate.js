const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        function getOrdinalSuffix(num) {
            const lastTwo = num % 100;

            if (lastTwo >= 11 && lastTwo <= 13) {
                return "th";
            }

            switch (num % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        }

        try {
            if (oldMember.pending === true && newMember.pending === false) {
                const channel = newMember.client.modmailWelcome;
                const memberCount = newMember.guild.memberCount;
                let suffix = getOrdinalSuffix(memberCount);

                const welcomeEmbed = new EmbedBuilder()
                    .setColor('#ffefd6')
                    .setTitle(`Welcome to ${newMember.guild.name}!`)
                    .setAuthor({
                        name: newMember.user.tag,
                        iconURL: newMember.displayAvatarURL({ format: 'png', size: 128 })
                    })
                    .setThumbnail(newMember.guild.iconURL({ size: 128, extension: 'png' }))
                    .setDescription(`Before you start talking, be sure to check out the <#${process.env.CHANNEL_ID2}> and introduce yourself in <#${process.env.CHANNEL_ID3}>!`)
                    .setImage('https://cdn.discordapp.com/attachments/1432267123979194451/1435206965088489492/bocchi-the-rock-bocchi.gif?ex=69223265&is=6920e0e5&hm=5d8473001bf7436d9c2b3fb27a95f8c5acf99bd1c8c5c8b6fecae72fe85b0ed4&')
                    .setFooter({
                        text: `You are the ${memberCount}${suffix} user to join!`
                    });

                channel.send({
                    content: `<@${newMember.id}>`,
                    embeds: [welcomeEmbed]
                });
            }
        } catch (e) {
            console.log(e);
        }
    },
};