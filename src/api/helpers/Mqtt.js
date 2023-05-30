const statusCodes = require('../../config').StatusCodes
const mqtt = require('mqtt')
const mqttConfig = require('../../config').MqttConfigurations
const backend_name = require('../../config').AppConfigurations.backend_name;
const connectUrl = `mqtt://${mqttConfig.host}:${mqttConfig.port}`     
const connectOptions = {
    clientId: backend_name,
    clean: true,
    connectTimeout: 4000,
    username: '',
    password: '',
    reconnectPeriod: 1000,
}

function publish(topic, message){    

    return new Promise((resolve, reject) => {
        const client = mqtt.connect(connectUrl, connectOptions);

        client.on('connect', function () {

            console.log('Connection status: ', client.connected);

            client.publish(topic, message, function (err) {
                if(err) {
                    console.log('err',err);
                    reject(new Error(`${statusCodes.internal_server_error.msg} | ${err}`))
                    return;
                }

                client.end();
                resolve(true);
                return
            })  
        })
    })
}

function subscribe(topic){
    const client = mqtt.connect(connectUrl, connectOptions);

    client.on('connect', function () {

        console.log('Connection status: ', client.connected);

        client.subscribe(topic, function (err) {
            if(err) {
                console.log('err',err);
                return false;
            }
            client.on('message', function (topic, message, packet) {
                console.log('message',message.toString());
            })
        })  
    })
}

module.exports = {publish, subscribe}


