const { SlashCommandBuilder, PermissionFlagsBits, PermissionFlagsBits: { SendMessages } } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock this channel for regular users.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const everyone = interaction.guild.roles.everyone;
        await interaction.channel.permissionOverwrites.edit(everyone, { SendMessages: false });
        await interaction.reply({ content: 'Channel locked.' });
    },
};