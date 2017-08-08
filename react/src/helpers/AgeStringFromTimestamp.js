const AgeStringFromTimestamp = (now, timestamp) => {
  let ageInMs = now - Date.parse(timestamp)
  let ageInSec = ageInMs / 1000
  let ageInMin = ageInSec / 60
  let ageInHour = ageInMin / 60
  let ageInDay = ageInHour / 24

  let days = Math.floor(ageInDay)
  let hours = Math.floor(ageInHour - (24 * days))
  let minutes = Math.floor(ageInMin - (60 * hours) - (60 * 24 * days))

  let ageStr = ''
  if (days > 0) {
    ageStr += `${days} day`
    if (days > 1) {
      ageStr += 's'
    }
  }
  if (hours > 0) {
    ageStr += ` ${hours} hour`
    if (hours > 1) {
      ageStr += 's'
    }
  }
  if (minutes > 0) {
    ageStr += ` ${minutes} minute`
    if (minutes > 1) {
      ageStr += 's'
    }
  }
  if (ageStr.length === 0) {
    ageStr = 'Just now'
  } else {
    ageStr += ' ago'
  }

  return ageStr
}

export default AgeStringFromTimestamp
