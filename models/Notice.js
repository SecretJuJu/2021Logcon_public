// CREATE TABLE Notice(
//     ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     TITLE VARCHAR(100) NOT NULL,
//     CONTENTS VARCHAR(1000) NOT NULL,
//     TIME VARCHAR(100) NOT NULL
// );
module.exports = (sequelize,DataTypes) => {
    return sequelize.define('Notice',{
        pk:{ // pk
            type : DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey : true
        },
        title : {
            type : DataTypes.STRING,
            allowNull: false,
        },
        content : {
            type : DataTypes.TEXT,
            allowNull: false
        }
    })
}