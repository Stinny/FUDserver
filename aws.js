const AWS = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');

const s3 = new S3({
  accessKeyId: process.env.AWS_A_KEY,
  secretAccessKey: process.env.AWS_S_KEY,
  Bucket: process.env.AWS_BUCK_NAME,
});

const uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.AWS_BUCK_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ACL: 'public-read',
  };

  return s3.upload(params).promise();
};

const deleteFromS3 = (key) => {
  const params = {
    Bucket: process.env.AWS_BUCK_NAME,
    Key: key,
  };

  return s3ForFiles.deleteObject(params).promise();
};

module.exports = { uploadToS3, deleteFromS3 };
