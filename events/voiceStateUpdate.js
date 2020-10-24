const addServer = require('../commands/addServer')

function findNewChannel(guild, member, oldChannel) {
  foundChannel = false
  for (vc in servers[guild.id].voice_channels) {
    if (servers[guild.id].voice_channels[vc].members.size < servers[guild.id].room_size) { //change this variable for bigger rooms
      if (servers[guild.id].voice_channels[vc] != oldChannel) {
        member.voice.setChannel(servers[guild.id].voice_channels[vc])
        foundChannel = true
        break
      }
    }
  }
  if (foundChannel) return
  if (servers[guild.id].voice_channels.size > 0) {
    for (vc in servers[guild.id].voice_channels) {
      if (servers[guild.id].voice_channels[vc].members.size == 0) {
        member.voice.setChannel(servers[guild.id].voice_channels[vc])
        foundChannel = true
        break
      }
    }
  }
  if (!foundChannel) {
    var promisses = servers[guild.id].categories.map(category => {
      if (!foundChannel && category.children.size < 50) foundChannel = true
      else return false
      guild.channels.create("Room " + servers[guild.id].room_id, {type: 'voice', parent: category, permissionOverwrites: [{id: guild.roles.everyone.id, deny: ['VIEW_CHANNEL', 'CONNECT']}]}).then(function(new_vc) {
        member.voice.setChannel(new_vc)
        servers[guild.id].voice_channels.push(new_vc)
        servers[guild.id].room_id ++;
        if (servers[guild.id].room_id >= Number.MAX_VALUE) servers[guild.id].room_id = 0;
      })
      return true
    })
    Promise.all(promisses).then(arrayOfResponses => {
      if (!foundChannel) {
        guild.channels.create(setup.name + " overfill", {type: 'category', permissionOverwrites: [{id: guild.roles.everyone.id, deny: ['VIEW_CHANNEL', 'CONNECT']}]}).then(function(new_category) {
          servers[guild.id].categories.push(new_category)
          guild.channels.create("Room " + servers[guild.id].room_id, {type: 'voice', parent: new_category, permissionOverwrites: [{id: guild.roles.everyone.id, deny: ['VIEW_CHANNEL', 'CONNECT']}]}).then(function(new_vc) {
            member.voice.setChannel(new_vc)
            servers[guild.id].voice_channels.push(new_vc)
            servers[guild.id].room_id ++;
            if (servers[guild.id].room_id >= Number.MAX_VALUE) servers[guild.id].room_id = 0;
          })
        })
      }
    })
  }
}

module.exports = (client, oldState, newState) => {
  addServer(oldState.guild)
  if (oldState.channel && oldState.channel.name.toLowerCase() != setup.next.toLowerCase() && oldState.channel.parent && oldState.channel.parent.name.toLowerCase().startsWith(setup.name.toLowerCase())) {
    if (oldState.channel.members.size == 0) {
      index = servers[oldState.guild.id].voice_channels.indexOf(oldState.channel);
      if (index > -1) {
        servers[oldState.guild.id].voice_channels.splice(index, 1);
      }
      parent = oldState.channel.parent
      if (parent.children.size == 1) {
        index = servers[oldState.guild.id].categories.indexOf(parent);
        if (index > -1) {
          servers[oldState.guild.id].categories.splice(index, 1);
        }
        parent.delete()
      }
      oldState.channel.delete()
    }
  }
  if (newState.channel && newState.channel.name.toLowerCase() == setup.next.toLowerCase() && newState.channel.parent && newState.channel.parent.name.toLowerCase() == setup.name.toLowerCase()) {
    if (servers[newState.guild.id].categories.length < 1) servers[newState.guild.id].categories.push(newState.channel.parent)
    findNewChannel(newState.guild, newState.member, oldState.channel)
  }
}
