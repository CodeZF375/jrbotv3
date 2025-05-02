const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');
const { getShop } = require('../../utils/store');
const inventory = require('../../utils/inventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription('Sell an item from your inventory.')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Item name to sell')
                .setRequired(true)
        ),
    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const shop = getShop();
        const item = shop.find(i => i.name.toLowerCase() === itemName.toLowerCase());
        if (!item) {
            return interaction.reply('❌ That item cannot be sold (not in shop).');
        }
        if (!inventory.hasItem(interaction.user.id, item.name, 1)) {
            return interaction.reply('❌ You do not have this item in your inventory.');
        }
        inventory.removeItem(interaction.user.id, item.name, 1);
        const sellPrice = Math.floor(item.price * 0.5); // 50% refund
        store.addWallet(interaction.user.id, sellPrice);
        await interaction.reply(`✅ You sold **${item.name}** for $${sellPrice}!`);
    }
};