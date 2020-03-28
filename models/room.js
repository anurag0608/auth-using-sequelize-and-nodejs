module.exports = (sequelize, type)=>{
    return sequelize.define('room',{
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        available: {
            type: type.BOOLEAN,
            allowNull: false,
        },
        roomNo: {
            type: type.INTEGER,
            allowNull: false,
        },
        bookedby:{
            type: type.INTEGER,
            allowNull: true
        },
        createdAt: {
            type:type.DATE,
            defaultValue: new Date()
        },
        updatedAt: {
            type:type.DATE,
            defaultValue: new Date()
        }
    },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['roomNo']
                }
            ]
        }
    )
}