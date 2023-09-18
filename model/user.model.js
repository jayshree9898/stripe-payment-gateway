module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('users', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        email: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        password: {
            type: Sequelize.STRING(200),
            allowNull: true,
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
    },{
        tableName : 'users',
        paranoid : true 
    })
}