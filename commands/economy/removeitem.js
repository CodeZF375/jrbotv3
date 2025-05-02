const { SlashCommandBuilder } = require('discord.js');
const { removeItem } = require('../../utils/store');

const OWNER_ID = '791741859423584286'; // <-- Replace with your Discord user ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeitem')
        .setDescription('Remove an item from the store (owner only).')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Item name to remove')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({ content: '❌ Only the bot owner can remove items from the store.', ephemeral: true });
        }
        const name = interaction.options.getString('name');
        const success = removeItem(name);
        if (success) {
            await interaction.reply(`✅ Removed **${name}** from the store.`);
        } else {
            await interaction.reply(`❌ Item **${name}** not found in the store.`);
        }
    }
};