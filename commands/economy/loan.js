const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

const loans = {}; // { userId: { amount: number, due: number } }
const INTEREST = 0.2; // 20% interest

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loan')
        .setDescription('Borrow money (with interest).')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to borrow')
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount <= 0) return interaction.reply('❌ Enter a valid amount to borrow.');
        if (loans[interaction.user.id]) {
            return interaction.reply('❌ You already have an outstanding loan. Repay it before borrowing again.');
        }
        const due = Math.floor(amount * (1 + INTEREST));
        loans[interaction.user.id] = { amount, due };
        store.addWallet(interaction.user.id, amount);
        await interaction.reply(`💵 You borrowed $${amount}. You must repay $${due} to clear your loan.`);
    },
    // Optional: Add a repay command or logic elsewhere to clear loans
    loans // Export for external access if needed
};