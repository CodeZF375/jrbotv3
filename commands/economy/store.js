const { SlashCommandBuilder } = require('discord.js');
const { getShop } = require('../../utils/store');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('View all items in the store.'),
    async execute(interaction) {
        const shop = getShop();
        if (shop.length === 0) {
            return interaction.reply('🛒 The store is currently empty.');
        }
        const list = shop.map(item => `• **${item.name}** — $${item.price}`).join('\n');
        await interaction.reply(`🛒 **Store Items:**\n${list}`);
    }
};