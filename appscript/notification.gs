function markNotificationsRead(){

  setSetting(
    "LastNotificationRead",
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd HH:mm:ss"
    )
  );

  return {
    success: true
  };

}