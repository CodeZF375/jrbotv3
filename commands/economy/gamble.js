const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Risk your coins in a coinflip.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to gamble')
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount <= 0) return interaction.reply('❌ Enter a valid amount to gamble.');
        const user = store.getUser(interaction.user.id);
        if (user.wallet < amount) return interaction.reply('❌ You do not have enough coins.');
        const win = Math.random() < 0.5;
        if (win) {
            store.addWallet(interaction.user.id, amount);
            await interaction.reply(`🪙 You won the coinflip and gained **$${amount}**!`);
        } else {
            store.addWallet(interaction.user.id, -amount);
            await interaction.reply(`💸 You lost the coinflip and lost **$${amount}**.`);
        }
    }
};