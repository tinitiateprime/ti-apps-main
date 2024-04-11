const AWS = require('aws-sdk');
const fs = require('fs');
// Set the AWS profile to use
const credentials = new AWS.SharedIniFileCredentials({ profile: 'tiappsadmin' });
AWS.config.credentials = credentials;

// Set the AWS region
AWS.config.update({ region: 'us-east-1' });

// Create an S3 instance
const s3 = new AWS.S3();

// Specify the name of your bucket
const bucketName = 'ti-apps-data';
const keyPrefix = 'profile-master/data/';  // Make sure to include the trailing slash if it's a "folder"

// List the contents of the bucket under the specified key
s3.listObjectsV2({ Bucket: bucketName, Prefix: keyPrefix }, (err, data) => {
  if (err) {
    console.log('Error:', err);
  } else {
    // Function to build the hierarchical structure
    const buildStructure = (keys) => {
      const folders = [];
      const folderMap = {};

      keys.forEach(key => {
        const relativeKey = key.replace(keyPrefix, '');
        const parts = relativeKey.split('/');
        const fileName = parts.pop();
        const folderPath = parts.join('/') + '/';

        if (!folderMap[folderPath]) {
          const folderObject = {
            folder: folderPath,
            contents: []
          };
          folders.push(folderObject);
          folderMap[folderPath] = folderObject;
        }

        if (fileName) {
          folderMap[folderPath].contents.push(fileName);
        }
      });

      return folders;
    };

    const keys = data.Contents.map(object => object.Key);
    const structure = buildStructure(keys);

    // Save the output to a JSON file
    const outputPath = 'output.json';
    fs.writeFile(outputPath, JSON.stringify(structure, null, 2), (writeErr) => {
      if (writeErr) {
        console.log('Error writing to file:', writeErr);
      } else {
        console.log(`Output saved to ${outputPath}`);
      }
    });
  }
});
const fileKey = 'profile-master/data/sqlserver/sqlserver-deployment.md';

s3.getObject({ Bucket: bucketName, Key: fileKey }, (err, data) => {
  if (err) {
    console.log('Error:', err);
  } else {
    // The file content is available in data.Body
    const fileContent = data.Body.toString('utf-8');
    console.log(`Content of ${fileKey}:`);
    console.log(fileContent);

    // Optionally, save the content to a local file
    const outputPath = 'local_output.md';
    fs.writeFile(outputPath, fileContent, (writeErr) => {
      if (writeErr) {
        console.log('Error writing to local file:', writeErr);
      } else {
        console.log(`Content saved to ${outputPath}`);
      }
    });
  }
});