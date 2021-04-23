const status = require('../commands/status')

module.exports = (client, message) => {
  var split_msg = message.content.split(' ')
  servernames = Object.keys(servers).filter(function(item, index) {
    if (split_msg[2] && !item.includes(split_msg[2])) return false
    return item.startsWith(String(message.guild.id));
  })
  if (servernames.length == 0) {
    message.channel.send("There is nothing to stop, no one is playing " + setup.name + " right now.")
    return
  }
  else {
    message.channel.send("I am returning everyone to the main room.")
    main_channel = null
    const voiceChannels = message.guild.channels.cache.filter(c => c.type=='voice')

    voiceChannels.forEach( vc => {
      if (main_channel == null) {
        main_channel = vc
        console.log(main_channel)
      }
    })
    servernames.forEach((servername) => {
      for (vc in servers[servername].voice_channels) {
        servers[servername].voice_channels[vc].members.forEach( member => {
          member.voice.setChannel(main_channel)
        })
      }
    })
    status(client, message.channel, null, false)
  }
}
