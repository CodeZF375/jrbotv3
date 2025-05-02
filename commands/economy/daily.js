const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

const DAILY_REWARD = 500;
const COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim a daily reward.'),
    async execute(interaction) {
        const user = store.getUser(interaction.user.id);
        const now = Date.now();
        if (now - user.lastDaily < COOLDOWN) {
            const timeLeft = COOLDOWN - (now - user.lastDaily);
            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            return interaction.reply(
                `⏳ You already claimed your daily! Try again in ${hours}h ${minutes}m.`
            );
        }
        user.wallet += DAILY_REWARD;
        user.lastDaily = now;
        store.setUser(interaction.user.id, user);
        await interaction.reply(`🎉 You claimed your daily reward of $${DAILY_REWARD}!`);
    }
};