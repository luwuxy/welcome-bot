const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reply")
        .setDescription("Reply to a modmail")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Select a user to reply to')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Type your reply here')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('member');
        const message = interaction.options.getString('message');
        if (user.id === interaction.user.id) {
            interaction.reply({
                content: "You cannot reply to yourself!",
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        let cachedUsers;

        try {
            cachedUsers = JSON.parse(fs.readFileSync("cachedUsers.json", 'utf-8'));
        } catch (e) {
            cachedUsers = [];
        }

        if (!cachedUsers.includes(interaction.user.id)) {
            interaction.reply({
                content: "This user has not used modmail!",
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`Message from ${interaction.client.modmailGuild.name}'s staff team`)
            .setDescription(message)
            .setTimestamp();

        try {
            await user.send({
                embeds: [embed]
            });
            await interaction.reply(`**Message has been sent:**\n\n${message}`);
        } catch (e) {
            console.error(e);
            await interaction.reply("Failed to send DM! User may not be receiving DMs.");
        }
    }
}