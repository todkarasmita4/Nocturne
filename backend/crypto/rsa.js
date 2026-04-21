import crypto from "crypto";

// Generate RSA Key Pair
export const generateRSAKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  return {
    publicKey: publicKey.export({ type: "pkcs1", format: "pem" }),
    privateKey: privateKey.export({ type: "pkcs1", format: "pem" })
  };
};

// Encrypt using public key
export const rsaEncrypt = (data, publicKey) => {
  return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString("base64");
};

// Decrypt using private key
export const rsaDecrypt = (encryptedData, privateKey) => {
  return crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedData, "base64")
  ).toString("utf-8");
};