const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw money from the bank.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to withdraw')
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount <= 0) {
            return interaction.reply('❌ Please enter a valid amount to withdraw.');
        }
        const success = store.transferToWallet(interaction.user.id, amount);
        if (success) {
            await interaction.reply(`💰 Withdrew **$${amount}** from your bank.`);
        } else {
            await interaction.reply('❌ You do not have enough money in your bank.');
        }
    }
};