module.exports = (client, message) => {
  var split_msg = message.content.split(' ')
  servernames = Object.keys(servers).filter(function(item, index) {
    if (split_msg[2] && !item.includes(split_msg[2])) return false
    return item.startsWith(String(message.guild.id));
  })
  if (servernames.length == 0) {
    message.channel.send("The roomsize is currently set to 2 people per room.")
    return
  }
  else {
    if (split_msg.length == 2 || split_msg.length == 3) {
      var size = Number(split_msg[1])
      if (size) {
        if (size > 1) {
          servernames.forEach((servername) => {
            if (servers[servername].room_size != size) {
              servers[servername].room_size = size
              message.channel.send("The roomsize" + servername.slice(String(message.guild.id).length) + " has been changed to " + servers[servername].room_size + " people per room.")
            }
            else {
              message.channel.send("The roomsize" + servername.slice(String(message.guild.id).length) + " is currently set to " + servers[servername].room_size + " people per room.")
            }
          })
        }
        else {
          message.channel.send("The roomsize must be greater than 1.")
        }
      }
      else {
        message.reply("please use e.g. '?roomsize 2' to change the roomsize to 2 people per room.")
      }
    }
    else if (split_msg.length == 1) {
      servernames.forEach((servername) => {
        message.channel.send("The roomsize" + servername.slice(String(message.guild.id).length) + " is currently set to " + servers[servername].room_size + " people per room.")
      })
    }
    else {
      message.reply("please use e.g. '?roomsize 2' to change the roomsize to 2 people per room.")
    }
  }
}
