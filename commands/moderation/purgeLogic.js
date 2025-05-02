const { PermissionFlagsBits } = require('discord.js');

module.exports = async function(interaction) {
    const amount = interaction.options.getInteger('amount');
    if (amount < 1 || amount > 100) {
        return interaction.reply({ content: 'You must specify a number between 1 and 100.', ephemeral: true });
    }
    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true });
};