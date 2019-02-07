# RN-Tracker

## Installation

Install [`RN-Tracker`](https://github.com/rizkyrnldy/RN-Tracker)
```sh
npm install rn-tracker@latest --save

react-native link rn-tracker
```
Install [`react-native-background-timer`](https://github.com/ocetnik/react-native-background-timer) for service in background 
```sh
npm install react-native-background-timer --save

react-native link react-native-background-timer
```
Edit <b>config.js</b> <small>(File in: YOUR_PROJECT/node_module/rn-tracker/config.js)</small>
```sh
var config = {
  ip: '######', //Your IP Address for API
  timeInterval: 5000, //Time Interval for Get Location
}

module.exports = config;
```

Add Permission Access Location in <b>AndroidManifest</b>:
```sh
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## General Usages
#### Import Module
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


