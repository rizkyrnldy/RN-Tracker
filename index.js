'use strict';
import { NativeModules, DeviceEventEmitter, ToastAndroid, AsyncStorage } from 'react-native';
import tripApi from 'rn-tracker/api/post';
import config from './config';
import BackgroundJob from 'react-native-background-job';

const RNTGEO = NativeModules.RNTGEO;
var listLocation = [];
const eventNames = ['fusedLocation', 'fusedLocationError'];
const jobKey = 'RNTGEO-KEY';
export default class RNTracker {

    static async start(params) {
        BackgroundJob.register({
            jobKey: jobKey,
            job: () => this.process(params),
        });
        RNTGEO.startLocationUpdates();
        RNTGEO.setLocationInterval(config.timeInterval);
        RNTGEO.setFastestLocationInterval(config.timeInterval / 2);
        this.getLocation().getFusedLocation().then((res) => {
            let location = {
                'lat': JSON.stringify(res.latitude),
                'lng': JSON.stringify(res.longitude)
            };
            var status = 'start';
            if (params.btn !== undefined && params.btn) {
                tripApi.TripArray(JSON.stringify(location), location.lat, location.lng, status, params).then((response) => {
                    BackgroundJob.schedule({
                        jobKey: jobKey,
                        period: config.timeInterval,
                        exact: true,
                        allowWhileIdle: true,
                        allowExecutionInForeground: true
                    });

                    ToastAndroid.show('Start Success', ToastAndroid.SHORT);
                });
            } else {
                BackgroundJob.schedule({
                    jobKey: jobKey,
                    period: config.timeInterval,
                    exact: true,
                    allowWhileIdle: true,
                    allowExecutionInForeground: true
                });
            }
            AsyncStorage.setItem('@status:key', 'true');
        });
    }

    static pickup(params) {
        this.getLocation().getFusedLocation().then((position) => {
            let location = {
                'lat': JSON.stringify(position.latitude),
                'lng': JSON.stringify(position.longitude)
            };
            var status = 'pickup';
            tripApi.TripArray(JSON.stringify(location), location.lat, location.lng, status, params).then((response) => {
                ToastAndroid.show('Pickup Success', ToastAndroid.SHORT);
            });
        });
    }

    static stop(params) {
        this.getLocation().getFusedLocation().then((position) => {
            let location = {
                'lat': JSON.stringify(position.latitude),
                'lng': JSON.stringify(position.longitude)
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
            BackgroundJob.cancel({ jobKey: jobKey });
            this.stopRequest(this.getRequest);
            RNTGEO.stopLocationUpdates();
            AsyncStorage.setItem('@status:key', 'false');
        });
    }

    static process(params) {
        // this.getRequest('fusedLocation', position => {
        this.getLocation().getFusedLocation().then((position) => {
            let location = {
                'lat': JSON.stringify(position.latitude),
                'lng': JSON.stringify(position.longitude)
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
                    ToastAndroid.show('Lat: ' + location.lat + ' - ' + 'Lang: ' + location.lng, ToastAndroid.SHORT);
                    if (_lengtLocation === 10) {
                        this.pushData(data);
                    }
                }
            });
        });
    }

    static pushData(data) {
        return tripApi.TripArray(data.result, data.lat, data.lng, data.status, data.params).then((response) => {
            console.log('Push Data');
            AsyncStorage.removeItem('@status:location');
            listLocation = [];
            ToastAndroid.show('Push Data Success', ToastAndroid.SHORT);
        });
    }

    static getRequest(eventName, cb) {
        if (eventNames.indexOf(eventName) === -1) {
            throw new Error('Event name has to be one of \'fusedLocation\' or \'fusedLocationError\'');
        }
        return { listener: DeviceEventEmitter.addListener(eventName, cb).listener, eventName };
    }

    static stopRequest(subscription) {
        DeviceEventEmitter.removeListener(subscription.eventName, subscription.listener);
    }

    static getLocation() {
        const Location = {
            getFusedLocation: forceNewLocation => {
                if (forceNewLocation) {
                    return RNTGEO.getFusedLocation(true);
                } else {
                    return RNTGEO.getFusedLocation(false);
                }
            }
        }
        return Location;
    }

}
