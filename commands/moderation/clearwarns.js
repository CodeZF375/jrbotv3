const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const warnsPath = path.join(__dirname, '../data/warnings.json');

function getWarnings() {
    if (!fs.existsSync(warnsPath)) return {};
    return JSON.parse(fs.readFileSync(warnsPath, 'utf8'));
}
function saveWarnings(data) {
    fs.writeFileSync(warnsPath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarns')
        .setDescription('Clear all warnings of a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to clear warnings for')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const warnings = getWarnings();
        warnings[target.id] = [];
        saveWarnings(warnings);
        await interaction.reply({ content: `Cleared all warnings for ${target.tag}.` });
    },
};