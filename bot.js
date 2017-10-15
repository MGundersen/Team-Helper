
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
    bot.user.setActivity(`${config.prefix}help | ${bot.guilds.size} servers`)
});

bot.on('message', message => {
    // Check whether we are being messaged by a bot, and whether it is a message for us!
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;
    // Get the arguments
    const arguments = message.content.slice(config.prefix.length).split(/ +/);
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
                var informationMessage = "Here you go, " + message.author.tag + "!\n";
                message.channel.send( informationMessage + result );
            });
            break;
        case 'hello':
            message.channel.send('Hello ' + message.author.tag + ' in the channel!');
            message.author.send('Hello ' + message.author.tag + ' in private chat!');
            break;
        case 'ping':
            const then = Date.now();
            message.channel.send('pong!').then( message => {
                message.edit(`Pong! It took ${Date.now() - then}ms to send that message!\nDiscord Heartbeat: ${bot.ping}ms`);
            });
            break;
        case 'help':
            message.channel.send(
                "All available commands are:\n" +
                "Ping - Simply responds you with pong!\n" +
                "op - Tells you, that you are OP!\n" +
                "help - Gets this menu\n" +
                "hello - Greets you back in the channel and in a private msg\n" +
                "tournaments 'request'- type '!tournaments' for more information about the different requests\n"
            );
            break;
        case 'op':
            message.channel.send(message.author.tag + " is OP");
            break;
        case 'kick':
            if (!message.member.permissions.has('ADMINISTRATOR'))
            {
                message.reply("You are not an admin!!");
            }
            const memberToKick = message.mentions.members.first();
            if (!memberToKick)
            {
                return message.reply(`Invalid usage, please do '${config.prefix}kick @user1234'` )
            }
            message.channel.search( memberToKick + ' has been kicked.' );
            memberToKick.kick(`Kicked by ${message.author.tag}`);
            break;
        case 'ban':
            if (!message.member.permissions.has('ADMINISTRATOR'))
            {
                message.reply("You are not an admin!!");
            }
            const memberToBan = message.mentions.members.first();
            if (!memberToBan)
            {
                return message.reply(`Invalid usage, please do '${config.prefix}ban @user1234 time'` )
            }
            message.channel.search( memberToBan + ' has been banned.' );
            memberToBan.ban({
                days: args[1] || null,
                reason: `Banned by ${message.author}`
            });
            break;
        default:
            message.channel.send("If you tried to type in a command, then it was invalid. Try !help for more info.");
    }
});

bot.on('guildCreate', console.log)

bot.on('guildDelete', console.log)

bot.login(config.token);

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