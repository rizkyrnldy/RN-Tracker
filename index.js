'use strict';
import { ToastAndroid, AsyncStorage} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import tripApi from './api/post';
import config from './config';

let intervalId = null;
export default class RNTracker {
    static start(params) {
        ToastAndroid.show('Loading...', ToastAndroid.SHORT);
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = JSON.stringify(position.coords.latitude);
            var lng = JSON.stringify(position.coords.longitude);
            var status = 'start';
            if (params.btn !== undefined && params.btn) {
                tripApi.Trip(lat, lng, status, params).then((response) => {
                    intervalId = BackgroundTimer.setInterval(() => {
                        this.process(params);
                    }, config.timeInterval);
                });
            } else {
                intervalId = BackgroundTimer.setInterval(() => {
                    this.process(params);
                }, config.timeInterval);
            }
            AsyncStorage.setItem('@status:key', 'true');
            ToastAndroid.show('Start', ToastAndroid.SHORT);
        }, (error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        },
            { enableHighAccuracy: true, timeout: config.timeInterval }
        );
    }

    static pickup(params) {
        ToastAndroid.show('Loading...', ToastAndroid.SHORT);
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = JSON.stringify(position.coords.latitude);
            var lng = JSON.stringify(position.coords.longitude);
            var status = 'pickup';
            tripApi.Trip(lat, lng, status, params).then((response) => {
                ToastAndroid.show('Pickup Success', ToastAndroid.SHORT);
            });
        }, (error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        },
            { enableHighAccuracy: true, timeout: config.timeInterval }
        );
    }


    static stop(params) {
        ToastAndroid.show('Loading...', ToastAndroid.SHORT);
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = JSON.stringify(position.coords.latitude);
            var lng = JSON.stringify(position.coords.longitude);
            var status = 'stop';
            if (params !== undefined && params.btn) {
                tripApi.Trip(lat, lng, status, params).then((response) => {
                    ToastAndroid.show('Stop', ToastAndroid.SHORT);
                });
            }
            AsyncStorage.setItem('@status:key', 'false');
            BackgroundTimer.clearInterval(intervalId);
            navigator.geolocation.clearWatch(intervalId);
            ToastAndroid.show('Stop', ToastAndroid.SHORT);

        }, (error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        },
            { enableHighAccuracy: true, timeout: config.timeInterval }
        );
    }


    static process(params) {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = JSON.stringify(position.coords.latitude);
            var lng = JSON.stringify(position.coords.longitude);
            var status = 'otw';
            tripApi.Trip(lat, lng, status, params).then((response) => {
                ToastAndroid.show('lat: ' + JSON.stringify(position.coords.latitude) + ', ' + 'lng: ' + JSON.stringify(position.coords.longitude), ToastAndroid.SHORT);
            });
        }, (error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        },
            { enableHighAccuracy: true, timeout: config.timeInterval }
        );
    }

}
