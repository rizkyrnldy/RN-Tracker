'use strict';
import { NativeModules, ToastAndroid, AsyncStorage } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import tripApi from 'rn-tracker/api/post';
import config from './config';
const { RNTGEO } = NativeModules;

var intervalId = null;
let del_ = null;
let count = 1;
export default class RNTracker {

    static start(params) {
        // delete
        del_ = BackgroundTimer.runBackgroundTimer(() => {
            console.log(count);
            count++;
        }, 1000);

        ToastAndroid.show('Loading Start...', ToastAndroid.SHORT);
        this.getLocation(
            (position) => {
                var lat = JSON.stringify(position.coords.latitude);
                var lng = JSON.stringify(position.coords.longitude);
                var status = 'start';
                if (params.btn !== undefined && params.btn) {
                    tripApi.Trip(lat, lng, status, params).then((response) => {
                        intervalId = BackgroundTimer.runBackgroundTimer(() => {
                            this.process(params);
                        }, config.timeInterval);
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
        ToastAndroid.show('Loading Pickup...', ToastAndroid.SHORT);
        this.getLocation(
            (position) => {
                var lat = JSON.stringify(position.coords.latitude);
                var lng = JSON.stringify(position.coords.longitude);
                var status = 'pickup';
                tripApi.Trip(lat, lng, status, params).then((response) => {
                    ToastAndroid.show('Pickup Success', ToastAndroid.SHORT);
                });
            }, (error) => console.log('This is the error ', error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }


    static stop(params) {
        ToastAndroid.show('Loading Stop...', ToastAndroid.SHORT);
        this.getLocation(
            (position) => {
                var lat = JSON.stringify(position.coords.latitude);
                var lng = JSON.stringify(position.coords.longitude);
                var status = 'stop';
                if (params !== undefined && params.btn) {
                    tripApi.Trip(lat, lng, status, params).then((response) => {
                        ToastAndroid.show('Stop', ToastAndroid.SHORT);
                    });
                }
                // delete
                BackgroundTimer.clearInterval(del_);
                BackgroundTimer.stopBackgroundTimer(intervalId);

                AsyncStorage.setItem('@status:key', 'false');
                ToastAndroid.show('Stop', ToastAndroid.SHORT);

            }, (error) => console.log('This is the error ', error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }


    static process(params) {
        this.getLocation(
            (position) => {
                console.log(position);
                var lat = JSON.stringify(position.coords.latitude);
                var lng = JSON.stringify(position.coords.longitude);
                var status = 'otw';
                tripApi.Trip(lat, lng, status, params).then((response) => {
                    ToastAndroid.show('lat: ' + JSON.stringify(position.coords.latitude) + ', ' + 'lng: ' + JSON.stringify(position.coords.longitude), ToastAndroid.SHORT);
                });

            }, (error) => console.log('This is the error ', error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    static getLocation(onSuccess, onError, options) {
        RNTGEO.getCurrentPosition(options.timeout, options.maximumAge, options.enableHighAccuracy, onSuccess, onError);
    }

}
