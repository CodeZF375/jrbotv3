const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

const cooldowns = {}; // { userId: timestamp }
const jail = {}; // { userId: jailEndTimestamp }
const COOLDOWN = 30 * 60 * 1000; // 30 minutes
const JAIL_TIME = 15 * 60 * 1000; // 15 minutes

const crimes = [
    { name: 'bank heist', min: 500, max: 2000 },
    { name: 'shoplifting', min: 100, max: 400 },
    { name: 'car theft', min: 300, max: 1000 },
    { name: 'pickpocketing', min: 50, max: 200 }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crime')
        .setDescription('Try committing a crime for rewards or jail time.'),
    async execute(interaction) {
        const now = Date.now();
        if (jail[interaction.user.id] && now < jail[interaction.user.id]) {
            const mins = Math.ceil((jail[interaction.user.id] - now) / 60000);
            return interaction.reply(`🚔 You are in jail! Wait ${mins} more minutes.`);
        }
        if (cooldowns[interaction.user.id] && now - cooldowns[interaction.user.id] < COOLDOWN) {
            const mins = Math.ceil((COOLDOWN - (now - cooldowns[interaction.user.id])) / 60000);
            return interaction.reply(`⏳ You must wait ${mins} more minutes before committing another crime.`);
        }
        cooldowns[interaction.user.id] = now;
        const crime = crimes[Math.floor(Math.random() * crimes.length)];
        const success = Math.random() < 0.5;
        if (success) {
            const amount = Math.floor(Math.random() * (crime.max - crime.min + 1)) + crime.min;
            store.addWallet(interaction.user.id, amount);
            await interaction.reply(`🦹 You committed **${crime.name}** and earned **$${amount}**!`);
        } else {
            jail[interaction.user.id] = now + JAIL_TIME;
            await interaction.reply(`🚨 You got caught committing **${crime.name}** and are in jail for 15 minutes!`);
        }
    }
};