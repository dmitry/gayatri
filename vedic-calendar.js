/**
 * Vedic Calendar Sandhya-Vandana for Tallinn (Estonia)
 * 
 * This script automatically creates events in Google Calendar:
 * - Brahma-muhurta (predawn spiritual period)
 * - Morning sandhya (sunrise)
 * - Midday sandhya (solar noon)
 * - Evening sandhya (sunset)
 * according to Vedic traditions.
 * 
 * Features:
 * - Precise calculation of sunrise, sunset, and solar noon for Tallinn
 * - Calculation of Brahma-muhurta (96 minutes before sunrise)
 * - Calculation of all three sandhya periods
 * - Accurate determination of sandhya period durations
 * - Detailed descriptions with exact times
 */

// Constants for Tallinn, Estonia
const LATITUDE = 59.4369;
const LONGITUDE = 24.7536;
const TIMEZONE = "Europe/Tallinn";
const CALENDAR_NAME = "Vedic Calendar";

// Constants for calculating Vedic periods
const BRAHMA_MUHURTA_MINUTES_BEFORE_SUNRISE = 96; // 1 hour 36 minutes before sunrise
const BRAHMA_MUHURTA_DURATION_MINUTES = 48;       // Duration of 48 minutes
const SANDHYA_DURATION_MINUTES = 24;              // Standard sandhya duration (24 minutes)

/**
 * Main function to create Vedic events for the next day.
 * Runs daily at 6:00 PM.
 */
function createVedicEvents() {
  // Get tomorrow's date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Calculate astronomical events for tomorrow
  const sunTimes = getSunTimesAsDate(tomorrow, LATITUDE, LONGITUDE, TIMEZONE);
  
  // Calculate Vedic periods
  const vedicTimes = calculateVedicTimes(sunTimes);
  
  // Create events in the calendar
  createCalendarEvents(vedicTimes, tomorrow);
  
  Logger.log("Vedic events created for " + Utilities.formatDate(tomorrow, TIMEZONE, "yyyy-MM-dd"));
}

/**
 * Calculate sunrise, solar noon and sunset times for the specified date.
 * Uses accurate astronomical formula.
 * 
 * @param {Date} date - Date for calculation
 * @param {number} lat - Latitude in degrees
 * @param {number} lng - Longitude in degrees
 * @param {string} timezone - Timezone
 * @return {Object} Object with sunrise, noon and sunset times in minutes from the start of day
 */
function getSunTimes(date, lat, lng, timezone) {
  var rad = Math.PI / 180;
  
  // Get day of year
  var startOfYear = new Date(date.getFullYear(), 0, 0);
  var diff = date - startOfYear;
  var oneDay = 1000 * 60 * 60 * 24;
  var dayOfYear = Math.floor(diff / oneDay);
  
  // Angle (in radians) for calculation
  var gamma = 2 * Math.PI / 365 * (dayOfYear - 1);
  
  // Calculate equation of time (in minutes)
  var eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) 
              - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  
  // Calculate sun declination angle (in radians)
  var decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) 
            - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma) 
            - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  
  // Get timezone offset in minutes for the given date and zone
  // Format tzString: "+0200" or "+0300"
  var tzString = Utilities.formatDate(date, timezone, "Z");
  var tzOffsetMinutes = parseInt(tzString.slice(0, 3)) * 60 + parseInt(tzString.slice(3));
  
  // Calculate solar noon (in minutes from start of day, local time)
  // Formula: 720 - 4 * lng - eqTime + tzOffset
  var solarNoon = 720 - (4 * lng) - eqTime + tzOffsetMinutes;
  
  // Calculate hour angle for sunrise/sunset (account for 90.833° for atmospheric refraction)
  var cosH = (Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl));
  
  // Limit value to range [-1, 1]
  if (cosH > 1) {
    cosH = 1;
  }
  if (cosH < -1) {
    cosH = -1;
  }
  
  var ha = Math.acos(cosH); // in radians
  
  // Convert hour angle to minutes (4 minutes per degree)
  var haMinutes = (ha * 180 / Math.PI) * 4;
  
  var sunrise = solarNoon - haMinutes;
  var sunset = solarNoon + haMinutes;
  
  return {
    sunrise: sunrise,
    solarNoon: solarNoon,
    sunset: sunset
  };
}

/**
 * Converts calculated sunrise, noon and sunset results to Date objects.
 * 
 * @param {Date} date - Base date
 * @param {number} lat - Latitude in degrees
 * @param {number} lng - Longitude in degrees
 * @param {string} timezone - Timezone
 * @return {Object} Object with sunrise, noon and sunset times as Date objects
 */
function getSunTimesAsDate(date, lat, lng, timezone) {
  // Get times in minutes from start of day
  const times = getSunTimes(date, lat, lng, timezone);
  
  // Convert times to Date objects
  const sunriseDate = minutesToDate(date, times.sunrise);
  const solarNoonDate = minutesToDate(date, times.solarNoon);
  const sunsetDate = minutesToDate(date, times.sunset);
  
  return {
    sunrise: sunriseDate,
    noon: solarNoonDate,
    sunset: sunsetDate
  };
}

/**
 * Converts time in minutes from start of day to a Date object.
 * 
 * @param {Date} baseDate - Base date
 * @param {number} minutes - Time in minutes from start of day
 * @return {Date} Time as Date object
 */
function minutesToDate(baseDate, minutes) {
  const date = new Date(baseDate);
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  date.setHours(hours, mins, 0, 0);
  return date;
}

/**
 * Calculate Vedic periods based on astronomical data.
 * In accordance with Vedic traditions.
 * 
 * @param {Object} sunTimes - Object containing sunrise, noon and sunset times
 * @return {Object} Object containing Vedic periods
 */
function calculateVedicTimes(sunTimes) {
  // Brahma-muhurta (1 hour 36 minutes before sunrise, duration 48 minutes)
  const brahmaMuhurtaStart = new Date(sunTimes.sunrise);
  brahmaMuhurtaStart.setMinutes(brahmaMuhurtaStart.getMinutes() - BRAHMA_MUHURTA_MINUTES_BEFORE_SUNRISE);
  
  const brahmaMuhurtaEnd = new Date(brahmaMuhurtaStart);
  brahmaMuhurtaEnd.setMinutes(brahmaMuhurtaEnd.getMinutes() + BRAHMA_MUHURTA_DURATION_MINUTES);
  
  // Morning sandhya (starts 24 minutes before sunrise, ends 24 minutes after)
  const morningSandhyaStart = new Date(sunTimes.sunrise);
  morningSandhyaStart.setMinutes(morningSandhyaStart.getMinutes() - SANDHYA_DURATION_MINUTES);
  
  const morningSandhyaEnd = new Date(sunTimes.sunrise);
  morningSandhyaEnd.setMinutes(morningSandhyaEnd.getMinutes() + SANDHYA_DURATION_MINUTES);
  
  // Midday sandhya (centered on solar noon)
  const noonSandhyaStart = new Date(sunTimes.noon);
  noonSandhyaStart.setMinutes(noonSandhyaStart.getMinutes() - SANDHYA_DURATION_MINUTES);
  
  const noonSandhyaEnd = new Date(noonSandhyaStart);
  noonSandhyaEnd.setMinutes(noonSandhyaEnd.getMinutes() + SANDHYA_DURATION_MINUTES * 2);
  
  // Evening sandhya (starts 24 minutes before sunset, ends 24 minutes after)
  const eveningSandhyaStart = new Date(sunTimes.sunset);
  eveningSandhyaStart.setMinutes(eveningSandhyaStart.getMinutes() - SANDHYA_DURATION_MINUTES);
  
  const eveningSandhyaEnd = new Date(sunTimes.sunset);
  eveningSandhyaEnd.setMinutes(eveningSandhyaEnd.getMinutes() + SANDHYA_DURATION_MINUTES);
  
  return {
    brahmaMuhurta: {
      start: brahmaMuhurtaStart,
      end: brahmaMuhurtaEnd,
      type: "Brahma-muhurta",
      description: `Brahma-muhurta (time for spiritual practice before dawn): ${formatTime(brahmaMuhurtaStart)} - ${formatTime(brahmaMuhurtaEnd)}\nSunrise time: ${formatTime(sunTimes.sunrise)}`
    },
    morningSandhya: {
      start: morningSandhyaStart,
      end: morningSandhyaEnd,
      type: "Morning Sandhya",
      description: `Morning Sandhya (time for reciting Gayatri mantra at sunrise): ${formatTime(morningSandhyaStart)} - ${formatTime(morningSandhyaEnd)}\nExact sunrise time: ${formatTime(sunTimes.sunrise)}`
    },
    noonSandhya: {
      start: noonSandhyaStart,
      end: noonSandhyaEnd,
      type: "Midday Sandhya",
      description: `Midday Sandhya (time for reciting Gayatri mantra at noon): ${formatTime(noonSandhyaStart)} - ${formatTime(noonSandhyaEnd)}\nExact solar noon time: ${formatTime(sunTimes.noon)}`
    },
    eveningSandhya: {
      start: eveningSandhyaStart,
      end: eveningSandhyaEnd,
      type: "Evening Sandhya",
      description: `Evening Sandhya (time for reciting Gayatri mantra at sunset): ${formatTime(eveningSandhyaStart)} - ${formatTime(eveningSandhyaEnd)}\nExact sunset time: ${formatTime(sunTimes.sunset)}`
    }
  };
}

/**
 * Create calendar events for Vedic periods.
 * 
 * @param {Object} vedicTimes - Object containing Vedic periods
 * @param {Date} date - Date for which events are created
 */
function createCalendarEvents(vedicTimes, date) {
  // Get or create calendar
  const calendar = getOrCreateCalendar();
  
  // Format date as YYYY-MM-DD for event titles
  const dateStr = Utilities.formatDate(date, TIMEZONE, "yyyy-MM-dd");
  
  // Create Brahma-muhurta event
  calendar.createEvent(
    `${vedicTimes.brahmaMuhurta.type} (${dateStr})`,
    vedicTimes.brahmaMuhurta.start,
    vedicTimes.brahmaMuhurta.end,
    {
      description: vedicTimes.brahmaMuhurta.description,
      location: "Tallinn, Estonia",
      timezone: TIMEZONE
    }
  );
  
  // Create Morning Sandhya event
  calendar.createEvent(
    `${vedicTimes.morningSandhya.type} (${dateStr})`,
    vedicTimes.morningSandhya.start,
    vedicTimes.morningSandhya.end,
    {
      description: vedicTimes.morningSandhya.description,
      location: "Tallinn, Estonia",
      timezone: TIMEZONE
    }
  );
  
  // Create Midday Sandhya event
  calendar.createEvent(
    `${vedicTimes.noonSandhya.type} (${dateStr})`,
    vedicTimes.noonSandhya.start,
    vedicTimes.noonSandhya.end,
    {
      description: vedicTimes.noonSandhya.description,
      location: "Tallinn, Estonia",
      timezone: TIMEZONE
    }
  );
  
  // Create Evening Sandhya event
  calendar.createEvent(
    `${vedicTimes.eveningSandhya.type} (${dateStr})`,
    vedicTimes.eveningSandhya.start,
    vedicTimes.eveningSandhya.end,
    {
      description: vedicTimes.eveningSandhya.description,
      location: "Tallinn, Estonia",
      timezone: TIMEZONE
    }
  );
}

/**
 * Get calendar or create it if it doesn't exist.
 * 
 * @return {Calendar} Calendar object
 */
function getOrCreateCalendar() {
  let calendar = null;
  
  // Try to find the calendar
  const calendars = CalendarApp.getAllCalendars();
  for (let i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === CALENDAR_NAME) {
      calendar = calendars[i];
      break;
    }
  }
  
  // Create calendar if it doesn't exist
  if (calendar === null) {
    calendar = CalendarApp.createCalendar(CALENDAR_NAME, {
      color: CalendarApp.Color.ORANGE,
      timezone: TIMEZONE
    });
  }
  
  return calendar;
}

/**
 * Format Date object as time string (HH:MM).
 * 
 * @param {Date} date - Date to format
 * @return {string} Formatted time string
 */
function formatTime(date) {
  if (!date) {
    return "N/A";
  }
  return Utilities.formatDate(date, TIMEZONE, "HH:mm");
}

/**
 * Set up trigger to run createVedicEvents daily at 6:00 PM.
 */
function setupTrigger() {
  // Remove any existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "createVedicEvents") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Create new trigger to run at 6:00 PM every day
  ScriptApp.newTrigger("createVedicEvents")
    .timeBased()
    .atHour(18)
    .everyDays(1)
    .create();
  
  Logger.log("Daily trigger set to run at 6:00 PM.");
}

/**
 * Manual execution of event creation for testing
 */
function manualRun() {
  createVedicEvents();
  Logger.log("Script executed manually. Check calendar for created events.");
}
