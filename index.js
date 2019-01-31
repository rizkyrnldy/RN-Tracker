'use strict';
import { ToastAndroid, AsyncStorage } from 'react-native';
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
                tripApi.trip(lat, lng, status, params.id_shipping).then((response) => {
                    intervalId = BackgroundTimer.setInterval(() => {
                        this.process(params.id_shipping);
                    }, config.timeInterval);
                });
            } else {
                intervalId = BackgroundTimer.setInterval(() => {
                    this.process(params.id_shipping);
                }, config.timeInterval);
            }
            AsyncStorage.setItem('@status:key', 'true');
            ToastAndroid.show('Start', ToastAndroid.SHORT);
        }, (error) => {
            ToastAndroid.show('Failed Connected', ToastAndroid.SHORT);
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
            tripApi.trip(lat, lng, status, params.id_shipping).then((response) => {
                ToastAndroid.show('Stop', ToastAndroid.SHORT);
            });
            ToastAndroid.show('Pickup Success', ToastAndroid.SHORT);

        }, (error) => {
            ToastAndroid.show('Failed Connected', ToastAndroid.SHORT);
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
                tripApi.trip(lat, lng, status, params.id_shipping).then((response) => {
                    ToastAndroid.show('Stop', ToastAndroid.SHORT);
                });
            }
            AsyncStorage.setItem('@status:key', 'false');
            BackgroundTimer.clearInterval(intervalId);
            ToastAndroid.show('Stop', ToastAndroid.SHORT);

        }, (error) => {
            ToastAndroid.show('Failed Connected', ToastAndroid.SHORT);
        },
            { enableHighAccuracy: true, timeout: config.timeInterval }
        );
    }


    static process(id_shipping) {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = JSON.stringify(position.coords.latitude);
            var lng = JSON.stringify(position.coords.longitude);
            var status = 'otw';
            tripApi.trip(lat, lng, status, id_shipping).then((response) => {
                ToastAndroid.show('lat: ' + JSON.stringify(position.coords.latitude) + ', ' + 'lng: ' + JSON.stringify(position.coords.longitude), ToastAndroid.SHORT);
            });
        }, (error) => {
            ToastAndroid.show('Failed Connected', ToastAndroid.SHORT);
            console.log(error);
        },
            { enableHighAccuracy: true, timeout: config.timeInterval }
        );
    }

}
