import {setLocationObject , 
    getHomeLocation,
    cleanText,
    getCoordsApi,
  getcurWeatherFromCoord,
    getWeatherFromCoord
} from "./datafunction.js";

import { 
    setPlaceholderText,
    addSpinner,
    displayError,
    updateScreenReaderConfirmation,
    displayApiError,
   updateDisplay
} from "./domfunction.js"
import CurrentLocation from "./currentlocation.js";
const currentLoc=new CurrentLocation();

const initApp = () =>{
    //add listners

    const geobutton=document.getElementById("getLocation");
    geobutton.addEventListener("click",getGeoweather);
    const homebutton=document.getElementById("Home");
    homebutton.addEventListener("click",loadweather);
    const savedButton=document.getElementById("saveLocation");
    savedButton.addEventListener("click",savelocation);
    const unitButton=document.getElementById("unit");
    unitButton.addEventListener("click",setUnitpref);
    const refreshButton=document.getElementById("refresh");
    refreshButton.addEventListener("click",refreshweather);
  const locationEntry=document.getElementById("searchBar_form");
  locationEntry.addEventListener("submit",submitNewLocation);
    //set up

    //load weather
    setPlaceholderText();

    loadweather();
};
document.addEventListener("DOMContentLoaded",initApp);
const getGeoweather= (event)=>{
    if(event)
    {
        if(event.type==="click"){
             const mapIcon=document.querySelector(".fa-map-marker-alt");
             addSpinner(mapIcon);
        }
       if(!navigator.geolocation) geoError();
        navigator.geolocation.getCurrentPosition(geoSuccess,geoError); 
    }
};
  
const geoError=(errObj)=>
{
    const errMsg=errObj? errObj.message:"Geolocation not supported";
    displayError(errMsg,errMsg);
}
const geoSuccess=(position)=>
{
    const mycoordsObj={
        lat: position.coords.latitude,
        lon:position.coords.longitude,
        name:`Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    };
    //set location object
    setLocationObject(currentLoc,mycoordsObj);
    updateDataandDisplay(currentLoc);
};
const loadweather=(event)=>
{    
    const savedLocation=getHomeLocation();
    if(!savedLocation && !event) return getGeoweather();
     if(!savedLocation && event.type==='click') 
     {
        displayError(
            "No Home Location Saved .","Sorry .Please save your home location first. "
        );
     }
     else if (savedLocation && !event)
     {
        displayHomelocationWeather(savedLocation);
     }
     else{
        const homeIcon=document.querySelector(".fa-home");
        addSpinner(homeIcon);
        displayHomelocationWeather(savedLocation);
     }
};
 const displayHomelocationWeather=(home)=>
{
    if(typeof home==="string")
    {
        const locationJson=JSON.parse(home);
        const mycoordsObj={
            lat:locationJson.lat,
            lon:locationJson.lon,
            name:locationJson.name,
            unit:locationJson.unit
        };
        setLocationObject(currentLoc,mycoordsObj);
        updateDataandDisplay(currentLoc);
    }
};

const savelocation=()=>
{
    if(currentLoc.getLat() && currentLoc.getLon())
    {
        const saveIcon=document.querySelector(".fa-save");
        addSpinner(saveIcon);
        const location={
        name: currentLoc.getName(),
        lat: currentLoc.getLat(),
        lon:currentLoc.getLon(),
        unit:currentLoc.getUnit()
        };
        localStorage.setItem("defaultWeatherLocation",JSON.stringify(location));
        updateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location`);
    }
}; 

 const setUnitpref=()=>
{
    const unitButton=document.querySelector(".fa-chart-bar");
    addSpinner(unitButton);
    currentLoc.toggleUnit();
    updateDataandDisplay(currentLoc);
}; 

/* const setUnitPref = () => {
    const unitIcon = document.querySelector(".fa-chart-bar");
    addSpinner(unitIcon);
    currentLoc.toggleUnit();
    updateDataandDisplay(currentLoc);
  }; */

const refreshweather=()=>
{
    const refreshIcon=document.querySelector(".fa-sync-alt");
    addSpinner(refreshIcon);
    updateDataandDisplay(currentLoc);
}; 
const submitNewLocation=async(event)=>
{
    event.preventDefault();
    const text=document.getElementById("searchBar_text").value;
    const entryText=cleanText(text);
    if(!entryText.length) return;
    const locationIcon=document.querySelector(".fa-search");
    addSpinner(locationIcon);
    const coordsData=await getCoordsApi(entryText,currentLoc.getUnit());
    //work with api data
    if(coordsData){
     if(coordsData.cod===200)
     {
        //successs
        const mycoordsObj={
            lat: coordsData.coord.lat,
            lon: coordsData.coord.lon,
            name:coordsData.sys.country ? `${coordsData.name} ,${coordsData.sys.country}` : coordsData.name,
        };
        setLocationObject(currentLoc,mycoordsObj);
        updateDataandDisplay(currentLoc);
     }
    else 
    {
        displayApiError(coordsData);
    }
}
    else{
displayError("Connection Error","Connection Error");
    }

}
/*  const updateDataandDisplay=async (locationObj)=>
{     
   
   const weathercurjson=await getcurWeatherFromCoord(locationObj);
   console.log(weathercurjson);
    if(weatherjson) updateDisplay(weatherjson,locationObj);
  const weatherjson=await getWeatherFromCoord(locationObj);
}  */
 
const updateDataandDisplay=async (locationObj)=>
{     
   const weathercurjson=await getcurWeatherFromCoord(locationObj);
   console.log(weathercurjson); 
   const weatherjson=await getWeatherFromCoord(locationObj);
   console.log(weatherjson);
   //updateDisplay(weathercurjson,locationObj);
   if(weatherjson) updateDisplay(weathercurjson,locationObj,weatherjson);
};

 