const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remove mute (timeout) from a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to unmute')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
        if (!target.moderatable) return interaction.reply({ content: 'I cannot unmute this user.', ephemeral: true });

        await target.timeout(null);
        await interaction.reply({ content: `Unmuted ${target.user.tag}` });
    },
};