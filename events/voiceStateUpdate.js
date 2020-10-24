const addServer = require('../commands/addServer')

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
    //channels.get(category_id)
    guild.channels.create("Room " + servers[guild.id].room_id, {type: 'voice', parent: parent}).then(function(new_vc) {
      member.voice.setChannel(new_vc)//.then(function(member) {console.log(new_vc.members)})
      servers[guild.id].voice_channels.push(new_vc)
      servers[guild.id].room_id ++;
      if (servers[guild.id].room_id >= Number.MAX_VALUE) servers[guild.id].room_id = 0;
    })
  }
}

module.exports = (client, oldState, newState) => {
  addServer(oldState.guild)
  if (oldState.channel && oldState.channel.name.toLowerCase() != setup.next.toLowerCase() && oldState.channel.parent.name.toLowerCase().startsWith(setup.name.toLowerCase())) {
    if (oldState.channel.members.size == 0) {
      index = servers[oldState.guild.id].voice_channels.indexOf(oldState.channel);
      if (index > -1) {
        servers[oldState.guild.id].voice_channels.splice(index, 1);
      }
      oldState.channel.delete()
    }
  }
  if (newState.channel && newState.channel.name.toLowerCase() == setup.next.toLowerCase() && newState.channel.parent.name.toLowerCase() == setup.name.toLowerCase()) {
    if (servers[newState.guild.id].category_ids.length < 1) servers[newState.guild.id].category_ids.push(newState.channel.parent.id)
    console.log(servers[newState.guild.id].category_ids)
    findNewChannel(newState.guild, newState.member, oldState.channel, newState.channel.parent)
  }
}
