module.exports = (seq, Sequelize) => {
    const Absence = seq.define("absences", {
        latLng: Sequelize.TEXT,
        img: Sequelize.TEXT
    })

    return Absence
}