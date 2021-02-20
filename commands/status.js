const Discord = require('discord.js')
module.exports = (client, channel, specifics, send) => {
  servernames = Object.keys(servers).filter(function(item, index) {
    if (specifics && !item.includes(split_msg[1])) return false
    return item.startsWith(String(channel.guild.id));
  })
  if (servernames.length == 0) {
    if (send) {channel.send("No one is playing " + setup.name + " right now. No one is alone in a room.")}
    servers[servername].status = playerString + " " + roomString
    servers[servername].embed.edit(new Discord.MessageEmbed()
      .setTitle('Players playing '+ setup.name + ':')
      .setDescription(servers[servername].status)
      .setTimestamp())
  }
  else {
    servernames.forEach((servername) => {
      countPlayers = 0
      countSingleRooms = 0
      if (servers[servername].categories.length > 0) {
        servers[servername].categories.forEach((category) => {
          category.children.forEach((channel, i) => {
            if (channel.type == 'voice') {
              countPlayers += channel.members.size
              if (channel.members.size == 1) {
                countSingleRooms += 1
              }
            }
          });
        })
        playerString = countPlayers > 1 ? countPlayers + " players are playing " + setup.name + servername.slice(String(channel.guild.id).length) + " right now." : "1 player is playing " + setup.name + servername.slice(String(channel.guild.id).length) + " right now."
        roomString = countSingleRooms > 1 ? countSingleRooms + " players are alone in a room." : "1 player is alone in a room."
      }
      if (countPlayers == 0) {
        playerString = "No one is playing " + setup.name + servername.slice(String(channel.guild.id).length) + " right now."
      }
      if (countSingleRooms == 0) {
        roomString = "No one is alone in a room."
      }
      if (send) {channel.send(playerString + " " + roomString)}
      servers[servername].status = playerString + " " + roomString
      if (!servers[servername].embed) return
      servers[servername].embed.then(function(embed) {
        embed.edit(new Discord.MessageEmbed()
          .setTitle('Players playing '+ setup.name + ':')
          .setDescription(servers[servername].status)
          .setTimestamp())
        })
    })
  }
}
