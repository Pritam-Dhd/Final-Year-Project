import CryptoJS from "crypto-js";

export const handleEsewaSuccess = async (req, res, next) => {
  try {
    const { data } = req.query;
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );
    console.log(decodedData);
    if (decodedData.status !== "COMPLETE") {
      return { messgae: "errror" };
    }
    const message = decodedData.signed_field_names
      .split(",")
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");
    const secretKey = process.env.EsewaSecretKey;
    const hash = CryptoJS.HmacSHA256(message, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);
    console.log("Signature: "+signature);
    console.log("Decode signature: "+decodedData.signature)
    if (signature !== decodedData.signature) {
      return { message: "integrity error" };
    }
    
    req.transaction_uuid = decodedData.transaction_uuid;
    req.transaction_code = decodedData.transaction_code;
    next();
  } catch (err) {
    console.log(err);
    return { error: err?.message || "No Fine found" };
  }
};

export const handleEsewaFailure = async (req, res, next) => {
  try {
    res.redirect("http://localhost:3002/dashboard/fine");
  } catch (err) {
    console.log(err);
    return { error: err?.message || "No Fine found" };
  }
};