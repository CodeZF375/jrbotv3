const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');
const inventory = require('../../utils/inventory');
const { getShop } = require('../../utils/store');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('networth')
        .setDescription('Show your total net worth (wallet + bank + inventory).'),
    async execute(interaction) {
        const user = store.getUser(interaction.user.id);
        const inv = inventory.getInventory(interaction.user.id);
        const shop = getShop();

        let invValue = 0;
        for (const [itemName, qty] of Object.entries(inv)) {
            const item = shop.find(i => i.name.toLowerCase() === itemName.toLowerCase());
            if (item) invValue += item.price * qty;
        }
        const total = (user.wallet || 0) + (user.bank || 0) + invValue;
        await interaction.reply(
            `💰 **Wallet:** $${user.wallet}\n` +
            `🏦 **Bank:** $${user.bank}\n` +
            `🎒 **Inventory Value:** $${invValue}\n` +
            `\n**Total Net Worth:** $${total}`
        );
    }
};