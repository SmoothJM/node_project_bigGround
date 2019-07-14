var str = 'public\\upload\\v87WJMSAcsCGeAgis4jFOIH7.ico';
var arr = str.split("\\");
console.log(arr);
const path = require('path');
str = path.join(arr[1],arr[2]);
console.log(str);