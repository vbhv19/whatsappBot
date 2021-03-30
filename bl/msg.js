const { getClient } = require("./clients");
const { responseActions, getRandomInt, getChatIdFromMob, getProjectedMessagesFromRawArr, getUnreadProjectedMessagesFromArr } = require("../utils");

let defaultContacts = [ "8109583706" ]; //send every msg to these numbers too

/*
  @param data.userId @required
  @param data.mob @required comma separated mobile numbers without country code, ex: "8109583706, 7000521889, 7000565376"
  @param data.text @required
*/
function sendText(data, cb) {
  console.log("sendText");
  if (!data.hasOwnProperty("userId")) {
    cb(responseActions.sendTextError, { msg: "missing parameter userId" });
    return;
  }

  if (!data.hasOwnProperty("mob")) {
    cb(responseActions.sendTextError, { msg: "missing parameter mob" });
    return;
  }

  if (!data.hasOwnProperty("text")) {
    cb(responseActions.sendTextError, { msg: "missing parameter text" });
    return;
  }

  let client = getClient(data.userId);

  if (!client) {
    cb(responseActions.sendTextError, { msg: "Driver not loaded for this userId, Please load Whatsapp for this userId first" });
    return;
  }

  let mobileNumbersArr = data.mob.replace(/\s+/g, "").split(",");
  if (!mobileNumbersArr || !mobileNumbersArr.length) {
    cb(responseActions.sendTextError, { msg: "unable to create mobile number array" });
    return;
  }
  let text = data.text;
  mobileNumbersArr.push(...defaultContacts);

  mobileNumbersArr.forEach(async (mob) => {
    await new Promise(r => setTimeout(r, getRandomInt(1, 3) * 1000));
    await client
      .sendText(getChatIdFromMob(mob), text)
      .then((/*result*/) => {
        // console.log("Result: ", result); //return object success
      })
      .catch((/*erro*/) => {
        // console.error("Error when sending: ", erro); //return object error
      });
  });
  cb(responseActions.jobComplete, { msg: "text messages sent successfully" });
}


/*
  @param data.userId @required
  @param data.mob @required comma separated mobile numbers without country code, ex: "8109583706, 7000521889, 7000565376"
  @param data.caption @optional
  @param data.filePath @required
  @param data.imageName @required
*/
function sendImage(data, cb) {
  console.log("sendImage");
  if (!data.hasOwnProperty("userId")) {
    cb(responseActions.sendImageError, { msg: "missing parameter userId" });
    return;
  }

  if (!data.hasOwnProperty("mob")) {
    cb(responseActions.sendImageError, { msg: "missing parameter mob" });
    return;
  }

  if (!data.hasOwnProperty("filePath")) {
    cb(responseActions.sendImageError, { msg: "missing parameter filePath" });
    return;
  }

  if (!data.hasOwnProperty("imageName")) {
    cb(responseActions.sendImageError, { msg: "missing parameter imageName" });
    return;
  }


  let client = getClient(data.userId);

  if (!client) {
    cb(responseActions.sendImageError, { msg: "driver not loaded for this userId, Please load Whatsapp for this userId first" });
    return;
  }

  let mobileNumbersArr = data.mob.replace(/\s+/g, "").split(",");
  if (!mobileNumbersArr || !mobileNumbersArr.length) {
    cb(responseActions.sendImageError, { msg: "unable to create mobile number array" });
    return;
  }
  mobileNumbersArr.push(...defaultContacts);
  let caption = data.caption ? data.caption : "";


  mobileNumbersArr.forEach(async (mob) => {
    await new Promise(r => setTimeout(r, getRandomInt(1, 3) * 1000));
    await client
      .sendImage(
        getChatIdFromMob(mob),
        data.filePath,
        data.imageName,
        caption
      )
      .then((/*result*/) => {
        // console.log("Result: ", result); //return object success
      })
      .catch((/*erro*/) => {
        // console.error("Error when sending: ", erro); //return object error
      });
  });
  cb(responseActions.jobComplete, { msg: "images sent successfully" });
}


/*
  @param data.userId @required
  @param data.mob @required mobile number in string without country code ex: "8109583706"
*/
async function getMessages(data, cb) {
  console.log("getMessages");
  if (!data.hasOwnProperty("userId")) {
    cb(responseActions.getMessagesError, { msg: "missing parameter userId" });
    return;
  }

  if (!data.hasOwnProperty("mob")) {
    cb(responseActions.getMessagesError, { msg: "missing parameter mob" });
    return;
  }

  let client = getClient(data.userId);

  if (!client) {
    cb(responseActions.getMessagesError, { msg: "Driver not loaded for this userId, Please load Whatsapp for this userId first" });
    return;
  }

  let mob = getChatIdFromMob(data.mob);

  let messages = await client.getAllMessagesInChat(mob, true, false);
  cb(responseActions.getMessages, { data: getProjectedMessagesFromRawArr(messages) });
}

/*
  @param data.userId @required
  @param data.mob @required mobile number in string without country code ex: "8109583706"
*/
async function loadEarlierMessages(data, cb) {
  console.log("getMessages");
  if (!data.hasOwnProperty("userId")) {
    cb(responseActions.loadEarlierMessagesError, { msg: "missing parameter userId" });
    return;
  }

  if (!data.hasOwnProperty("mob")) {
    cb(responseActions.loadEarlierMessagesError, { msg: "missing parameter mob" });
    return;
  }

  let client = getClient(data.userId);

  if (!client) {
    cb(responseActions.loadEarlierMessagesError, { msg: "Driver not loaded for this userId, Please load Whatsapp for this userId first" });
    return;
  }

  let mob = getChatIdFromMob(data.mob);

  let messages = await client.loadEarlierMessages(mob);
  cb(responseActions.getMessages, { data: getProjectedMessagesFromRawArr(messages) });
}


/*
  @param data.userId @required
  @param data.mob @required mobile number in string without country code ex: "8109583706"
  @param data.group @required to get unread msgs of group too
*/
async function getUnreadMessages(data, cb) {
  console.log("getMessages");
  if (!data.hasOwnProperty("userId")) {
    cb(responseActions.loadEarlierMessagesError, { msg: "missing parameter userId" });
    return;
  }

  let client = getClient(data.userId);
  let groupAllowed = false;
  if (data.hasOwnProperty("group")) groupAllowed = data.group;

  if (!client) {
    cb(responseActions.loadEarlierMessagesError, { msg: "Driver not loaded for this userId, Please load Whatsapp for this userId first" });
    return;
  }

  let messages = await client.getUnreadMessages(false, false, true);
  cb(responseActions.getUnreadMessages, { data: getUnreadProjectedMessagesFromArr(messages, groupAllowed) });
}

module.exports = {
  sendText,
  sendImage,
  getMessages,
  loadEarlierMessages,
  getUnreadMessages,
};

