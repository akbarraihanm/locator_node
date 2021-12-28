module.exports = (seq, Sequelize) => {
    const Activity = seq.define("activities", {
        activity: Sequelize.TEXT
    })

    return Activity
}