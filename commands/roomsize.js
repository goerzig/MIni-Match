module.exports = (client, message) => {
  var split_msg = message.content.split(' ')
  if (split_msg.length == 2) {
    var size = Number(split_msg[1])
    if (size) {
      if (size > 1) {
        if (servers[message.guild.id].room_size != size) {
          servers[message.guild.id].room_size = size
          message.reply("the roomsize has been changed to " + servers[message.guild.id].room_size + " people per room.")
        }
        else {
          message.reply("the roomsize is currently set to " + servers[message.guild.id].room_size + " people per room.")
        }
      }
      else {
        message.reply("the roomsize must be greater than 1.")
      }
    }
    else {
      message.reply("please use e.g. '?roomsize 2' to change the roomsize to 2 people per room.")
    }
  }
  else if (split_msg.length == 1) {
    message.reply("the roomsize is currently set to " + servers[message.guild.id].room_size + " people per room.")
  }
  else {
    message.reply("please use e.g. '?roomsize 2' to change the roomsize to 2 people per room.")
  }
}
