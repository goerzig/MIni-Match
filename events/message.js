const help = require('../commands/help')
const status = require('../commands/status')
const roomsize = require('../commands/roomsize')
const setup = require('../commands/setup')
const addServer = require('../commands/addServer')

module.exports = (client, msg) => {
  addServer(msg.guild)
  if (msg.content.startsWith('?help')) {
    return help(client, msg)
  }
  if (msg.content.startsWith('?status')) {
    return status(client, msg)
  }
  if (msg.content.startsWith('?roomsize')) {
    return roomsize(client, msg)
  }
  if (msg.content.startsWith('?setup')) {
    return setup(client, msg)
  }
}
