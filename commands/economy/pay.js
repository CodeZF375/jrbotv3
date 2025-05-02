const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Send money to another user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to pay')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to send')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        if (target.id === interaction.user.id) return interaction.reply('❌ You cannot pay yourself.');
        if (amount <= 0) return interaction.reply('❌ Enter a valid amount to pay.');
        const user = store.getUser(interaction.user.id);
        if (user.wallet < amount) return interaction.reply('❌ You do not have enough money.');
        store.addWallet(interaction.user.id, -amount);
        store.addWallet(target.id, amount);
        await interaction.reply(`💸 You paid **${target.tag}** $${amount}.`);
    }
};