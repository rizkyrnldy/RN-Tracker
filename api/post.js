import config from '../config';
var url = config.ip;

var Post = {
    trip(lat, lng, status, id_shipping) {
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
                id_shipping: id_shipping,
            })
        }).then(
            (responseData) => responseData.json()
        );
    },

}

module.exports = Post;