# Installation Guide

This document provides detailed instructions for setting up the Vedic Calendar Sandhya-Vandana Google Apps Script.

## Prerequisites

- A Google account
- Access to Google Calendar
- Basic understanding of how to use Google Apps Script

## Step-by-Step Installation

### 1. Access Google Apps Script

1. Go to [script.google.com](https://script.google.com/)
2. Sign in with your Google account if prompted
3. Click on "New Project" to create a new script project

### 2. Add the Script Code

1. Delete any default code in the editor
2. Copy all the code from `vedic-calendar.js` in this repository
3. Paste it into the Google Apps Script editor
4. Click on "Rename" at the top and name your project "Vedic Calendar" or any name you prefer
5. Click "Save" (Ctrl+S or ⌘+S)

### 3. Configure Location Settings

Before running the script, modify the location constants to match your desired location:

```javascript
// Constants for your location
const LATITUDE = 59.4369;    // Replace with your latitude
const LONGITUDE = 24.7536;   // Replace with your longitude
const TIMEZONE = "Europe/Tallinn";  // Replace with your timezone
```

To find your coordinates:
- Use Google Maps: Right-click on your location and select "What's here?" to see the coordinates
- Or use a website like [latlong.net](https://www.latlong.net/)

For timezone strings, use values like "America/New_York", "Europe/London", "Asia/Kolkata", etc.

### 4. Initial Setup and Testing

1. From the "Select function" dropdown near the top of the editor, select the `manualRun` function
2. Click the Run button (▶️)
3. You will be prompted to authorize the script. Click "Review Permissions"
4. Select your Google account
5. You'll see a warning that the app isn't verified - this is normal for personal scripts. Click "Advanced" and then "Go to Vedic Calendar (unsafe)"
6. Click "Allow" to grant the necessary permissions

After authorization, the script will run and create Vedic events for the next day in a new calendar called "Vedic Calendar".

### 5. Set Up the Automatic Trigger

To have the script run automatically every day:

1. From the "Select function" dropdown, select the `setupTrigger` function
2. Click the Run button (▶️)
3. This will create a time-based trigger that runs the script daily at 6:00 PM

To verify the trigger was created:
1. Click on the "Triggers" icon in the left sidebar (clock icon)
2. You should see a trigger for the `createVedicEvents` function set to run daily at 6:00 PM

### 6. Verify Calendar Creation

1. Go to [Google Calendar](https://calendar.google.com/)
2. In the left sidebar, find the calendar named "Vedic Calendar" 
3. Make sure it's checked to display events
4. You should see the Vedic events for the next day

## Troubleshooting

### Script Authorization Issues

If you encounter permission errors:
1. Go to the Google Apps Script editor
2. Click on "Project Settings" in the left sidebar
3. Click "Change Project OAuth Scopes"
4. Make sure the necessary scopes are included:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/script.scriptapp`

### Calendar Not Appearing

If the Vedic Calendar doesn't appear in your calendar list:
1. Go to Google Calendar
2. In the left sidebar, click the "+" next to "Other calendars"
3. Select "Browse resources" 
4. Search for "Vedic Calendar"
5. Click to add it to your calendar list

### Calculation Issues

If the times seem incorrect:
1. Double-check your latitude, longitude, and timezone settings
2. Verify that the date is correct in your testing

## Advanced Customization

### Modifying Event Colors

To change the calendar color:
1. Locate the `getOrCreateCalendar()` function in the code
2. Change the color parameter to one of the available Google Calendar colors:
   - `CalendarApp.Color.BLUE`
   - `CalendarApp.Color.GREEN`
   - `CalendarApp.Color.RED`
   - `CalendarApp.Color.ORANGE` (default)
   - And many others

### Adjusting Vedic Period Definitions

If you follow a different tradition or want to adjust the durations:
1. Find the constants at the top of the script:
   ```javascript
   const BRAHMA_MUHURTA_MINUTES_BEFORE_SUNRISE = 96;
   const BRAHMA_MUHURTA_DURATION_MINUTES = 48;
   const SANDHYA_DURATION_MINUTES = 24;
   ```
2. Modify these values according to your preferences
3. Save and run the script again to test the changes

## Maintenance

- The script will run automatically once set up
- If you ever need to make changes, just edit the script and save it
- If you want to stop the automatic execution, go to the Triggers section and delete the trigger

---

If you encounter any issues not covered in this guide, please open an issue in the GitHub repository.
