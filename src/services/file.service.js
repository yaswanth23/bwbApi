const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const S3 = new AWS.S3();

const uploadFileToS3 = async (bucketName, fileName, filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
    };
    const result = await S3.upload(params).promise();
    return result.Location;
  } catch (error) {
    throw error;
  }
};

module.exports.uploadFilesAndGetUrls = async (bucketName, files) => {
  try {
    const uploadedFiles = [];

    for (const file of files) {
      let fileName =
        process.env.APP_ENV === 'production'
          ? 'prod'
          : 'dev' + '/' + `${file.filename}`;
      const filePath = file.path;
      const url = await uploadFileToS3(bucketName, fileName, filePath);
      uploadedFiles.push({ fieldName: file.fieldName, url });
      fs.unlinkSync(filePath);
    }
    return uploadedFiles;
  } catch (error) {
    throw error;
  }
};
