const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user by username#discrim or ID.')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('User ID or username#discrim')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const userInput = interaction.options.getString('user');
        const bans = await interaction.guild.bans.fetch();
        let userBan = bans.find(ban =>
            ban.user.id === userInput ||
            `${ban.user.username}#${ban.user.discriminator}` === userInput
        );
        if (!userBan) {
            return interaction.reply({ content: 'User not found in ban list.', ephemeral: true });
        }
        await interaction.guild.members.unban(userBan.user.id);
        await interaction.reply({ content: `Unbanned ${userBan.user.tag}` });
    },
};