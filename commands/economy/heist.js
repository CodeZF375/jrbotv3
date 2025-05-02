const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

let heistActive = false;
let participants = [];
let heistTimeout = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('heist')
        .setDescription('Join a group robbery event!'),
    async execute(interaction) {
        if (!heistActive) {
            heistActive = true;
            participants = [interaction.user.id];
            await interaction.reply('💣 A heist is starting! Type `/heist` in the next 30 seconds to join!');
            heistTimeout = setTimeout(async () => {
                if (participants.length < 2) {
                    await interaction.followUp('❌ Not enough participants. The heist was cancelled.');
                } else {
                    // 50% chance of success
                    const success = Math.random() < 0.5;
                    if (success) {
                        const loot = Math.floor(Math.random() * 2000) + 1000;
                        const share = Math.floor(loot / participants.length);
                        participants.forEach(uid => store.addWallet(uid, share));
                        await interaction.followUp(`🎉 The heist succeeded! Each participant gets $${share}.`);
                    } else {
                        participants.forEach(uid => store.addWallet(uid, -200));
                        await interaction.followUp('🚨 The heist failed! Each participant lost $200.');
                    }
                }
                heistActive = false;
                participants = [];
                heistTimeout = null;
            }, 30000);
        } else {
            if (participants.includes(interaction.user.id)) {
                return interaction.reply({ content: '❗ You have already joined the heist.', ephemeral: true });
            }
            participants.push(interaction.user.id);
            await interaction.reply('✅ You joined the heist!');
        }
    }
};