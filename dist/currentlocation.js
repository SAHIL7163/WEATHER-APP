export default class CurrentLocation{
    constructor()
    {
        this._name="Current Location";
        this._lat=null;
        this._lon=null;
        this._unit="imperical";
    }
    getName(){
        return this._name;
        
    }
    setName(name){
        this._name=name;
    }

    getLat()
    {
        return this._lat;
    }
    setLat(lat)
    {
        this._lat=lat;
    }
    getLon(){
        return this._lon;
    }
    setLon(lon)
    {   
         this._lon=lon;
    }
    getUnit()
    {
        return this._unit;
    }
    setUnit(unit)
    {
        return this._=unit;
    }
    toggleUnit(){
        this._unit=this._unit==="imperial"?"metric":"imperial";
    }
}