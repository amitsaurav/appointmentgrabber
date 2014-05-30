# Steps to Execute
1. Create a New SNS Topic in us-east-1 region and create an SMS subsription to your phone number under the new topic. Details [here](http://docs.aws.amazon.com/sns/latest/dg/SMSMessages.html)
2. Login to the Visa website here: https://usvisa-info.com/en-ca/selfservice/p/reschedule_appointment until you can see the next available date.
3. Inspect the cookies on the page and grab the value of: **_appointment_system_session** cookie.
4. Create a file called "credentials.js" in the root directory with the following content:
 
    ```javascript
    var credentials = {
      appointment_system_session: 'XXXX',
      accessKeyId: 'XXXX',
      secretAccessKey: 'XXXX',
      region:'us-east-1',
      snsTopicArn: 'XXXX',
    };
    
    module.exports = credentials;
    ```

5. Replace XXXX for **_appointment_system_session** with the value grabbed in step #3.
6. Replace XXXX for **accessKeyId** with your AWS account's access key Id.
7. Replace XXXX for **secretAccessKey** with your AWS account's secret key Id.
8. Replace XXXX for **snsTopicArn** with the SNS topic ARN as discovered from step #1.
9. Start the program using:

    ```
    node server.js
    ```

