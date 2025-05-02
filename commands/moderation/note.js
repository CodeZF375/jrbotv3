const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const notesPath = path.join(__dirname, '../data/notes.json');

function getNotes() {
    if (!fs.existsSync(notesPath)) return {};
    return JSON.parse(fs.readFileSync(notesPath, 'utf8'));
}
function saveNotes(data) {
    fs.writeFileSync(notesPath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('note')
        .setDescription('Add an internal note on a user (mods only).')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to note')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('note')
                .setDescription('Note content')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const note = interaction.options.getString('note');
        const notes = getNotes();
        if (!notes[target.id]) notes[target.id] = [];
        notes[target.id].push({
            moderator: interaction.user.id,
            note,
            date: new Date().toISOString()
        });
        saveNotes(notes);
        await interaction.reply({ content: `Note added for ${target.tag}.`, ephemeral: true });
    },
};