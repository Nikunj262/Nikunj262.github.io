


function setDatesToString(appointment) {
	
	return appointment.length && JSON.stringify(appointment);
}

module.exports = {
	setDatesToString
}
