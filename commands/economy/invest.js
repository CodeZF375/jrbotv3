const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invest')
        .setDescription('Simulate stocks or crypto investments.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to invest')
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount <= 0) return interaction.reply('❌ Enter a valid amount to invest.');
        const user = store.getUser(interaction.user.id);
        if (user.wallet < amount) return interaction.reply('❌ You do not have enough money to invest.');
        store.addWallet(interaction.user.id, -amount);

        // Simulate investment: -50% to +100% return
        const percent = Math.floor(Math.random() * 151) - 50; // -50 to +100
        const result = Math.floor(amount * (percent / 100));
        store.addWallet(interaction.user.id, amount + result);

        if (result >= 0) {
            await interaction.reply(`📈 Your investment grew by ${percent}%! You gained $${result} (Total returned: $${amount + result}).`);
        } else {
            await interaction.reply(`📉 Your investment dropped by ${Math.abs(percent)}%. You lost $${Math.abs(result)} (Returned: $${amount + result}).`);
        }
    }
};