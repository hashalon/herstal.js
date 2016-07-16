if(!window || !document) throw new Error("This librairy is meant to be used in a web browser");

var HERSTAL = window.HERSTAL;

if(!io)      throw new Error('herstal.client needs Socket.io to work');
if(!HERSTAL) throw new Error('herstal.client needs herstal.preferences to work');
if(!HERSTAL) throw new Error('herstal.client needs herstal.shared to work');
