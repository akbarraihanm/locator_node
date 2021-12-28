module.exports = (seq, Sequelize) => {
    const Store = seq.define('stores', {
        name: Sequelize.STRING
    })

    return Store
}