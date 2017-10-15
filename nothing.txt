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
    logger.info( bot.user + ' - (' + bot.id + ') on ' + bot.guilds.size);
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Checker whether it is a message for us!
    if (!message.startsWith(config.prefix)) return;
    // Get the arguments
    const arguments = message.slice(config.prefix.length).split(/ +/);
    // Get the actual command
    const command = arguments.shift().toLowerCase();
    // What do perform?
    switch(command) {
      case 'tournaments':
          // Callback function
          handleTournaments(arguments, function(result) {
            // IF @Result is an array of JSON objects. To extract them
            // you need to do something like this for each entry
            // entry = JSON.parse(JSON.stringify(entry));
            var informationMessage = "Here you go, " + user + "!\n";
            bot.sendMessage({
              to: channelID,
              message: informationMessage + result
            });
          }
        );
      break;
      case 'hello':
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
          bot.sendMessage({
              to: channelID,
              message: 'Pong!'
          });
      break;
      case 'help':
          bot.sendMessage({
              to: channelID,
              message: "All available commands are:\n" +
              "Ping - Simply responds you with pong!\n" +
              "op - Tells you, that you are OP!\n" +
              "help - Gets this menu\n" +
              "hello - Greets you back in the channel and in a private msg\n" +
              "tournaments 'request'- type '!tournaments' for more information about the different requests\n"
          });
      break;
      case 'op':
          bot.sendMessage({
              to: channelID,
              message: user + " is OP"
          });
      break;
      default:
      bot.sendMessage({
        to: channelID,
        message: "If you tried to type in a command, then it was invalid. Try !help for more info."
    });
   }
});

function handleTournaments(arguments, callback) {
  switch (arguments[1]) {
    case 'all':
      callback("You searched for all tournaments!")
      break;
    case 'today':
      callback("You searched for all available tournaments today!")
      break;
    case 'weekday':
      callback("You searched for tournaments on a specific weekday")
      break;
    case 'name':
      callback("You searched for a specific tournament site!")
      break;
    case 'teamsize':
      callback("You searched for tournaments with a specific team size!")
      break;
    default:
      callback(
        "The arguments you can give are as follows!\n" +
        "all - Shows all tournaments\n" +
        "today - Finds all tournaments that are available today\n" + 
        "weekday 'day' - Shows all tournaments on a specific day\n" + 
        "name 'name' - Shows all tournaments from a specific site/with specific name\n" +
        "teamsize 'size' - Shows all tournaments with a specific team size\n"
      )
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
*/
