//const WEATHER_API_KEY="826dcb4136377ee833301c710e976bf3";
//const API_KEY="3cc21538ca264cde81fc62b6e78ad6c3";

export const setLocationObject=(locationObj,coordObj)=>
{
    const{lat,lon,name,unit}= coordObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
     if(unit)
     {
        locationObj.setUnit(unit);
     }
};

export const getHomeLocation=()=>
{
    return localStorage.getItem("defausltWeatherLocation");
}
 export const cleanText=(text)=>
{
    const regex=/{2, }/g;
    const entryText=text.replaceAll(regex," ").trim();
    return entryText;
}; 
export const getCoordsApi=async (entryText,units)=>
{

    const regex=/^\d+$/g;
    const flag=regex.test(entryText) ?"zip":"q";
    const url=`https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
    const encodedUrl = encodeURI(url);
    try {
      const dataStream = await fetch(encodedUrl);
        const jsondata= await dataStream.json();
        return jsondata;
    }
    catch(err)
    {
        console.log(err.stack);
    }
};
 export const getcurWeatherFromCoord=async(locationObj)=>
{
    const lat=locationObj.getLat();
    const lon=locationObj.getLon();
    const units=locationObj.getUnit();


 const url =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units} &appid=${WEATHER_API_KEY}`;
    try {
        const weathercurStream = await fetch(url);
        const weathercurJson= await weathercurStream.json();
        return weathercurJson;
      
    }catch(err){
       console.log(err);
    }

};   
 export const  getWeatherFromCoord =async(locationObj)=>
{   
    const lat=locationObj.getLat();
    const lon=locationObj.getLon();
    const units=locationObj.getUnit();
   // const url=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    //const url=`https:// api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt={cnt}&appid=${WEATHER_API_KEY}`
   //const url=`api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
    const url=`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&units=${units}&days=7&key=${API_KEY}`
    try {
        const weatherStream = await fetch(url);
        const weatherJson= await weatherStream.json();
        return weatherJson;
       
    }catch(err){
       console.log(err);
    }
};   
