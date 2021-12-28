module.exports = (seq, Sequelize) => {
    const VisitSchedule = seq.define("visit_schedules", {
        day: Sequelize.STRING,
    })

    return VisitSchedule
}