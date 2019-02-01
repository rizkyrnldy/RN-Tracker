# RN-Tracker

## Installation

Install [`RN-Tracker`](https://github.com/rizkyrnldy/RN-Tracker)
```sh
npm install rn-tracker --save
```
Install [`react-native-background-timer`](https://github.com/ocetnik/react-native-background-timer) for service in background 
```sh
npm install react-native-background-timer --save

react-native link react-native-background-timer
```
Edit <b>config.js</b>
```sh
var config = {
  ip: 'http://123.123.123:8000', //Your IP Address for API
  timeInterval: 5000, //Timer
}

module.exports = config;
```

## General Usages
#### Import module
```sh
import RNTracker from 'rn-tracker';
```

#### Start Tracker
```sh
RNTracker.start({
  shipment_code: YOUR ID,
  member_code: YOUR ID,
  btn: true,
});
```

#### Pickup / Pause Tracker
```sh
RNTracker.pickup({
  shipment_code: YOUR ID,
  member_code: YOUR ID,
  btn: true,
});
```


#### Stop Tracker
```sh
RNTracker.stop({
  shipment_code: YOUR ID,
  member_code: YOUR ID,
  btn: true,
});
```


## Example

[`Click Here`](https://github.com/rizkyrnldy/RN-Tracker/blob/master/example.js)


