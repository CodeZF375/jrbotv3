const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempmute')
        .setDescription('Mute a user for a specific time.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to tempmute')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Mute duration in minutes')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for mute')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const minutes = interaction.options.getInteger('minutes');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
        if (!target.moderatable) return interaction.reply({ content: 'I cannot mute this user.', ephemeral: true });

        await target.timeout(minutes * 60 * 1000, reason);
        await interaction.reply({ content: `Muted ${target.user.tag} for ${minutes} minutes. Reason: ${reason}` });
    },
};