module.exports = (sequelize,DataTypes) => {
    return sequelize.define('Challenge',{
        pk:{ // pk
            type : DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey : true
        },
        title : {
            type : DataTypes.STRING(100),
            allowNull: false
        },
        contents : {
            type : DataTypes.TEXT,
            allowNull:false
        },
        score : {
            type : DataTypes.INTEGER,
            allowNull:false
        },
        answer: {
            type : DataTypes.STRING(100),
            allowNull:false
        },
        file_link : {
            type : DataTypes.STRING(100),
            defaultValue: "false"
        },
        category : {
            type : DataTypes.STRING(30),
            allowNull:false
        },
        image_name : {
            type : DataTypes.STRING(300)
        }

    })
}