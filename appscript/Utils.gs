function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function getSettings() {
  const sheet = getSheet("Settings");
  const values = sheet.getDataRange().getValues();

  const settings = {};

  for (let i = 0; i < values.length; i++) {
    settings[values[i][0]] = values[i][1];
  }

  return settings;
}

function generateBookingID() {

  const settingsSheet = getSheet("Settings");
  const values = settingsSheet.getDataRange().getValues();

  let row = -1;

  for (let i = 0; i < values.length; i++) {

    if (values[i][0] === "NextBookingID") {

      row = i + 1;
      break;

    }

  }

  const settings = getSettings();

  const prefix = settings.BookingPrefix;

  const next = Number(settings.NextBookingID);

  const bookingID = prefix + String(next).padStart(6, "0");

  settingsSheet.getRange(row, 2).setValue(next + 1);

  return bookingID;

}

function setSetting(key, value) {

  const sheet = getSheet("Settings");
  const values = sheet.getDataRange().getDisplayValues();

  for (let i = 0; i < values.length; i++) {

    if (values[i][0] === key) {

      sheet.getRange(i + 1, 2).setValue(value);
      return;

    }

  }

  // If the key doesn't exist, create it
  sheet.appendRow([key, value]);

}

const settings = getSettings();

const lastRead = settings.LastNotificationRead || "1970-01-01 00:00:00";

function generateMemberID() {

  const settingsSheet = getSheet("Settings");
  const values = settingsSheet.getDataRange().getValues();

  let row = -1;

  for (let i = 0; i < values.length; i++) {

    if (values[i][0] === "NextMemberID") {

      row = i + 1;
      break;

    }

  }

  const settings = getSettings();

  const prefix = settings.MembershipPrefix;

  const next = Number(settings.NextMemberID);

  const memberID = prefix + String(next).padStart(6, "0");

  settingsSheet.getRange(row, 2).setValue(next + 1);

  return memberID;

}