const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

const symbols = ['🍒', '🍋', '🍉', '🍇', '🔔', '⭐', '💎'];

function spin() {
    return [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Slot machine style game.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to bet')
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount <= 0) return interaction.reply('❌ Enter a valid amount to bet.');
        const user = store.getUser(interaction.user.id);
        if (user.wallet < amount) return interaction.reply('❌ You do not have enough coins.');
        store.addWallet(interaction.user.id, -amount);

        const result = spin();
        let payout = 0;
        if (result[0] === result[1] && result[1] === result[2]) {
            payout = amount * 5;
        } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
            payout = amount * 2;
        }
        if (payout > 0) store.addWallet(interaction.user.id, payout);

        await interaction.reply(
            `🎰 | ${result.join(' | ')} |\n` +
            (payout > 0
                ? `🎉 You won **$${payout}**!`
                : `😢 You lost **$${amount}**. Better luck next time!`)
        );
    }
};