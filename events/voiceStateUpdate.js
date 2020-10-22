servers = {}
setup = {
  name: 'MIni-Match',
  next: 'Next'
}
function addServer(guild) {
  if (servers.hasOwnProperty(guild.id)) return

  servers[guild.id] = {
    voice_channels: [],
    room_id: 0,
    room_size: 2,
    category_id: false
  }
}

function findNewChannel(guild, member, oldChannel, parent) {
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
  if (servers[guild.id].voice_channels.length > 0) {
    for (vc in servers[guild.id].voice_channels) {
      if (servers[guild.id].voice_channels[vc].members.size == 0) {
        member.voice.setChannel(servers[guild.id].voice_channels[vc])
        foundChannel = true
        break
      }
    }
  }
  if (!foundChannel) {
    guild.channels.create("Room " + servers[guild.id].room_id, {type: 'voice', parent: parent}).then(function(new_vc) {
      member.voice.setChannel(new_vc)//.then(function(member) {console.log(new_vc.members)})
      servers[guild.id].voice_channels.push(new_vc)
      servers[guild.id].room_id ++;
    })
  }
}

module.exports = (client, oldState, newState) => {
  if (oldState.channel && oldState.channel.name.toLowerCase() != setup.next.toLowerCase() && oldState.channel.parent.name.toLowerCase() == setup.name.toLowerCase()) {
    addServer(oldState.guild)
    if (oldState.channel.members.size == 0) {
      index = servers[oldState.guild.id].voice_channels.indexOf(oldState.channel);
      if (index > -1) {
        servers[oldState.guild.id].voice_channels.splice(index, 1);
      }
      oldState.channel.delete()
    }
  }
  if (newState.channel && newState.channel.name.toLowerCase() == setup.next.toLowerCase()) {
    addServer(newState.guild)
    if (!servers[newState.guild.id].category_id) servers[newState.guild.id].category_id = newState.channel.parent.id
    findNewChannel(newState.guild, newState.member, oldState.channel, newState.channel.parent)
  }
}
