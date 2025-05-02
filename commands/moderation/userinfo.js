const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const warnsPath = path.join(__dirname, '../data/warnings.json');

function getWarnings() {
    if (!fs.existsSync(warnsPath)) return {};
    return JSON.parse(fs.readFileSync(warnsPath, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Show user’s join date, roles, warnings, etc.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to show info for')
                .setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getMember('target') || interaction.member;
        const warnings = getWarnings();
        const userWarns = warnings[member.id] || [];
        const roles = member.roles.cache
            .filter(r => r.id !== interaction.guild.id)
            .map(r => `<@&${r.id}>`)
            .join(', ') || 'None';
        await interaction.reply({
            embeds: [{
                title: `User Info: ${member.user.tag}`,
                thumbnail: { url: member.user.displayAvatarURL() },
                fields: [
                    { name: 'ID', value: member.id, inline: true },
                    { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp/1000)}:F>`, inline: true },
                    { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp/1000)}:F>`, inline: true },
                    { name: 'Roles', value: roles, inline: false },
                    { name: 'Warnings', value: `${userWarns.length}`, inline: true }
                ]
            }]
        });
    },
};