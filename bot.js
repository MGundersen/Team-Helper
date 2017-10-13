var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    var filesystem = require('fs'); // If we need to perform changes to the filesystem
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case 'hello':
                bot.sendMessage({
                  to: channelID,
                  message: 'Hello ' + user + ' in the channel!'
                });
                bot.sendMessage({
                  to: userID,
                  message: 'Hello ' + usedID + ' in private chat!'
                });
            break;
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'All available commands are "!Pong" and "!op"'
                });
            break;
            case 'op':
                bot.sendMessage({
                    to: channelID,
                    message: user + ' is OP'
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});
