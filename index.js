'use strict';
import { NativeModules, ToastAndroid, AsyncStorage } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import tripApi from 'rn-tracker/api/post';
import config from './config';
const { RNTGEO } = NativeModules;

var intervalId = null;
var listLocation = [];
export default class RNTracker {

    static start(params) {
        this.getLocation(
            (position) => {
                let location = {
                    'lat': JSON.stringify(position.coords.latitude),
                    'lng': JSON.stringify(position.coords.longitude)
                };
                var status = 'start';
                if (params.btn !== undefined && params.btn) {
                    tripApi.TripArray(JSON.stringify(location), location.lat, location.lng, status, params).then((response) => {
                        intervalId = BackgroundTimer.runBackgroundTimer(() => {
                            this.process(params);
                        }, config.timeInterval);
                        ToastAndroid.show('Start Success', ToastAndroid.SHORT);
                    });
                } else {
                    intervalId = BackgroundTimer.runBackgroundTimer(() => {
                        this.process(params);
                    }, config.timeInterval);
                }
                AsyncStorage.setItem('@status:key', 'true');
            }, (error) => console.log('This is the error ', error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

    }

    static pickup(params) {
        this.getLocation(
            (position) => {
                let location = {
                    'lat': JSON.stringify(position.coords.latitude),
                    'lng': JSON.stringify(position.coords.longitude)
                };
                var status = 'pickup';
                tripApi.TripArray(JSON.stringify(location), location.lat, location.lng, status, params).then((response) => {
                    ToastAndroid.show('Pickup Success', ToastAndroid.SHORT);
                });
            }, (error) => console.log('This is the error ', error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }


    static stop(params) {
        this.getLocation(
            (position) => {
                let location = {
                    'lat': JSON.stringify(position.coords.latitude),
                    'lng': JSON.stringify(position.coords.longitude)
                };
                AsyncStorage.getItem('@status:location', (err, result) => {
                    let data = {
                        'result': result,
                        'lat': location.lat,
                        'lng': location.lng,
                        'status': 'otw',
                        'params': params
                    }
                    if (params !== undefined && params.btn) {
                        this.pushData(data).then((res) => {
                            tripApi.TripArray(JSON.stringify(location), data.lat, data.lng, 'stop', data.params).then((response) => {
                                ToastAndroid.show('Stop Success', ToastAndroid.SHORT);
                            });
                        });
                    }
                });
                BackgroundTimer.stopBackgroundTimer(intervalId);
                AsyncStorage.setItem('@status:key', 'false');
            }, (error) => console.log('This is the error ', error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    static process(params) {
        this.getLocation((position) => {
            let location = {
                'lat': JSON.stringify(position.coords.latitude),
                'lng': JSON.stringify(position.coords.longitude)
            };
            listLocation.push(location);
            AsyncStorage.setItem('@status:location', JSON.stringify(listLocation));
            AsyncStorage.getItem('@status:location', (err, result) => {
                if (result !== null || result !== undefined) {
                    let _lengtLocation = JSON.parse(result).length;
                    let data = {
                        'result': result,
                        'lat': location.lat,
                        'lng': location.lng,
                        'status': 'otw',
                        'params': params
                    }
                    console.log(result);
                    if (_lengtLocation === 10) {
                        this.pushData(data);
                    }
                }
            });
        }, (error) => console.log('This is the error ', error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

    }
    static pushData(data) {
        return tripApi.TripArray(data.result, data.lat, data.lng, data.status, data.params).then((response) => {
            AsyncStorage.removeItem('@status:location');
            listLocation = [];
            ToastAndroid.show('Push Data Success', ToastAndroid.SHORT);
        });
    }

    static getLocation(onSuccess, onError, options) {
        RNTGEO.getCurrentPosition(options.timeout, options.maximumAge, options.enableHighAccuracy, onSuccess, onError);
    }

}