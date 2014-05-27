# Steps to Execute
- Create a New SNS Topic in us-east-1 region and create an SMS subsription under the new topic.
- Create a file called "credentials.js" in the root directory with the following content:
  
  var credentials = {
    appointment_system_session: 'XXXX',
    accessKeyId: 'XXXX',
    secretAccessKey: 'XXXX',
    region:'XXXX',
    snsTopicArn: 'XXXX',
  };
  
  module.exports = credentials;
- Use your ids in place of the placeholders 'XXXX' above.
- Start the program using:
  
  node server.js
