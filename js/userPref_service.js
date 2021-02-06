"use strict";
var gUser;
const KEY = "userData";
var gForecasts = [
  `You could be given a wonderful opportunity to share what you think with people who can make a difference in your world. Their fixed ideas about what is right are starting to loosen up, and they are in an unusually receptive frame of mind. In fact, they are looking for someone who can articulate a better way of doing things. Is that someone you? The only way to find out is to contribute to the discussion. Don't sit back in the corner, this time. Sit up front and make your points.`,
  `When you feel a jolt of social electricity hit you today, go with it. Don't be too rigid and try to figure out why you're feeling this burst of conviviality, just enjoy it! You're starting to see someone in a whole new light, and chances are that they're starting to see you in a new light as well. Isn't it time that you two planned some alone time together? Keep it light and casual. You're ready to find out what makes them tick.`,
  `The person you are worried about right now needs your patience and support more than anything, so give them the space they're asking for. Don' be too demanding of them about coming clean with all their innermost feelings. If they don't feel like sharing, that doesn't mean they don't trust you. It might just mean that they don't even know how they feel yet. They need to process things, and you need to let them do it. You'll be the first one they call when they're ready to talk.`,
  `Save all of your outrageous antics for another time. Today you want to keep things low-key. Ironically, being subdued will end up getting you a lot more attention than being flashy would. Being loud and flamboyant is a problem right now. It could jar people too much and cause them to focus on the wrong aspects of your personality. It's your quiet confidence that will really help people understand what you're all about and what you bring to the table.`,
];

function setUserPrefs() {
  //Prevent change of gUser if user didn't fill the required boxes
  var item = submitPrefs();
  if (item) {
    if (!item.name || !item.email || !item.dateOfBirth) {
      return;
    }
  }
  localStorage.removeItem(KEY);
  gUser = submitPrefs();
  console.log("after remove ", gUser);
  _saveUserToStorage();
}

function submitPrefs() {
  var elName = document.getElementById("name");
  var elEmail = document.querySelector("[name=email]");
  var elAge = document.querySelector("[name=age]");
  var elDob = document.querySelector("[name=dob]");
  var elTob = document.querySelector("[name=tob]");
  var elColor = document.querySelector("[name=color]");
  return {
    name: elName.value,
    email: elEmail.value,
    age: elAge.value,
    dateOfBirth: elDob.value,
    timeOfBirth: elTob.value,
    favColor: elColor.value,
  };
}

function showAge(newVal) {
  document.getElementById("sAge").innerHTML = newVal;
}

function _saveUserToStorage() {
  saveToStorage(KEY, gUser);
}

function getBgc() {
  var user = loadFromStorage(KEY);
  return user.favColor;
}

function setHoroscope() {
  var user = loadFromStorage(KEY);
  var userDob = user.dateOfBirth;
  var dobArray = userDob.split("-");
  if (+dobArray[1] <= 3 && +dobArray[1] >= 1) {
    return gForecasts[0];
  } else if (+dobArray[1] <= 6 && +dobArray[1] >= 4) {
    return gForecasts[1];
  } else if (+dobArray[1] <= 9 && +dobArray[1] >= 7) {
    return gForecasts[2];
  } else {
    return gForecasts[3];
  }
}

function setUsersIndexPage() {
  gUser = loadFromStorage(KEY);
  var elIndexBody = document.querySelector(".main-body");
  var elForecastBody = document.querySelector(".forecast");
  var elForecastParagraph = document.querySelector(".daily-forecast");
  var elUserName = document.querySelector(".users-name");
  if (gUser) {elUserName.innerText = gUser.name;
  elForecastBody.style.display = "inline-block";
  elForecastParagraph.innerText = setHoroscope();
  elIndexBody.style.backgroundColor = getBgc();}
}
