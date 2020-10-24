servers = {}
setup = {
  name: 'MIni-Match',
  next: 'Next'
}

module.exports = (guild) => {

  if (servers.hasOwnProperty(guild.id)) return

  servers[guild.id] = {
    voice_channels: [],
    room_id: 0,
    room_size: 2,
    categories: []
  }
}
