const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const warnsPath = path.join(__dirname, '../data/warnings.json');

function getWarnings() {
    if (!fs.existsSync(warnsPath)) return {};
    return JSON.parse(fs.readFileSync(warnsPath, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('View warnings of a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to check')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const warnings = getWarnings();
        const userWarns = warnings[target.id] || [];
        if (userWarns.length === 0) {
            return interaction.reply({ content: `${target.tag} has no warnings.` });
        }
        let desc = userWarns.map((w, i) =>
            `**${i + 1}.** ${w.reason} (by <@${w.moderator}> at ${new Date(w.date).toLocaleString()})`
        ).join('\n');
        await interaction.reply({ content: `Warnings for ${target.tag}:\n${desc}` });
    },
};