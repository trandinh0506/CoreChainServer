// This script encodes your PEM keys to base64 format

// Example of how to encode the keys in Node.js
const fs = require('fs');

// Your PEM keys as strings
//Private key
const privateKeyPEM = ``;
// Public key
const publicKeyPEM = ``;

// Convert to base64
const privateKeyBase64 = Buffer.from(privateKeyPEM).toString('base64');
const publicKeyBase64 = Buffer.from(publicKeyPEM).toString('base64');

// Print the base64 strings (these are what you'll set as environment variables)
console.log('RSA_PRIVATE_KEY:');
console.log(privateKeyBase64);
console.log('\nRSA_PUBLIC_KEY:');
console.log(publicKeyBase64);

// // Optionally, write them to a file for easier copying
// fs.writeFileSync('privateKeyBase64.txt', privateKeyBase64);
// fs.writeFileSync('publicKeyBase64.txt', publicKeyBase64);

console.log('\nBase64 encoded keys have been saved to files for easy copying');
