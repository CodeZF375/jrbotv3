
/**
 * Script to register (deploy) all slash commands in the 'commands' directory with Discord.
 * Run this script manually whenever you add, remove, or update slash commands.
 * 
 * Usage: node deploy-commands.js
 */

require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

async function loadCommands() {
    let commandFiles;
    try {
        commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith('.js'));
    } catch (err) {
        console.error('[ERROR] Failed to read commands directory:', err);
        process.exit(1);
    }

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        try {
            const command = require(filePath);
            if (command?.data?.toJSON) {
                commands.push(command.data.toJSON());
            } else {
                console.warn(`[WARN] Skipping invalid command file: ${file}`);
            }
        } catch (err) {
            console.error(`[ERROR] Failed to load command ${file}:`, err);
        }
    }
}

async function registerCommands() {
    const { CLIENT_ID, GUILD_ID, TOKEN } = process.env;
    if (!CLIENT_ID || !GUILD_ID || !TOKEN) {
        console.error('[ERROR] Missing CLIENT_ID, GUILD_ID, or TOKEN in .env');
        process.exit(1);
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        console.log(`[INFO] Registering ${commands.length} slash commands to guild ${GUILD_ID}...`);
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('[SUCCESS] Slash commands registered successfully.');
    } catch (error) {
        console.error('[ERROR] Failed to register slash commands:', error);
    }
}

(async () => {
    await loadCommands();
    await registerCommands();
})();
