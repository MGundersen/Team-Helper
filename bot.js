
/*
var Discord = require('discord.io'); 
var config = require('./config.json');
// Initialize Discord Bot
var bot = new Discord.Client({
    token: config.token,
    autorun: true
 });

// This is like an event
bot.on('ready', () => {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log( bot.username + ' - (' + bot.id + ')');
    }
);
*/
const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('I am ready!');
    console.log(`Connected as: ${bot.user.tag} (${bot.user.id}) on ${bot.guilds.size} servers`);
    // Sets a nice game msg for the bot
    bot.user.setGame(`${config.prefix}help | ${bot.guilds.size} servers`)
});

bot.on('message', message => {
    // Check whether we are being messaged by a bot, and whether it is a message for us!
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;
    // Get the arguments
    const arguments = message.content.slice(config.prefix.length).split(/ +/);
    // Get the actual command
    const command = arguments.shift().toLowerCase();
    // What do perform?
    if (command === 'ping')
    {
        const then = Date.now();
        message.channel.send('pong!').then( message => {
            message.edit(`Pong! It took ${Date.now() - then}ms to send that message!\nDiscord Heartbeat: ${bot.ping}ms`);
        });
    }
});

bot.login(config.token);