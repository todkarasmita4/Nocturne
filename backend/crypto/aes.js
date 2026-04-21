import crypto from "crypto";

export const encrypt = (text, secret) => {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash("sha256").update(secret).digest();

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

export const decrypt = (data, secret) => {
  const [ivHex, encrypted] = data.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.createHash("sha256").update(secret).digest();

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};