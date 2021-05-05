module.exports = (sequelize,DataTypes) => {
    return sequelize.define('Solved',{
        chall_pk:{ // fk
            type : DataTypes.INTEGER,
            allowNull : false
        },
        mem_pk : { // fk
            type : DataTypes.INTEGER,
            allowNull : false
        }
    })
}