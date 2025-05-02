const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Ban a user for a specific time.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to tempban')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Ban duration in minutes')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for ban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const minutes = interaction.options.getInteger('minutes');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
        if (!target.bannable) return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });

        await target.ban({ reason });
        await interaction.reply({ content: `Banned ${target.user.tag} for ${minutes} minutes. Reason: ${reason}` });

        setTimeout(async () => {
            try {
                await interaction.guild.members.unban(target.id, 'Temporary ban expired');
            } catch (e) {}
        }, minutes * 60 * 1000);
    },
};