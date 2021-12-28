module.exports = (seq, Sequelize) => {
    const User = seq.define("users", {
        name: Sequelize.STRING,
        idCard: Sequelize.STRING,
        img: Sequelize.STRING,
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        email: Sequelize.STRING
    })

    return User
}