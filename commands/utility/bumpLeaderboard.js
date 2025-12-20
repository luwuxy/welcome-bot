const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require('fs');
let bumpCount;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bumplb")
        .setDescription("Shows the bump leaderboard for this server."),
    async execute(interaction) {
        try {
            bumpCount = JSON.parse(fs.readFileSync("bumpCount.json", "utf-8"));
        } catch (e) {
            console.log('Leaderboard does not exist.');
        }

        let leaderboardEmbed = new EmbedBuilder();

        if (bumpCount) {
            leaderboardEmbed
                .setColor('#ffefd6')
                .setTitle(`Bump Leaderboard for ${interaction.guild.name}`)
                .setFooter({ text: `Total Bumps: ${bumpCount.totalCount}` });
            const rankedIds = Object.keys(bumpCount)
                .filter(id => id !== "totalCount")
                .sort((a, b) => bumpCount[b].userBumpCount - bumpCount[a].userBumpCount)
                .slice(0, 10);

            rankedIds.forEach((userId, i) => {
                leaderboardEmbed.addFields({
                    name: `${i + 1}. ${bumpCount[userId].author}`,
                    value: `\\- Bumps: ${bumpCount[userId].userBumpCount}
                \\- Last Bump: <t:${Math.floor(bumpCount[userId].date / 1000)}:f>`
                });
            });

        } else {
            interaction.reply('No one has bumped this server yet!');
            return;
        }

        interaction.reply({
            embeds: [leaderboardEmbed]
        })
    }
}