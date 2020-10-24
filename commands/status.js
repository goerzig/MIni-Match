module.exports = (client, message) => {
  countPlayers = 0
  countSingleRooms = 0
  if (servers[message.guild.id].category_ids.length > 0) {
    servers[message.guild.id].category_ids.forEach((category_id) => {
      message.guild.channels.cache.get(category_id).children.forEach((channel, i) => {
        if (channel.type == 'voice') {
          countPlayers += channel.members.size
          if (channel.members.size == 1) {
            countSingleRooms += 1
          }
        }
      });
    }) 
    playerString = countPlayers > 1 ? countPlayers + " players are playing " + setup.name + " right now." : "1 player is playing " + setup.name + " right now."
    roomString = countSingleRooms > 1 ? countSingleRooms + " players are alone in a room." : "1 player is alone in a room."
  }
  if (countPlayers == 0) {
    playerString = "no one is playing " + setup.name + " right now."
  }
  if (countSingleRooms == 0) {
    roomString = "No one is alone in a room."
  }
  message.reply(playerString + " " + roomString)
}
