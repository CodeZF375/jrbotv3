const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');
const { getShop } = require('../../utils/store');
const inventory = require('../../utils/inventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Purchase an item from the shop.')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Item name to buy')
                .setRequired(true)
        ),
    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const shop = getShop();
        const item = shop.find(i => i.name.toLowerCase() === itemName.toLowerCase());
        if (!item) {
            return interaction.reply('❌ That item is not in the shop.');
        }
        const user = store.getUser(interaction.user.id);
        if (user.wallet < item.price) {
            return interaction.reply('❌ You do not have enough money to buy this item.');
        }
        store.addWallet(interaction.user.id, -item.price);
        inventory.addItem(interaction.user.id, item.name, 1);
        await interaction.reply(`✅ You bought **${item.name}** for $${item.price}!`);
    }
};