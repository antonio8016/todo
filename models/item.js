var Sequelize = require('sequelize')

module.exports = function(sequelize, DataTypes) {

  	var Item = sequelize.define('Item', {
  		name: Sequelize.STRING,
	})

  	return Item
}
