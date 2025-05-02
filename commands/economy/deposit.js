const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposit money into the bank.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to deposit')
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount <= 0) {
            return interaction.reply('❌ Please enter a valid amount to deposit.');
        }
        const success = store.transferToBank(interaction.user.id, amount);
        if (success) {
            await interaction.reply(`🏦 Deposited **$${amount}** to your bank.`);
        } else {
            await interaction.reply('❌ You do not have enough money in your wallet.');
        }
    }
};