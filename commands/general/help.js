
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const SECTIONS = [
    {
        id: 'general_help',
        label: 'General Commands',
        color: 0x00ff00,
        title: 'General Commands',
        fields: [
            { name: '/help', value: 'Shows this help menu.' },
            { name: '/ping', value: 'Replies with Pong and latency.' },
        ],
    },
    {
        id: 'moderation_help',
        label: 'Moderation Commands',
        color: 0xff0000,
        title: 'Moderation Commands',
        fields: [
            { name: '/kick', value: 'Remove a user from the server.' },
            { name: '/ban', value: 'Permanently ban a user.' },
            { name: '/unban', value: 'Unban someone by username or ID.' },
            { name: '/mute', value: 'Mute a user (temporarily or permanently).' },
            { name: '/unmute', value: 'Remove mute from a user.' },
            { name: '/warn', value: 'Issue a warning to a user.' },
            { name: '/warnings', value: 'View warnings of a user.' },
            { name: '/clearwarns', value: 'Clear all warnings of a user.' },
            { name: '/purge', value: 'Delete a number of recent messages in a channel.' },
            { name: '/slowmode', value: 'Set or remove slowmode in a channel.' },
            { name: '/lock', value: 'Lock a channel for regular users.' },
            { name: '/unlock', value: 'Unlock a locked channel.' },
            { name: '/tempban', value: 'Ban a user for a specific time.' },
            { name: '/tempmute', value: 'Mute a user for a specific time.' },
            { name: '/timeout', value: 'Use Discord\'s built-in timeout feature.' },
        ],
    },
    {
        id: 'utility_help',
        label: 'Utility & Logging',
        color: 0x7289da,
        title: 'Utility & Logging',
        fields: [
            { name: '/modlog', value: 'Show recent moderation actions.' },
            { name: '/report', value: 'Let users report others to mods.' },
            { name: '/note', value: 'Add internal notes on a user (only visible to mods).' },
            { name: '/userinfo', value: 'Show user’s join date, roles, warnings, etc.' },
        ],
    },
    {
        id: 'fun_help',
        label: 'Fun Commands',
        color: 0xffff00,
        title: 'Fun Commands',
        fields: [
            { name: '/joke', value: 'Tells you a random joke.' },
            { name: '/roll', value: 'Rolls a random number.' },
        ],
    },
    {
        id: 'music_help',
        label: 'Music Commands',
        color: 0x1db954,
        title: 'Music Commands',
        fields: [
            { name: '/autoleave', value: 'Automatically leaves the voice channel when no users are left.' },
            { name: '/autopause', value: 'Automatically pauses playback when no users are listening.' },
            { name: '/autoqueue', value: 'Automatically adds recommended or related tracks to the queue when the current queue is empty.' },
            { name: '/loop', value: 'Loops the current track or the entire queue.' },
            { name: '/move', value: 'Moves the bot to another specified voice channel.' },
            { name: '/play', value: 'Plays a song from a given URL or search query.' },
            { name: '/stop', value: 'Stops the current playback and clears the queue.' },
            { name: '/leave', value: 'Disconnects the bot from the voice channel.' },
            { name: '/join', value: 'Joins a specified voice channel.' },
        ],
    },
    {
        id: 'economy_help',
        label: 'Economy Commands',
        color: 0x00bfff,
        title: 'Economy Commands',
        fields: [
            { name: '/balance', value: 'Shows your current wallet and bank balance.' },
            { name: '/daily', value: 'Claim a daily reward.' },
            { name: '/work', value: 'Earn random money by “working”.' },
            { name: '/beg', value: 'Try your luck begging for coins.' },
            { name: '/deposit [amount]', value: 'Deposit money into the bank.' },
            { name: '/withdraw [amount]', value: 'Withdraw money from the bank.' },
            { name: '/store', value: 'View all items in the store.' },
            { name: '/additem [name] [price]', value: 'Add an item to the store (owner only).' },
            { name: '/removeitem [name]', value: 'Remove an item from the store (owner only).' },
            { name: '/buy [item]', value: 'Purchase an item from the shop.' },
            { name: '/sell [item]', value: 'Sell an item from your inventory.' },
            { name: '/inventory', value: 'See what items you own.' },
            { name: '/inv', value: 'Alias for /inventory.' },
            { name: '/use [item]', value: 'Use a special item (like a lootbox or booster).' },
            { name: '/gamble [amount]', value: 'Risk your coins in a coinflip.' },
            { name: '/slots [amount]', value: 'Slot machine style game.' },
            { name: '/rob [user]', value: 'Attempt to rob another user (with cooldown and risk).' },
            { name: '/crime', value: 'Try committing a crime for rewards or jail time.' },
            { name: '/leaderboard', value: 'Show the top richest users.' },
            { name: '/networth', value: 'Total value of money + inventory.' },
            { name: '/stats', value: 'Show your own economic progress.' },
            { name: '/invest [amount]', value: 'Simulate stocks or crypto investments.' },
            { name: '/pay [user] [amount]', value: 'Send money to another user.' },
            { name: '/loan [amount]', value: 'Borrow money (with interest).' },
            { name: '/heist', value: 'Group robbery event.' },
            { name: '/trade [user]', value: 'Trade items with another user.' },
        ],
    },
];

// Helper to chunk an array into arrays of max size n
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

function buildButtons(disabled = false) {
    // Create all buttons first
    const buttons = SECTIONS.map(section =>
        new ButtonBuilder()
            .setCustomId(section.id)
            .setLabel(section.label)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabled)
    );
    // Chunk into rows of 5
    return chunkArray(buttons, 5).map(
        btnRow => new ActionRowBuilder().addComponents(...btnRow)
    );
}

// Updated: Returns an array of embeds if fields > 25
function buildSectionEmbed(section) {
    const fieldChunks = chunkArray(section.fields, 25);
    return fieldChunks.map((fieldsChunk, idx) =>
        new EmbedBuilder()
            .setColor(section.color)
            .setTitle(section.title + (fieldChunks.length > 1 ? ` (Page ${idx + 1})` : ''))
            .addFields(fieldsChunk)
    );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of available commands with interactive sections'),
    async execute(interaction) {
        // Main help embed
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Help Menu')
            .setDescription('Use the buttons below to navigate different sections of the help menu.')
            .addFields({ name: 'Sections:', value: SECTIONS.map(s => `- ${s.label.replace(' Commands', '')}`).join('\n') });

        // Send initial help message
        await interaction.reply({
            embeds: [helpEmbed],
            components: buildButtons(),
            ephemeral: false, // Set to true if you want only the user to see the help
        });

        // Collector for button interactions (only from the command user)
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async buttonInteraction => {
            const section = SECTIONS.find(s => s.id === buttonInteraction.customId);
            if (section) {
                const embeds = buildSectionEmbed(section);
                await buttonInteraction.update({
                    embeds: embeds,
                    components: buildButtons(),
                });
            } else {
                await buttonInteraction.reply({ content: 'Unknown section.', ephemeral: true });
            }
        });

        collector.on('end', async () => {
            // Disable buttons after timeout
            try {
                await interaction.editReply({
                    components: buildButtons(true),
                });
            } catch (err) {
                // Message may have been deleted or already edited
            }
        });
    },
};
