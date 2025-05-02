const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');
const inventory = require('../../utils/inventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Show your economic progress.'),
    async execute(interaction) {
        const user = store.getUser(interaction.user.id);
        const inv = inventory.getInventory(interaction.user.id);
        const invList = Object.entries(inv)
            .map(([name, qty]) => `• ${name} x${qty}`)
            .join('\n') || 'None';

        await interaction.reply(
            `📊 **Your Stats:**\n` +
            `💰 Wallet: $${user.wallet}\n` +
            `🏦 Bank: $${user.bank}\n` +
            `🎒 Inventory:\n${invList}`
        );
    }
};