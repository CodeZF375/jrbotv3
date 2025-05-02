const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const reportPath = path.join(__dirname, '../data/reports.json');

function getReports() {
    if (!fs.existsSync(reportPath)) return [];
    return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
}
function saveReports(data) {
    fs.writeFileSync(reportPath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user to the moderators.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to report')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for report')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const reports = getReports();
        reports.push({
            reporter: interaction.user.id,
            target: target.id,
            reason,
            date: new Date().toISOString()
        });
        saveReports(reports);
        await interaction.reply({ content: `Your report against ${target.tag} has been submitted to the moderators.`, ephemeral: true });
    },
};