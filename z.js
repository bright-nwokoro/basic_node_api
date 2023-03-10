const { S3 } = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { createQueue } = require('bullmq');
const sharp = require('sharp');

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  s3ForcePathStyle: true,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'test-user-images',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const userId = req.user.id; // assuming you're using passport or some authentication middleware
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      cb(null, `users/${userId}/${timestamp}-${file.originalname}`);
    },
  }),
});

const imageQueue = createQueue('imageQueue');

const handleImageUpload = async (job) => {
  const { key } = job.data;

  try {
    const resizedImages = await Promise.all([
      sharp(await s3.getObject({ Bucket: 'test-user-images', Key: key }).promise())
        .resize(200, 200)
        .toBuffer(),
      sharp(await s3.getObject({ Bucket: 'test-user-images', Key: key }).promise())
        .resize(1280, 720)
        .toBuffer(),
      sharp(await s3.getObject({ Bucket: 'test-user-images', Key: key }).promise())
        .resize(1920, 1080)
        .toBuffer(),
    ]);

    const resizedKeys = [
      { key: `users/${key.split('/')[1]}/thumbnails/${key.split('/')[2]}`, buffer: resizedImages[0] },
      { key: `users/${key.split('/')[1]}/720p/${key.split('/')[2]}`, buffer: resizedImages[1] },
      { key: `users/${key.split('/')[1]}/1080p/${key.split('/')[2]}`, buffer: resizedImages[2] },
    ];

    await Promise.all(
      resizedKeys.map(async ({ key, buffer }) => {
        await s3.putObject({ Bucket: 'test-user-images', Key: key, Body: buffer }).promise();
      })
    );

    console.log('Images uploaded successfully');
  } catch (err) {
    console.error('Failed to resize and upload images', err);
    throw err;
  }
};

imageQueue.process('imageUpload', handleImageUpload);

app.post('/image/upload', upload.array('users', 10), (req, res) => {
  const { files } = req;

  const promises = files.map((file) => {
    return imageQueue.add('imageUpload', { key: file.key, userid: req.body.userid });
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ message: 'Images are being processed' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to process images' });
    });
});
