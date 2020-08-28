const request = require('request-promise-native');
const fetchMyIP = ()=>{
  return request('https://api.ipify.org?format=json')
};
const fetchCoordsByIP = (body)=>{
  const ip = JSON.parse(body).ip;
  return request(`https://ipvigilante.com/${ip}`)
};
const fetchISSFlyOverTimes = (body)=>{
  const { latitude, longitude } = JSON.parse(body).data;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${Number(latitude)}&lon=${Number(longitude)}`)
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    })

}
module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes,nextISSTimesForMyLocation };
