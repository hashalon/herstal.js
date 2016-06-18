var HERSTALclient = {};

if(!window || !document) throw new Error("This librairy is meant to be used in a web browser");

window.HERSTALclient = HERSTALclient;

if(!io)     throw new Error('Herstal.client needs Socket.io to work');
if(!CooMan) throw new Error('Herstal.client needs CookieManager to work');
if(!HERSTALshared) throw new Error('Herstal.client needs Herstal.shared to work');
