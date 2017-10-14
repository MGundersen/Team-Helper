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

// This is like an event
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
                // Callback function
                handleTournaments(args[1], function(result) {
                  bot.sendMessage({
                    to: channelID,
                    message: "Here you go, " + user + "!\n"
                  });

                  result.map(function(entry){
                    var newEntry = JSON.parse(JSON.stringify(entry));
                    var informationString =
                    "Tournament site: " + newEntry.tournament_name + " - " +
                    "Team size: " + newEntry.team_size + " - " +
                    "Weekday: " + newEntry.date_of_week + " - " +
                    "Time: " + newEntry.time + "\n";
                    bot.sendMessage({
                      to: channelID,
                      message: informationString
                    });
                  })
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

function handleTournaments(args, callback) {
  logger.info("handleTournaments args: " + args)
  switch (args) {
    case "all":
    MongoClient.connect(url, function(err, db) {
      if (err) {
        logger.error("Unable to connect to mongoDB client")
        throw err;
      }
      db.collection(tournament_collection)
        .find({})
        .toArray(function(err, result){
          if (err) {
            logger.error("Unable to make collection to array")
            throw err;
          }
          db.close();
          callback(result);
        })
    });
    break;
  }
}
/*
.forEach(function(result) {
  var resultInformation =
  "Tournament name: " + result.tournament_name + " - " +
  "Team size: " + result.team_size + " - " +
  "Weekday: " + result.date_of_week + " - " +
  "Time: " + result.time + "\n";
  returnInformation = returnInformation + resultInformation;
  //console.log("resultInformation: " + resultInformation)
  //console.log("returnInformation: " + returnInformation)
})
*/
