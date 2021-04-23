const help = require('../commands/help')
const status = require('../commands/status')
const roomsize = require('../commands/roomsize')
const setup = require('../commands/setup')
const addServer = require('../commands/addServer')
const stop = require('../commands/stop')

module.exports = (client, msg) => {
  //addServer(msg.guild.id+" ")
  if (!msg.guild) {
    // prevent crashing from private message
    return
  }
  if (msg.content.startsWith('?help')) {
    return help(client, msg)
  }
  if (msg.content.startsWith('?status')) {
    return status(client, msg.channel, msg.content.split(' ')[1], true)
  }
  if (msg.content.startsWith('?roomsize')) {
    return roomsize(client, msg)
  }
  if (msg.content.startsWith('?setup')) {
    return setup(client, msg)
  }
  if (msg.content.startsWith('?stop')) {
    return stop(client, msg)
  }
}
