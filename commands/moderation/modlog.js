        const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logPath = path.join(__dirname, '../data/modlog.json');

function getLogs() {
    if (!fs.existsSync(logPath)) return [];
    return JSON.parse(fs.readFileSync(logPath, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modlog')
        .setDescription('Show recent moderation actions.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const logs = getLogs().slice(-10).reverse();
        if (logs.length === 0) return interaction.reply({ content: 'No moderation actions logged yet.' });
        const desc = logs.map(log =>
            `**[${log.action}]** <@${log.target}> by <@${log.moderator}> (${log.reason}) at ${new Date(log.date).toLocaleString()}`
        ).join('\n');
        await interaction.reply({ content: `**Recent Moderation Actions:**\n${desc}` });
    },
};