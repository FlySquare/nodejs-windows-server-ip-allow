const shell = require('shelljs');
const request = require('request');
const hostname = '127.0.0.1';
const port = 9988;
const baseUrl = '';

function getJsonData(){
    console.log('Checking for new IPs...: ' + new Date().toString());
    request(baseUrl + 'public/secret/ips.json', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const ips = JSON.parse(body);
            Array.prototype.forEach.call(ips, ip => {
                requestPerIp(ip);
            });
        }
    })
}

function requestPerIp(ip){
    request(baseUrl + 'public/secret/new_ip_'+ ip +'.json', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            unBan(ip);
        }
    })
}

function unBan(ip){
    const RuleName = 'UnBan_Player_' + ip;
    shell.exec("netsh advfirewall firewall add rule name=\"" + RuleName + "\" dir=in interface=any action=allow remoteip=" + ip + "/32");
    console.log('--------');
    console.log('UnBan ' + ip);
    request(baseUrl + 'api/remove-ip?ip=' + ip, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('Remove from server: ' + ip);
            console.log('--------');
        }
    });
    console.log('--------');
}

setInterval(function (){
    getJsonData();
}, 1000);