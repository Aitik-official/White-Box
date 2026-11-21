import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "rpdxkihi",
  api_key: process.env.CLOUDINARY_API_KEY || "384372397664355",
  api_secret: process.env.CLOUDINARY_API_SECRET || "XowvfOZgp9NpT2vRaSSyAMq_vwQ",
  secure: true,
});

export default cloudinary;
