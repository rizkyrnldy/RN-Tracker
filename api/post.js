import config from '../config';
var url = config.ip;

var post = {
    Trip(lat, lng, status, params) {
        return fetch(url + '/insert', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trip: 1,
                lat: lat,
                lng: lng,
                status: status,
                shipment_code: params.shipment_code,
                member_code: params.member_code,
            })
        }).then(
            (responseData) => responseData.json()
        ).catch(function (err) {
            return err;
        })
    }
}

module.exports = post;
