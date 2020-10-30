servers = {}
setup = {
  name: 'MIni-Match',
  next: 'Next'
}

module.exports = (servername) => {

  if (servers.hasOwnProperty(servername)) return

  servers[servername] = {
    voice_channels: [],
    room_id: 0,
    room_size: 2,
    categories: []
  }
}
