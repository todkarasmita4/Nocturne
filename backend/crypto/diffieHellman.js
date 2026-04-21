import crypto from "crypto";

export const generateKeys = () => {
  const dh = crypto.createDiffieHellman(2048);
  dh.generateKeys();

  return {
    publicKey: dh.getPublicKey("hex"),
    privateKey: dh.getPrivateKey("hex"),
    prime: dh.getPrime("hex"),
    generator: dh.getGenerator("hex")
  };
};