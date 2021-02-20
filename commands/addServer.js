const status = require('../commands/status')
const Discord = require('discord.js')

servers = {}
setup = {
  name: 'MIni-Match',
  next: 'Next',
  instruction_channel: "how-to-play",
  instructions: `Ich bin das MIni-Match, ein Chatroulette auf Discord. Wenn ich offline bin, funktioniert auch das MIni-Match nicht.\n\nImmer wenn du auf "Next" klickst wirst du mit dem nächsten freien Chatpartner verbunden.\n\n• Wenn beide Partner auf "Next" klicken ist es möglich, dass sie wieder miteinander verbunden werden. Im besten Fall bleibt also einer im Raum und der andere klickt auf "Next".\n\n• Wenn ihr zu lange allein in einem Raum wartet, probiert es auf "Next" zu klicken um zu sehen ob irgendwo jemand allein ist.\n\nMit \`?status\` kann abgefragt werden wie viele Spieler grade MIni-Match spielen und wie viele davon allein in einem Raum sind.`
}

module.exports = (guild, servername, category) => {

  if (servers.hasOwnProperty(servername)) return

  servers[servername] = {
    voice_channels: [],
    room_id: 0,
    room_size: 2,
    categories: [],
    status: "No one is playing " + setup.name + " right now. No one is alone in a room."
  }
  category.children.each(function(channel) {
    if (channel.name == setup.instruction_channel) {
      channel.messages.fetch(channel.lastMessageID).then(message => message.delete())
      const embed = new Discord.MessageEmbed()
        .setTitle('Players playing '+ setup.name + ':')
        .setDescription(servers[servername].status)
        .setTimestamp()

      servers[servername].embed = channel.send(embed)
    }
  })
  if (servers[servername].embed) return
  guild.channels.create(setup.instruction_channel, {type: 'text', parent: category, permissionOverwrites: [{id: guild.roles.everyone.id, deny: ['SEND_MESSAGES']}]}).then(function(new_channel) {
    new_channel.send(setup.instructions)
    const embed = new Discord.MessageEmbed()
      .setTitle('Players playing '+ setup.name + ':')
      .setDescription(servers[servername].status)
      .setTimestamp()

    servers[servername].embed = new_channel.send(embed)
  })


}
