const jwt = require('jsonwebtoken');
const fs = require('fs');

// Using p8 private key in environment variable
// script to encode key's content to a single line string:
// echo -n $(cat <PATH_TO_YOUR_PRIVATE_KEY>.p8)
// Then set it as env var:
// export APPLE_PRIVATE_KEY_CONTENT='YOUR_SINGLE_LINE_PRIVATE_KEY_CONTENT'
// Then we can use it like this:
// const privateKey = process.env.APPLE_PRIVATE_KEY_CONTENT;

const privateKey = fs.readFileSync('<PATH_TO_YOUR_PRIVATE_KEY>.p8'); // Load the private key

const YOUR_CLIENT_SECRET = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d', // Token's expiration time
  audience: 'https://appleid.apple.com',
  issuer: '<YOUR_TEAM_ID>',
  keyid: '<YOUR_KEY_ID>',
  subject: '<YOUR_CLIENT_ID>', // This should be your Service ID
});

console.log('YOUR_CLIENT_SECRET:', YOUR_CLIENT_SECRET);
