const request = require('request');
const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let obj = JSON.parse(body);
    let IP = obj.ip;
    callback(null, IP);
  });
};
const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);

      return;
    }
    const { latitude, longitude } = JSON.parse(body).data;
    callback(null, { latitude, longitude });
  });
};
const fetchISSFlyOverTimes = (coords, callback) => {

  request(`http://api.open-notify.org/iss-pass.json?lat=${Number(coords.latitude)}&lon=${Number(coords.longitude)}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);

      return;
    }
    const timeArray = JSON.parse(body).response;
    // console.log(body)
    callback(null, timeArray);
  });
};
const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error,ip)=>{
    if(error){
      return callback(error,null);
    }
    fetchCoordsByIP(ip,(error,location)=>{
      if(error){
        return callback(error,null)
      }
      fetchISSFlyOverTimes(location,(error,timeArray)=>{
        if(error){
          return callback(error,null);
        }
        callback(null,timeArray)
      })
    })
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes,nextISSTimesForMyLocation };