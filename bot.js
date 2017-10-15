
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
const default_channel_name = '368407831424139264';  // test-channel
const default_guild_name = '345260892989947916';    // FrogGaming

bot.on('ready', () => {
    console.log('I am ready!');
    console.log(`Connected as: ${bot.user.tag} (${bot.user.id}) on ${bot.guilds.size} servers`);
    // Sets a nice game msg for the bot
    bot.user.setActivity(`${config.prefix}help | ${bot.guilds.size} servers`)
});

// Async? (Allowed me to use await in the ban case to catch errors)
bot.on('message', async message => {
    // Check whether we are being messaged by a bot, and whether it is a message for us!
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;
    // Get the arguments
    const arguments = message.content.slice(config.prefix.length).split(/ +/);
    // Get the actual command
    const command = arguments.shift().toLowerCase();
    // What do perform?
    console.log( "Arguments: " + arguments );
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
        case 'op':
            message.channel.send(message.author.tag + " is OP");
            break;
        case 'kick':
            // Does the user have permission?
            if (!message.member.permissions.has('ADMINISTRATOR'))
            {
                return message.reply("Sorry, you don't have permissions to use this!");
            }
            // Is the member valid?
            const memberToKick = message.mentions.members.first();
            if (!memberToKick)
            {
                return message.reply("Please mention a valid member of this server");
            }
            // Is the member kickable?
            if(!member.kickable)
            {
                return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
            }
            // kick reason - removes the first index, and then joins the rest with spaces in between.
            // It is done because a kick message looks like '!kick user1234 reason for this ban', therefore we remove user1234 and concat the rest together
            let kickReason = args.slice(1).join(' ');
            if(!kickReason)
            {
                return message.reply("Please indicate a reason for the kick!");
            }
            // Kick the member
            await member.kick(kickReason).catch(function(error)
            {
                message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`)
            }
            );
            message.reply(`${memberToKick.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
            break;
        case 'ban':
            // Does the user has the rights to ban members?
            if (!message.member.permissions.has('ADMINISTRATOR'))
            {
                message.reply("You are not an admin!!");
            }
            // Is the mention a valid member?
            const memberToBan = message.mentions.members.first();
            if(!memberToBan)
            {
                return message.reply("Please mention a valid member of this server");
            }
            // Is the member even bannable?
            if(!memberToBan.bannable)
            {
                return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
            }
            // Ban reason - removes the first index, and then joins the rest with spaces in between.
            // It is done because a ban message looks like '!ban user1234 reason for this ban', therefore we remove user1234 and concat the rest together
            const banReason = arguments.slice(1).join(' ');
            if(!banReason)
            {
                return message.reply("Please indicate a reason for the ban!");
            }
            // Ban the user
            await memberToBan.ban(banReason).catch( function(error) {
                message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`);
            });
            message.reply(`${memberToBan.user.tag} has been banned by ${message.author.tag} because: ${banReason}`);

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
    }
});

bot.on('guildCreate', console.log);

bot.on('guildDelete', console.log);

// Welcome message for new users
bot.on('guildMemberAdd', function(guildMember) {
    console.log( 'Member was added.' );
    // Check if our default guild is correct
    if (bot.guilds.has(default_guild_name))
    {
        // Get the default guild
        const guild = bot.guilds.get(default_guild_name);
        // Check if the default channel exists
        if (guild.channels.has(default_channel_name))
        {
            // Get the default channel
            const channel = bot.channels.get(default_channel_name)
            // Send a notification to it!
            channel.send( `Welcome to this discord, <@${guildMember.user.id}>!\nType '!help' to see what I can do for you. Until then, enjoy your stay!` );
            return;
        }
        else
        {
            // If we end up here, then we were unable to find channel
            console.log( "emojiDelete: Was unable to find channel" );
        }
    }
    else
    {
        // If we end up here, then we were unable to find guild
        console.log( "emojiDelete: Was unable to find guild" );
    }
});

// Sends a message to default channel when a member has been removed from the guild
bot.on('guildMemberRemove', function(guildMember) {
    console.log( 'Member was removed.' );
    // Check if our default guild is correct
    if (bot.guilds.has(default_guild_name))
    {
        // Get the default guild
        const guild = bot.guilds.get(default_guild_name);
        // Check if the default channel exists
        if (guild.channels.has(default_channel_name))
        {
            // Get the default channel
            const channel = bot.channels.get(default_channel_name)
            // Send a notification to it!
            channel.send( `<@${guildMember.user.id}> was removed from this discord.` );
            return;
        }
        else
        {
            // If we end up here, then we were unable to find channel
            console.log( "emojiDelete: Was unable to find channel" );
        }
    }
    else
    {
        // If we end up here, then we were unable to find guild
        console.log( "emojiDelete: Was unable to find guild" );
    }
});

// Sends a message to the default channel about emojo creation
bot.on('emojiCreate', function(event) {
    console.log( 'Emoni was created.' );
    // Check if our default guild is correct
    if (bot.guilds.has(default_guild_name))
    {
        // Get the default guild
        const guild = bot.guilds.get(default_guild_name);
        // Check if the default channel exists
        if (guild.channels.has(default_channel_name))
        {
            // Get the default channel
            const channel = bot.channels.get(default_channel_name)
            // Send a notification to it!
            channel.send( `A new emoji has been added <:${event.identifier}>(:${event.name}:).` );
            return;
        }
        else
        {
            // If we end up here, then we were unable to find channel
            console.log( "emojiDelete: Was unable to find channel" );
        }
    }
    else
    {
        // If we end up here, then we were unable to find guild
        console.log( "emojiDelete: Was unable to find guild" );
    }
});

// Sends a message to the default channel about emojo update
bot.on('emojiUpdate', function(oldEvent, newEvent) {
    if (oldEvent.name == newEvent.name) return;
    console.log( 'Emoji was updated.' );
    // Check if our default guild is correct
    if (bot.guilds.has(default_guild_name))
    {
        // Get the default guild
        const guild = bot.guilds.get(default_guild_name);
        // Check if the default channel exists
        if (guild.channels.has(default_channel_name))
        {
            // Get the default channel
            const channel = bot.channels.get(default_channel_name)
            // Send a notification to it!
            channel.send( `Use <:${newEvent.identifier}> now by typing :${newEvent.name}:` );
            return;
        }
        else
        {
            // If we end up here, then we were unable to find channel
            console.log( "emojiDelete: Was unable to find channel" );
        }
    }
    else
    {
        // If we end up here, then we were unable to find guild
        console.log( "emojiDelete: Was unable to find guild" );
    }
});

// Sends a message to the default channel about emojo deletion
bot.on('emojiDelete', function(event) {
    console.log('Emoji was deleted.');
    if (bot.guilds.has(default_guild_name))
    {
        // Get the default guild
        const guild = bot.guilds.get(default_guild_name);
        // Check if the default channel exists
        if (guild.channels.has(default_channel_name))
        {
            // Get the default channel
            const channel = bot.channels.get(default_channel_name)
            // Send a notification to it!
            channel.send( `The ${event.name} emoji has been deleted.` );
            return;
        }
        else
        {
            // If we end up here, then we were unable to find channel
            console.log( "emojiDelete: Was unable to find channel" );
        }
    }
    else
    {
        // If we end up here, then we were unable to find guild
        console.log( "emojiDelete: Was unable to find guild" );
    }
});

bot.login(config.token);

function handleTournaments(arguments, callback) {
    // Convert it to lowercase
    if (arguments[0] != null)
    {
        arguments[0] = arguments[0].toLowerCase();
    }
    // What to do?
    switch (arguments[0]) {
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