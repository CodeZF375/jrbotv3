const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Remove a user from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
        if (!target.kickable) return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });

        await target.kick(reason);
        await interaction.reply({ content: `Kicked ${target.user.tag}. Reason: ${reason}` });
    },
};