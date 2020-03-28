
module.exports = (sequelize, type)=>{
    return sequelize.define('user',{
        id: {
            type: type.STRING,
            primaryKey: true,
            allowNull:false
        },
        username: {
            type: type.STRING,
            allowNull: false
        },
        email: {
            type: type.STRING,
            allowNull: false
        },
        password:{        
            type: type.STRING,
            allowNull: false
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
                    fields: ['email','id']
                }
            ]
        }
    )
}