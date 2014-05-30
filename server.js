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
    var dataSplit = data.split('\r\n');
    var date = dataSplit[1];
    
    if (typeof date === "undefined" || date === null) {
      sendSMS('Invalid page received.', function() {
        process.exit(1);
      });
    } else if (date.indexOf('Jul') >= 0 || date.indexOf('Aug') >= 0) {
      sendSMS('Available date: ' + date, function() {
        process.exit(1);
      });
    } else {
      console.log(new Date() + ': ' + date);
    }
  } else {
      sendSMS('Could not load page.', function() {
        process.exit(1);
      });
      console.log(error);
  }
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

function sendSMS(message, callback) {
  var params = {
    Message: message,
    Subject: message,
    TopicArn: credentials.snsTopicArn
  };

  sns.publish(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      if (typeof callback === "function") {
        callback();
      }
      console.log('Sent SMS: ' + message);
    }
  });
}

sendSMS('Starting grabber!');
setInterval(main, 60000);
