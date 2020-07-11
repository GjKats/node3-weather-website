const request = require('request');

const forecast = (lat, long, callback) => {

    const url = 'http://api.weatherstack.com/current?access_key=12eff8c8cf91a8c976ebe2848ca382e6&query=' +
        encodeURIComponent(long) +
        ',' +
        encodeURIComponent(lat) +
        '&units=f';

    request({url: url, json: true}, (error, response) => {
        if(error){
            callback("Unable to connect to weather service", undefined);
        }else if(response.body.error){
            callback("Unable to find location", undefined);
        }else{
            const {temperature} = response.body.current;
            const d = "It is currently " + temperature + ".";
            callback(undefined, d)
        }
    })
}

module.exports = forecast;