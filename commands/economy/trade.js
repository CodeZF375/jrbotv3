const { SlashCommandBuilder } = require('discord.js');
const inventory = require('../../utils/inventory');

const trades = {}; // { userId: { partnerId, itemsOffered: [] } }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trade')
        .setDescription('Trade items with another user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to trade with')
                .setRequired(true)
        ),
    async execute(interaction) {
        const partner = interaction.options.getUser('user');
        if (partner.id === interaction.user.id) return interaction.reply('❌ You cannot trade with yourself.');
        // For demo: just start a trade session
        trades[interaction.user.id] = { partnerId: partner.id, itemsOffered: [] };
        trades[partner.id] = { partnerId: interaction.user.id, itemsOffered: [] };
        await interaction.reply(`🔄 Trade session started with **${partner.tag}**! (Trading logic to be implemented)`);
    },
    trades // Export for further expansion
};