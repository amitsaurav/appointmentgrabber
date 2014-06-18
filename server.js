var credentials = require('./credentials');
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var AWS = require('aws-sdk');
var app = express();

// Initializing AWS SNS
AWS.config.update({
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey
});
AWS.config.update({
  region: credentials.region
});
var sns = new AWS.SNS();

function callback(error, response, body) {
  if (!error) {
    var $ = cheerio.load(body);
    var data = $('#appointment_info_table_1').next().text();
    var dateReg = /(\w+\s+(\d+)\s+(\w+)\s+\d+)/;

    if (typeof data === "undefined" || data === null)
      sendSMS('Invalid page received.');
    else if (dateReg.test(data)) {
      var matchedDate = dateReg.exec(data);

      if ((+matchedDate[2] < 26 && matchedDate[3].indexOf('Aug') >= 0) ||
        matchedDate[3].indexOf('July') >= 0 || matchedDate[3].indexOf('Jun') >= 0)
        sendSMS('Available date: ' + matchedDate[1]);
      else
        console.log(new Date() + ': Later date found: ' + matchedDate[1]);
    } else
      console.log(new Date() + ': Date did not match: ' + data);
  } else
      sendSMS('Could not load page.');
}

function main() {
  var url = 'https://usvisa-info.com/en-ca/selfservice/p/reschedule_appointment';
  var jar = request.jar();
  var cookie = request.cookie("_appointment_system_session=" + credentials.appointment_system_session);
  jar.setCookie(cookie, url);

  var options = {
    url: url,
    method: 'GET',
    jar: jar
  }

  request(options, callback);
}

function sendSMS(message) {
  var params = {
    Message: message,
    Subject: message,
    TopicArn: credentials.snsTopicArn
  };

  sns.publish(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log('Sent SMS: ' + message);
      console.log(data);
    }
  });
}

sendSMS('Starting grabber!');
setInterval(main, 60000);
