function stringToBoolean(str) {
    let bool = undefined
    if ( str === 'true' ) bool = true;
    if ( str === 'false' ) bool = false;
  
    return bool;
  }
  
module.exports = stringToBoolean  