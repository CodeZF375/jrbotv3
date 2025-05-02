
require('dotenv').config();

const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.commands = new Collection();

async function loadCommands(dirPath = path.join(__dirname, 'commands')) {
    let entries;
    try {
        entries = await fs.readdir(dirPath, { withFileTypes: true });
    } catch (err) {
        console.error('[ERROR] Failed to read commands directory:', err);
        process.exit(1);
    }

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            await loadCommands(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            try {
                const command = require(fullPath);
                if (command?.data?.name && typeof command.execute === 'function') {
                    client.commands.set(command.data.name, command);
                    console.log(`[INFO] Loaded command: ${command.data.name}`);
                } else {
                    console.warn(`[WARN] Skipping invalid command file: ${fullPath}`);
                }
            } catch (err) {
                console.error(`[ERROR] Failed to load command ${fullPath}:`, err);
            }
        }
    }
}

async function registerSlashCommands() {
    const commands = [];
    for (const command of client.commands.values()) {
        if (command.data) {
            if (typeof command.data.toJSON === 'function') {
                commands.push(command.data.toJSON());
            } else {
                commands.push(command.data);
            }
        }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        if (!process.env.CLIENT_ID || !process.env.GUILD_ID) {
            console.warn('[WARN] CLIENT_ID or GUILD_ID not set in .env, skipping slash command registration.');
            return;
        }
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ [SLASH] Slash commands registered!');
    } catch (error) {
        console.error('[ERROR] Failed to register slash commands:', error);
    }
}

client.once('ready', () => {
    console.log(`✅ [READY] Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        // Removed player argument from execute
        await command.execute(interaction);
    } catch (error) {
        console.error(`[ERROR] Command "${interaction.commandName}" failed:`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ There was an error while executing this command!', ephemeral: true });
        }
    }
});

(async () => {
    await loadCommands();
    await registerSlashCommands();
    client.login(process.env.TOKEN)
        .then(() => console.log('[INFO] Bot login successful.'))
        .catch(err => {
            console.error('[ERROR] Bot login failed:', err);
            process.exit(1);
        });
})();
