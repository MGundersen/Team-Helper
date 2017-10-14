var Discord = require('discord.io');  // Using the package discord.io
var logger = require('winston');      // Using the package winston
var auth = require('./auth.json');    // Using the file auth.json
var MongoClient = require('mongodb').MongoClient // Using the package for the mongodb
var url = "mongodb://localhost:27017/team-helper-tournament-info"; // Url for the db - The collection is called "tournaments"
var tournament_collection = "tournaments";

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

// This is like an event, so when the bot is turned on these 2 functions are run
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
        console.log(args)

        switch(cmd) {
            case 'tournaments':
                logger.info('Found event tournaments')
                handleTournaments(args[1], function(result) {
                  bot.sendMessage({
                    to: channelID,
                    message: 'Current tournament info!:\n' + result
                  });
                }
              );
            break;
            case 'hello':
                logger.info('Found event hello')
                bot.sendMessage({
                  to: channelID,
                  message: 'Hello ' + user + ' in the channel!'
                });
                bot.sendMessage({
                  to: userID,
                  message: 'Hello ' + user + ' in private chat!'
                });
            break;
            // !ping
            case 'ping':
                logger.info('Found event ping')
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'help':
                logger.info('Found event help')
                bot.sendMessage({
                    to: channelID,
                    message: "All available commands are:\n" +
                    "Ping \t- Simply responds you with pong!\n" +
                    "op \t- Tells you, that you are OP!\n" +
                    "help \t- Gets this menu\n" +
                    "hello \t- Greets you back in the channel and in a private msg\n" +
                    "tournaments \t- Responds with a list of all tournaments - type '!tournaments help' for more information\n"
                });
            break;
            case 'op':
                bot.sendMessage({
                    to: channelID,
                    message: "@" + user + " is OP"
                });
            break;
         }
     }
});

function handleTournaments(todo, callback) {
  logger.info("handleTournaments: " + todo)
  switch (todo) {
    default:
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection(tournament_collection).find({}).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        logger.info(result)
        callback(result);
      })
    });
    break;
  }
}
