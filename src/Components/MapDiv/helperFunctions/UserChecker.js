/************************************************************
FUNCTION TO FILTER USER LIST TO REVEAL ONLY IP ADDRESSES. 
*************************************************************/

export default function UserChecker(userObj){
  var userName = userObj.user; 
  // Check to see if its an IPv6. These contain ':' whereas wikipedia username cannot have colons. 
  if(userName.indexOf(':') != -1){
    return true; 
  }   
  // What about periods. An IPv4 contains only numbers and period. This is not a valid wikipedia username. 
  else if(userName.indexOf(".") != -1){
    // If its all numbers and periods, its an IP! 
    var letterReg = /[A-Z]/i; 
    if(userName.search(letterReg) == -1){
      return true; 
    }
    else{
      return false
    }
  }
  else{
    return false
  }
}
