export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar_text");
  window.innerWidth < 547
    ? (input.placeholder = "city ,state,Country")
    : (input.placeholder = "city ,state,Country or Zip Code");
};
export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};
const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocation(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};
export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);
  updateWeatherLocation(properMsg);
  updateScreenReaderConfirmation(`${properMsg}.please try again`);
};
const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join("");
};
const updateWeatherLocation = (message) => {
  const h2 = document.getElementById("currentforecast_location");
  if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
    const msgArray = message.split(" ");
    const mapArray = msgArray.map((msg) => {
      return msg.replace(":", ": ");
    });
    const lat =
      mapArray[0].indexOf("-") === -1
        ? mapArray[0].slice(0, 10)
        : mapArray[0].slice(0, 11);
    const lon =
      mapArray[0].indexOf("-") === -1
        ? mapArray[1].slice(0, 11)
        : mapArray[1].slice(0, 12);
    h2.textContent = `${lat}•${lon}`;
  } else {
    h2.textContent = message;
  }
};
export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message;
};
export const updateDisplay = (weatherJson, locationObj,weatherSixJson) => {
  fadeDisplay();
  cleardisplay();
  const weatheClass = getWeatherClass(weatherJson.weather[0].icon);
  setBGImage(weatheClass);
  const screenReaderWeather = buildscreenreaderWeather(
    weatherJson,
    locationObj
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocation(locationObj.getName());
  // current conditions
  const ccArray = createCurrentConditionsDivs(
    weatherJson,
    locationObj.getUnit()
  );
  displayCurrentCondition(ccArray);
  //six day forecast
  displaySixdayforecast(weatherSixJson,locationObj.getUnit());
  setFocusOnSearch();
  fadeDisplay();
};
const fadeDisplay = () => {
  const cc = document.getElementById("currentforecast");
  cc.classList.toggle("zero-vis");
  cc.classList.toggle("fade-in");
  const sixDay = document.getElementById("dailyforecast");
  sixDay.classList.toggle("zero-vis");
  sixDay.classList.toggle("fade-in");
};
const cleardisplay = () => {
  const currentcondition = document.getElementById("currentforecast_condition");
  deleteContents(currentcondition);
  const sixDayforecast = document.getElementById("forecastday_contents");
  deleteContents(sixDayforecast);
};
const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};
const getWeatherClass = (icon) => {
  const firstTwoChars = icon.slice(0, 2);
  const lastchar = icon.slice(2);
  const weatherlookup = {
    "09": "snow",
    10: "rain",
    11: "rain",
    13: "snow",
    50: "fog",
  };
  let weatherClass;
  if (weatherlookup[firstTwoChars]) {
    weatherClass = weatherlookup[firstTwoChars];
  } else if (lastchar === "d") {
    weatherClass = "clouds";
  } else {
    weatherClass = "night";
  }
  return weatherClass;
};
const setBGImage = (weatheClass) => {
  document.documentElement.classList.add(weatheClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatheClass) document.documentElement.classList.remove(img);
  });
};
const buildscreenreaderWeather = (weathercurJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const tempUnit = unit === "imperial" ? "F" : "C";
  return `${weathercurJson.weather[0].description} and ${Math.round(
    Number(weathercurJson.main.temp)
  )}°${tempUnit} in ${location}`;
};
const setFocusOnSearch = () => {
  document.getElementById("searchBar_text").focus();
};
const createCurrentConditionsDivs = (weatherObj, unit) => {
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const icon = createMainImgDiv(
    weatherObj.weather[0].icon,
    weatherObj.weather[0].description
  );
  const temp = createElem(
    "div",
    "temp",
     (tempUnit==="C") ? `${Math.round(Number(weatherObj.main.temp))}°` : `${Math.round(Number(weatherObj.main.temp))}`

  );
  const properDesc = toProperCase(weatherObj.weather[0].description);  
  const desc = createElem("div", "desc", properDesc);
  const feels = createElem(
    "div",
    "feels",
    (tempUnit==="C") ? `Feels Like ${Math.round(Number(weatherObj.main.feels_like))}°`:`Feels Like ${Math.round(Number(weatherObj.main.feels_like))}`
  );
  const maxTemp = createElem(
    "div",
    "maxtemp",
    (tempUnit==="C") ? `High ${Math.round(Number(weatherObj.main.temp_max))}°` : `High ${Math.round(Number(weatherObj.main.temp_max))}`
  );
  const minTemp = createElem(
    "div",
    "mintemp",
    (tempUnit==="C") ? `Low ${Math.round(Number(weatherObj.main.temp_min))}°`: `Low ${Math.round(Number(weatherObj.main.temp_min))}`
  );
  const humidity = createElem(
    "div",
    "humidity",
    `Humidity ${weatherObj.main.humidity}%`
  );
  const wind = createElem(
    "div",
    "wind",
    `Wind ${Math.round(Number(weatherObj.wind.speed))} ${windUnit}`
  );
  return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "icon";
  const faIcon = translateIcontoFontAwesome(icon);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
};
const createElem = (elemtype, divclassName, divtext, unit) => {
  const div = document.createElement(elemtype);
  div.className = divclassName;
  if (divtext) {
    div.textContent = divtext;
  }
  if (divclassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.classList.add("unit");
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};
const translateIcontoFontAwesome = (icon) => {
  const i = document.createElement("i");
  const firstTwoChars = icon.slice(0, 2);
  const lastChar = icon.slice(2);
  switch (firstTwoChars) {
    case "01":
      if (lastChar === "d") {
        i.classList.add("far", "fa-sun");
      } else {
        i.classList.add("far", "fa-moon");
      }
      break;
    case "02":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun");
      } else {
        i.classList.add("fas", "fa-cloud-moon");
      }
      break;
    case "03":
      i.classList.add("fas", "fa-cloud");
      break;
    case "04":
      i.classList.add("fas", "fa-cloud-meatball");
      break;
    case "09":
      i.classList.add("fas", "fa-cloud-rain");
      break;
    case "10":
      if (lastChar === "d") {
        i.classList.add("fas", "fa-cloud-sun-rain");
      } else {
        i.classList.add("fas", "fa-cloud-moon-rain");
      }
      break;
    case "11":
      i.classList.add("fas", "fa-poo-storm");
      break;
    case "13":
      i.classList.add("far", "fa-snowflake");
      break;
    case "50":
      i.classList.add("fas", "fa-smog");
      break;
    default:
      i.classList.add("far", "fa-question-circle");
  }
  return i;
};

const displayCurrentCondition = (currentconditionArray) => {
  const ccContainer = document.getElementById("currentforecast_condition");
  currentconditionArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};

const displaySixdayforecast=(weatherSixJson,unit)=>
{
  for(let i=1;i<=6;i++)
  {
    const dfArray=createDailyForecastDiv(weatherSixJson.data[i],unit);
    displayDailyforecast(dfArray);
  }  
};
const createDailyForecastDiv=(dayWeather,unit)=>
{  
  const tempUnit = unit === "imperial" ? "F" : "C";
  const windUnit = unit === "imperial" ? "mph" : "m/s";
  const dayAbbreviationText=getDayAbbreviation(dayWeather.datetime);
  const dayabbreviation=createElem("p","dayabbrevtion",dayAbbreviationText);
  const dayIcon=createDailyforecastIcon(dayWeather.weather.icon,dayWeather.weather.description);
  const dayHigh=createElem("p","dayhigh", (tempUnit==="F") ? `${Math.round(Number(dayWeather.max_temp))}`:`${Math.round(Number(dayWeather.max_temp))}°`);
  const dayLow=createElem("p","daylow",(tempUnit==="F") ?`${Math.round(Number(dayWeather.min_temp))}`: `${Math.round(Number(dayWeather.min_temp))}°`);
  return [dayabbreviation,dayIcon,dayHigh,dayLow];
};
const getDayAbbreviation=(date)=>
{
   const dateobj=new Date(date);
   const utcstring=dateobj.toUTCString();
  return utcstring.slice(0,3).toUpperCase();
};
const createDailyforecastIcon=(icon,alttext)=>
{   icon=icon.slice(1,4);
  //console.log(icon);
  const img=document.createElement("img");
 if(window.innerWidth<768  || window.innerWidth<102)
  {
   img.src=`https://openweathermap.org/img/wn/${icon}.png`;
 }
  else 
  {
    img.src=`https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
  img.alt=alttext;
  return img;
};
const displayDailyforecast=(dfArray)=>
{
   const dayDiv =createElem("div","forecastday");
   dfArray.forEach(el=>
    {
      dayDiv.appendChild(el);
    });    
      const dailyforecastcontainer=document.getElementById("forecastday_contents");
      dailyforecastcontainer.appendChild(dayDiv);
}
