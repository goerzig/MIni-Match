const addServer = require('../commands/addServer')

module.exports = (client, guild) => {
  guild.channels.create(setup.name, {type: 'category'}).then(function(new_category) {
    guild.channels.create("Next", {type: 'voice', parent: new_category})

    servername = (guild+" "+new_category.name.slice(setup.name.length+1)).trimRight()
    addServer(guild, servername, new_category)
  })
}
