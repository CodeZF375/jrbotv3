
const { SlashCommandBuilder } = require('discord.js');
const { getUser } = require('../../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Shows your current wallet and bank balance.'),
    async execute(interaction) {
        const user = getUser(interaction.user.id);
        await interaction.reply(
            `💰 **Wallet:** $${user.wallet}\n🏦 **Bank:** $${user.bank}`
        );
    }
};
