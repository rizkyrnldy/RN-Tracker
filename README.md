# RN-Tracker

## Installation

1. ```sh
  npm install rn-tracker --save
  ```
2. Install [`react-native-background-timer`](https://github.com/ocetnik/react-native-background-timer)
```sh
  npm install react-native-background-timer --save
  
  react-native link
  ```
3. Edit <b>config.js</b>
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
  id_shipping: YOUR ID,
  btn: true,
});
```

#### Pickup / Pause Tracker
```sh
RNTracker.pickup({
  id_shipping: YOUR ID,
  btn: true,
});
```


#### Stop Tracker
```sh
RNTracker.stop({
  id_shipping: YOUR ID,
  btn: true,
});
```


## Example

[`Click Here`](https://github.com/rizkyrnldy/RN-Tracke/blob/master/example.js)


