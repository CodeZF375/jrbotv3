
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Replies with Pong and detailed latency stats!',
    },
    async execute(interaction, client) {
        // Send initial reply and fetch the message for latency calculation
        const sent = await interaction.reply({ content: '🏓 Calculating ping...', fetchReply: true });

        // Calculate latencies
        const messageLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = typeof client.ws.ping === 'number' ? Math.round(client.ws.ping) : 'N/A';

        // Build a stylish embed
        const embed = new EmbedBuilder()
            .setColor(0x00FFB3)
            .setTitle('🏓 Pong!')
            .setDescription('Here are the current latency stats:')
            .addFields(
                { name: 'Message Latency', value: `\`${messageLatency}ms\``, inline: true },
                { name: 'API Latency', value: `\`${apiLatency}ms\``, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Edit the reply to show the embed
        await interaction.editReply({ content: null, embeds: [embed] });
    },
};
