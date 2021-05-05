module.exports = (sequelize,DataTypes) => {
    return sequelize.define('Member',{
        pk:{ // pk
            type : DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey : true
        },
        id : { // id when login 
            type: DataTypes.STRING(100),
            primaryKey : true,
        },
        passwd : { // password
            type :DataTypes.STRING(100),
            allowNull : false
        },
        email : { 
            type : DataTypes.STRING(100),
            unique : true
        },
        solve : {
            type : DataTypes.INTEGER,
            defaultValue : 0
        },
        score : {
            type : DataTypes.INTEGER,
            defaultValue : 0
        },
        profile_comment : {
            type : DataTypes.STRING(100),
            defaultValue : "undefined"
        },
        auth_key : {
            type : DataTypes.STRING(100)
        },
        authenticated : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        school_name : {
            type : DataTypes.STRING(100)
        },
        school_level : {
            type : DataTypes.STRING(20)
        },
        isAdmin : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        }
    })
}