const suid = require('rand-token').suid;

module.exports = (sequelize, Sequelize) => {
    const UserSession = sequelize.define('user_sessions', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        token: {
            type: Sequelize.STRING
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
            allowNull: false,
        },
        deletedAt: {
            field: 'deleted_at',
            type: Sequelize.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'user_sessions',
        paranoid: true
    })
    UserSession.createToken = async function (user_id) {
        let userSession = await UserSession.create({
            token: user_id + suid(99),
            user_id: user_id
        })
        return userSession.token
    }
    return UserSession
}