const { SlashCommandBuilder } = require('discord.js');
const inventory = require('../../utils/inventory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inv')
        .setDescription('See what items you own (alias for /inventory).'),
    async execute(interaction) {
        const inv = inventory.getInventory(interaction.user.id);
        const items = Object.entries(inv);
        if (items.length === 0) {
            return interaction.reply('🎒 Your inventory is empty.');
        }
        const list = items.map(([name, qty]) => `• **${name}** x${qty}`).join('\n');
        await interaction.reply(`🎒 **Your Inventory:**\n${list}`);
    }
};