export const createTableTimes = (length = 20, startHour = 8) => {
    const availableTimes = Array(length).fill({ hour: 8, minutes: 0 })
    let initialTime = { hour: 8, minutes: 0 }
    const times = [];
    availableTimes.forEach((pres) => {
        (initialTime.hour == pres.hour && initialTime.minutes == 30) ? pres.hour += 1 : pres.hour;
        initialTime.minutes == 0 ? pres.minutes += 30 : pres.minutes = 0;
        initialTime = pres
        times.push({ ...pres })
    })
    return times
}

export const getUnavailableTimes = (selectDate, data) => {
    const monthSelected = new Date(selectDate).getMonth();
    const daySelected = new Date(selectDate).getDate();

    const sameMonth = data.filter(el => new Date(el).getMonth() == monthSelected)
    const sameDay = sameMonth.filter(el => new Date(el).getDate() == daySelected)
    const unavailableTimes = sameDay.map(el => {
        let hour = new Date(el).getHours()
        let minutes = new Date(el).getMinutes()
        return { hour, minutes }
    })
    return unavailableTimes;
}

