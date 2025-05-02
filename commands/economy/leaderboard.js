const { SlashCommandBuilder } = require('discord.js');
const store = require('../../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the top richest users.'),
    async execute(interaction) {
        // Get all users from the in-memory store
        const allUsers = Object.entries(store.getAll ? store.getAll() : {});
        if (allUsers.length === 0) {
            return interaction.reply('No users found in the economy.');
        }
        // Sort by wallet + bank, descending
        const sorted = allUsers
            .map(([userId, data]) => ({
                userId,
                total: (data.wallet || 0) + (data.bank || 0)
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        // Fetch usernames (if possible)
        const leaderboard = await Promise.all(sorted.map(async (entry, i) => {
            let userTag = `User ID: ${entry.userId}`;
            try {
                const user = await interaction.client.users.fetch(entry.userId);
                userTag = user.tag;
            } catch {}
            return `**${i + 1}. ${userTag}** — $${entry.total}`;
        }));

        await interaction.reply(`🏆 **Leaderboard:**\n${leaderboard.join('\n')}`);
    }
};