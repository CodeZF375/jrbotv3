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
        .setName('warn')
        .setDescription('Issue a warning to a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for warning')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const warnings = getWarnings();
        if (!warnings[target.id]) warnings[target.id] = [];
        warnings[target.id].push({
            moderator: interaction.user.id,
            reason,
            date: new Date().toISOString()
        });
        saveWarnings(warnings);
        await interaction.reply({ content: `Warned ${target.tag}. Reason: ${reason}` });
    },
};