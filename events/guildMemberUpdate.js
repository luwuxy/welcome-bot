const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        // UNUSED CODE. Might use it again so I'll keep it here.
        //
        // function getOrdinalSuffix(num) {
        //     const lastTwo = num % 100;

        //     if (lastTwo >= 11 && lastTwo <= 13) {
        //         return "th";
        //     }

        //     switch (num % 10) {
        //         case 1: return "st";
        //         case 2: return "nd";
        //         case 3: return "rd";
        //         default: return "th";
        //     }
        // }

        if (oldMember.pending && !newMember.pending) {
            const welcomeChannel = newMember.client.modmailWelcome;

            welcomeChannel.send({
                content: `T-T-Thank you for joining our ssserver <@${newMember.id}>, I-I-I hope you like it here *starts panicking and runs away*`,
                files: ['https://media1.tenor.com/m/rB17WqkruQYAAAAC/bocchi-the-rock-bocchi.gif']
            })
        } else if (!oldMember.premiumSince && newMember.premiumSince) {
            const boostChannel = newMember.client.modmailBoost;

            boostChannel.send({
                content: `WOOOOO, <@${newMember.id}> just boosted the server! Let's get some vibes up in here!`,
                files: ['https://media1.tenor.com/m/sETSg8MpU_sAAAAC/bocchi-party.gif']
            })
        }
    },
};