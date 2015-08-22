//Modelo para Controlar las visitas a la pagina

module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Visit',
		{
			ip:
			{
				type: DataTypes.STRING
			},
			url:
			{
				type: DataTypes.STRING
			}
		}
	);
};