const addServer = require('../commands/addServer')

function findNewChannel(guild, member, oldChannel, servername) {
  foundChannel = false
  for (vc in servers[servername].voice_channels) {
    if (servers[servername].voice_channels[vc].members.size < servers[servername].room_size) { //change this variable for bigger rooms
      if (servers[servername].voice_channels[vc] != oldChannel) {
        member.voice.setChannel(servers[servername].voice_channels[vc])
        foundChannel = true
        break
      }
    }
  }
  if (foundChannel) return
  if (servers[servername].voice_channels.size > 0) {
    for (vc in servers[servername].voice_channels) {
      if (servers[servername].voice_channels[vc].members.size == 0) {
        member.voice.setChannel(servers[servername].voice_channels[vc])
        foundChannel = true
        break
      }
    }
  }
  if (!foundChannel) {
    var promisses = servers[servername].categories.map(category => {
      if (!foundChannel && category.children.size < 50) foundChannel = true
      else return false
      guild.channels.create("Room " + servers[servername].room_id, {type: 'voice', parent: category, permissionOverwrites: [{id: guild.roles.everyone.id, deny: ['VIEW_CHANNEL', 'CONNECT']}]}).then(function(new_vc) {
        member.voice.setChannel(new_vc)
        servers[servername].voice_channels.push(new_vc)
        servers[servername].room_id ++;
        if (servers[servername].room_id >= Number.MAX_VALUE) servers[servername].room_id = 0;
      })
      return true
    })
    Promise.all(promisses).then(arrayOfResponses => {
      if (!foundChannel) {
        guild.channels.create(servers[servername].categories[0].name, {type: 'category', permissionOverwrites: [{id: guild.roles.everyone.id, deny: ['VIEW_CHANNEL', 'CONNECT']}]}).then(function(new_category) {
          servers[servername].categories.push(new_category)
          guild.channels.create("Room " + servers[servername].room_id, {type: 'voice', parent: new_category, permissionOverwrites: [{id: guild.roles.everyone.id, deny: ['VIEW_CHANNEL', 'CONNECT']}]}).then(function(new_vc) {
            member.voice.setChannel(new_vc)
            servers[servername].voice_channels.push(new_vc)
            servers[servername].room_id ++;
            if (servers[servername].room_id >= Number.MAX_VALUE) servers[servername].room_id = 0;
          })
        })
      }
    })
  }
}

module.exports = (client, oldState, newState) => {
  if (oldState.channel && oldState.channel.name.toLowerCase() != setup.next.toLowerCase() && oldState.channel.parent && (oldState.channel.parent.name.toLowerCase() == setup.name.toLowerCase() || oldState.channel.parent.name.toLowerCase().startsWith(setup.name.toLowerCase()+" "))) {
    servername = (oldState.guild+" "+oldState.channel.parent.name.slice(setup.name.length+1)).trimRight()
    addServer(servername)
    if (oldState.channel.members.size == 0) {
      index = servers[servername].voice_channels.indexOf(oldState.channel);
      if (index > -1) {
        servers[servername].voice_channels.splice(index, 1);
      }
      parent = oldState.channel.parent
      if (parent.children.size == 1) {
        index = servers[servername].categories.indexOf(parent);
        if (index > -1) {
          servers[servername].categories.splice(index, 1);
        }
        parent.delete()
      } 
      oldState.channel.delete()
    }
  }
  if (newState.channel && newState.channel.name.toLowerCase() == setup.next.toLowerCase() && newState.channel.parent && (newState.channel.parent.name.toLowerCase() == setup.name.toLowerCase() || newState.channel.parent.name.toLowerCase().startsWith(setup.name.toLowerCase()+" "))) {
    servername = (oldState.guild+" "+newState.channel.parent.name.slice(setup.name.length+1)).trimRight()
    addServer(servername)
    if (servers[servername].categories.length < 1) servers[servername].categories.push(newState.channel.parent)
    findNewChannel(newState.guild, newState.member, oldState.channel, servername)
  }
}
