const { SlashCommandBuilder } = require('discord.js');
const { addItem } = require('../../utils/store');

const OWNER_ID = '791741859423584286'; // <-- Replace with your Discord user ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('additem')
        .setDescription('Add an item to the store (owner only).')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Item name')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('price')
                .setDescription('Item price')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({ content: '❌ Only the bot owner can add items to the store.', ephemeral: true });
        }
        const name = interaction.options.getString('name');
        const price = interaction.options.getInteger('price');
        addItem({ name, price });
        await interaction.reply(`✅ Added **${name}** to the store for $${price}.`);
    }
};