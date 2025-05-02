const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

const cooldowns = {}; // { userId: timestamp }
const COOLDOWN = 60 * 60 * 1000; // 1 hour

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Attempt to rob another user (with cooldown and risk).')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to rob')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        if (target.id === interaction.user.id) return interaction.reply('❌ You cannot rob yourself.');
        const now = Date.now();
        if (cooldowns[interaction.user.id] && now - cooldowns[interaction.user.id] < COOLDOWN) {
            const timeLeft = Math.ceil((COOLDOWN - (now - cooldowns[interaction.user.id])) / 60000);
            return interaction.reply(`⏳ You must wait ${timeLeft} more minutes before robbing again.`);
        }
        const userBal = store.getUser(interaction.user.id).wallet;
        const targetBal = store.getUser(target.id).wallet;
        if (targetBal < 100) return interaction.reply('❌ Target does not have enough money to rob (min $100).');
        if (userBal < 50) return interaction.reply('❌ You need at least $50 in your wallet to attempt a robbery.');

        cooldowns[interaction.user.id] = now;
        const success = Math.random() < 0.5;
        if (success) {
            const amount = Math.floor(Math.random() * (targetBal * 0.5)) + 50;
            store.addWallet(interaction.user.id, amount);
            store.addWallet(target.id, -amount);
            await interaction.reply(`💰 You successfully robbed **${target.username}** and got **$${amount}**!`);
        } else {
            const penalty = Math.floor(userBal * 0.25);
            store.addWallet(interaction.user.id, -penalty);
            await interaction.reply(`🚨 You got caught! You lost **$${penalty}** as a penalty.`);
        }
    }
};