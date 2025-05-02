const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user (timeout).')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to mute')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Minutes to mute (leave blank for permanent/24h)')
                .setRequired(false))
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

        let duration = minutes ? minutes * 60 * 1000 : 24 * 60 * 60 * 1000; // Default 24h
        await target.timeout(duration, reason);
        await interaction.reply({ content: `Muted ${target.user.tag} for ${minutes || 1440} minutes. Reason: ${reason}` });
    },
};