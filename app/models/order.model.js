module.exports = (seq, Sequelize) => {
    const Order = seq.define("orders", {
        name: Sequelize.STRING,
        quantity: Sequelize.INTEGER,
    })

    return Order
}