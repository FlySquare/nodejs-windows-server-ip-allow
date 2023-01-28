const shell = require('shelljs');
const http = require('http');
const request = require('request');
const hostname = '127.0.0.1';
const port = 9988;
const baseUrl = '';

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

function getJsonData(){
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

server.listen(port, hostname, () => {
    getJsonData();
});