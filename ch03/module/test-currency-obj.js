var Currency = require('./currency-obj'); 
var canadianDollar = 0.91;
var currency = new Currency(canadianDollar);

console.log('50 Canadian dollars equals this amount of US dollars:');
console.log(currency.canadianToUS(50));

console.log('30 US dollars equals this amount of Canadian dollars:');
console.log(currency.USToCanadian(30));
