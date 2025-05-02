const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

const JOBS = [
    'coder', 'streamer', 'miner', 'designer', 'writer', 'chef', 'gamer'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Earn random money by working.'),
    async execute(interaction) {
        const job = JOBS[Math.floor(Math.random() * JOBS.length)];
        const amount = Math.floor(Math.random() * 200) + 100; // $100-$299
        store.addWallet(interaction.user.id, amount);
        await interaction.reply(`👷 You worked as a **${job}** and earned **$${amount}**!`);
    }
};