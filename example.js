import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import RNTracker from 'rn-tracker';
import DeviceInfo from 'react-native-device-info';

export default class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            'start': true,
            'Loading': true,
        };
    };

    componentDidMount() {
        let id = DeviceInfo.getUniqueID();
        AsyncStorage.getItem('@status:key', (err, result) => {
            if (result === null) {
                AsyncStorage.setItem('@status:key', 'false');
                this.setState({
                    'start': false,
                    'Loading': false,
                });
            } else if (result === 'false') {
                RNTracker.stop();
                this.setState({
                    'start': false,
                    'Loading': false
                });
            } else if (result === 'true') {
                RNTracker.start({
                    shipment_codes: id,
                });
                this.setState({
                    'start': true,
                    'Loading': false
                });
            }
        })
    }

    start() {
        RNTracker.start({
            shipment_code: DeviceInfo.getUniqueID(),
            member_code: DeviceInfo.getUniqueID() + '-member',
            btn: true,
        });
        this.setState({
            'start': true
        });
    }

    stop() {
        RNTracker.stop({
            btn: true,
            shipment_code: DeviceInfo.getUniqueID(),
            member_code: DeviceInfo.getUniqueID() + 'member',
        });
        this.setState({
            'start': false
        })
    }

    pickup() {
        RNTracker.pickup({
            shipment_code: DeviceInfo.getUniqueID(),
            member_code: DeviceInfo.getUniqueID() + 'member',
        });
    }


    render() {
        if (this.state.Loading) {
            return (
                <View>
                    <Text>
                        Loading
            </Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {
                    !this.state.start ?
                        <TouchableNativeFeedback onPress={() => this.start()}>
                            <View style={{ padding: 20, backgroundColor: 'green', borderRadius: 20 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Start</Text>
                            </View>
                        </TouchableNativeFeedback> :
                        <View>
                            <TouchableNativeFeedback onPress={() => this.stop()}>
                                <View style={{ padding: 20, backgroundColor: 'red', borderRadius: 20 }}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>Stop</Text>
                                </View>
                            </TouchableNativeFeedback>

                            <TouchableNativeFeedback onPress={() => this.pickup()}>
                                <View style={{ padding: 20, marginTop: 50, backgroundColor: 'blue', borderRadius: 20 }}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Pickup</Text>
                                </View>
                            </TouchableNativeFeedback>

                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
