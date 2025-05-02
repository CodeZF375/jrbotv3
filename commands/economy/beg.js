const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Try your luck begging for coins.'),
    async execute(interaction) {
        if (Math.random() < 0.5) {
            const amount = Math.floor(Math.random() * 50) + 1; // $1-$50
            store.addWallet(interaction.user.id, amount);
            await interaction.reply(`💸 Someone gave you **$${amount}**!`);
        } else {
            await interaction.reply('😢 Nobody gave you anything this time.');
        }
    }
};