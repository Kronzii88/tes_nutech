const AWS = require("aws-sdk");

const wasabiEndpoint = new AWS.Endpoint("s3.wasabisys.com");
const s3 = new AWS.S3({
  endpoint: wasabiEndpoint,
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
  region: process.env.WASABI_REGION,
});

exports.uploadSingle = (filename, fileContent, mimetype, filepath) => {
  const params = {
    Bucket: process.env.WASABI_BUCKET_NAME,
    Key: filename, // File name to be saved as in Wasabi
    Body: fileContent,
    ContentType: mimetype,
  };

  // Return a Promise to handle the async operation
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        return reject("Failed");
      }
      resolve(data.Location); // Return the file location
    });
  });
};
