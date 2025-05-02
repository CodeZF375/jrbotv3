const { SlashCommandBuilder } = require('discord.js');
const inventory = require('../../utils/inventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('use')
        .setDescription('Use a special item from your inventory.')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Item name to use')
                .setRequired(true)
        ),
    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        if (!inventory.hasItem(interaction.user.id, itemName, 1)) {
            return interaction.reply('❌ You do not have this item in your inventory.');
        }
        // Example: handle lootbox or booster
        if (itemName.toLowerCase() === 'lootbox') {
            inventory.removeItem(interaction.user.id, itemName, 1);
            // Give a random reward (for demo, $100-$500)
            const reward = Math.floor(Math.random() * 401) + 100;
            const store = require('../../utils/economy');
            store.addWallet(interaction.user.id, reward);
            return interaction.reply(`🎁 You opened a lootbox and found **$${reward}**!`);
        }
        // Add more item effects here
        return interaction.reply(`✨ You used **${itemName}**! (No special effect)`);
    }
};