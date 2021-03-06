# Prerequisites
1. Node.js installed. Detailed instructions to install [here](http://howtonode.org/how-to-install-nodejs)
2. An AWS account. Sign up [here](http://aws.amazon.com/)!

# Installation Instruction
1. Clone the project in your local directory and change to the root directory on command line.
2. Open the file **server.js** and edit line numbers 11 and 12 to be the date before which you need your appointment. This helps someone who already has an appointment and wants to be notified if an earlier date opens up. For first timers, just put a date way in the future like 12/31.
3. Install the program by firing the following command from command line:

        npm install

# Steps to Execute
1. Create a New SNS Topic in us-east-1 region and create an SMS subsription to your phone number under the new topic. Details [here](http://docs.aws.amazon.com/sns/latest/dg/SMSMessages.html)
2. Login to the Visa website here: https://usvisa-info.com/en-ca/selfservice/p/reschedule_appointment until you can see the next available date.
3. Inspect the cookies on the page and grab the value of: **_appointment_system_session** cookie.
4. Create a file called "credentials.js" in the root directory with the following content:

        var credentials = {
          appointment_system_session: 'XXXX',
          accessKeyId: 'XXXX',
          secretAccessKey: 'XXXX',
          region:'us-east-1',
          snsTopicArn: 'XXXX',
        };
        
        module.exports = credentials;

    - Replace XXXX for **_appointment_system_session** with the value grabbed in step #3.
    - Replace XXXX for **accessKeyId** with your AWS account's access key Id.
    - Replace XXXX for **secretAccessKey** with your AWS account's secret key Id.
    - Replace XXXX for **snsTopicArn** with the SNS topic ARN as discovered from step #1.

5. Start the program using:

        node server.js

# Optional
1. Make the node process a background service by following the steps [here](http://howtonode.org/deploying-node-upstart-monit).
