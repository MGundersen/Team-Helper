const Discord = require('discord.io');  // Using the package discord.io
const logger = require('winston');      // Using the package winston
const config = require('./config.json');    // Using the file auth.json
const MongoClient = require('mongodb').MongoClient // Using the package for the mongodb
const url = "mongodb://localhost:27017/team-helper-tournament-info"; // Url for the db - The collection is called "tournaments"
const tournament_collection = "tournaments";

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client({
   token: config.token,
   autorun: true
});

// This is like an event
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', message => {
    // To prevent people from making a bot to spam this bot
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;
    // Get the arguments
    const arguments = message.content.slice(config.prefix.length).split(/ +/);
    // Gets the first argument and remove higher cased letters
    const command = arguments.shift().toLowerCase();
    logger.info("Arguments: " + arguments + "\ncommands: "+ command)
});
