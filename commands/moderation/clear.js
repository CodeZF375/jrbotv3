const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const purgeLogic = require('./purgeLogic');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Alias for /purge: Delete a number of recent messages in this channel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (max 100)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        await purgeLogic(interaction);
    },
};