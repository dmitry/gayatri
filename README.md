# Vedic Calendar Sandhya-Vandana

A Google Apps Script project that automatically creates and maintains a calendar with Vedic time periods based on astronomical calculations for sunrise, sunset, and solar noon.

## Features

- **Accurate Astronomical Calculations**: Precisely calculates sunrise, sunset, and solar noon based on location coordinates.
- **Vedic Time Periods**: Automatically determines the following important Vedic time periods:
  - **Brahma-muhurta**: The auspicious pre-dawn period for spiritual practice (96 minutes before sunrise, lasting 48 minutes)
  - **Morning Sandhya**: The sacred time surrounding sunrise
  - **Midday Sandhya**: The sacred time surrounding solar noon
  - **Evening Sandhya**: The sacred time surrounding sunset
- **Automatic Calendar Management**: Creates and updates a dedicated Google Calendar with all events
- **Customizable**: Easy to adapt for different locations by changing coordinates

## How It Works

The script calculates the exact times for sunrise, solar noon, and sunset for the specified location (Tallinn, Estonia by default). Based on these astronomical events, it determines the traditional Vedic time periods and creates calendar events with detailed descriptions.

### Vedic Time Periods Explained

- **Brahma-muhurta**: Considered the most auspicious time for spiritual practices like meditation and yoga. It starts 96 minutes (1 hour and 36 minutes) before sunrise and lasts for 48 minutes.
- **Sandhya Periods**: The transitional times (dawn, midday, and dusk) considered sacred in Vedic traditions. Each sandhya period spans 24 minutes before and after the astronomical event (sunrise, solar noon, sunset).

## Installation

1. Open the [Google Apps Script](https://script.google.com/) editor
2. Create a new project
3. Copy and paste the code from `vedic-calendar.js`
4. Save the project
5. Run the `setupTrigger()` function once to set up the daily trigger
6. Authorize the necessary permissions when prompted

## Configuration

To use this script for your own location, modify the following constants at the top of the script:

```javascript
// Constants for your location
const LATITUDE = 59.4369;    // Replace with your latitude
const LONGITUDE = 24.7536;   // Replace with your longitude
const TIMEZONE = "Europe/Tallinn";  // Replace with your timezone
const CALENDAR_NAME = "Vedic Calendar";  // Customize calendar name if desired
```

You can find your coordinates using Google Maps or similar services.

## Usage

Once installed and configured:

1. The script will automatically run daily at 6:00 PM local time
2. It will calculate and create all Vedic time period events for the next day
3. Events will appear in a separate calendar named "Vedic Calendar" (or your custom name)
4. Each event includes detailed descriptions with exact timings

### Manual Execution

To manually trigger the script:

1. Open the Google Apps Script editor
2. Select the `manualRun` function from the dropdown menu
3. Click the Run button (▶️)

## Customization

You can adjust the following parameters to customize the Vedic periods:

```javascript
// Constants for calculating Vedic periods
const BRAHMA_MUHURTA_MINUTES_BEFORE_SUNRISE = 96;  // How long before sunrise
const BRAHMA_MUHURTA_DURATION_MINUTES = 48;        // Duration
const SANDHYA_DURATION_MINUTES = 24;               // Half-length of sandhya periods
```

## License

MIT License

## Acknowledgments

- Based on accurate astronomical calculations for solar positions
- Designed according to traditional Vedic time-keeping principles

---

*This project is for educational and spiritual purposes. The calculations are based on astronomical formulas but may vary slightly from other calculators due to differences in refraction adjustments and calculation methods.*
