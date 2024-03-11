import { z } from "zod";
import { ThrowError } from "../lib/errorHandler";
import { publicProcedure, router } from "../trpc";
import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import axios from "axios";

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = env.AWS_BUCKET_NAME;

export const fileRouter = router({
  uploadFile: publicProcedure
    .input(
      z.object({
        fileName: z.string(), // Name of the file to be saved as in S3
        fileType: z.string(), // MIME type of the file
        fileContentBase64: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { fileName, fileType, fileContentBase64 } = input;

      if (!bucketName) {
        ThrowError("AWS_BUCKET_NAME environment variable is not set");
      }

      // Convert base64 string back to binary data
      const fileContent = Buffer.from(fileContentBase64, "base64");

      // const putCommand = new PutObjectCommand({
      //   Bucket: bucketName,
      //   Key: fileName,
      //   Body: fileContent,
      //   ContentType: fileType,
      // });

      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
        ContentType: fileType,
        ACL: "public-read", // Make the file publicly readable
      });

      try {
        // Perform the upload operation
        await s3Client.send(putCommand);

        return {
          success: true,
          message: "File uploaded successfully",
          fileName,
          url: `https://${bucketName}.s3.amazonaws.com/${fileName}`, // Return the URL to access the file
        };
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        ThrowError("Failed to upload file to S3 bucket");
      }
    }),
  uploadFileFromUnsplash: publicProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        imageName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { imageUrl, imageName } = input;
      let imageNameModified = `${imageName.replace(/\s/g, "_")}.jpg`;
      if (!bucketName) {
        ThrowError("AWS_BUCKET_NAME environment variable is not set");
      }

      const response = await axios({
        method: "get",
        url: imageUrl,
        responseType: "arraybuffer", // Get the image data as a buffer
      });

      const fileContent = response.data;
      const contentType = response.headers["content-type"];

      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: imageNameModified,
        Body: fileContent,
        ContentType: contentType,
        ACL: "public-read",
      });

      try {
        // Perform the upload operation
        await s3Client.send(putCommand);
        return {
          success: true,
          message: "File uploaded successfully",
          fileName: imageNameModified,
          url: `https://${bucketName}.s3.amazonaws.com/${imageNameModified}`, // Return the URL to access the file
        };
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        ThrowError("Failed to upload file to S3 bucket");
      }
    }),
  readFiles: publicProcedure.query(async () => {
    if (!bucketName) {
      ThrowError("AWS_BUCKET_NAME environment variable is not set");
    }

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
    });

    try {
      const { Contents } = await s3Client.send(command);

      if (!Contents) {
        ThrowError("Failed to retrieve files from S3 bucket");
      }

      const files = Contents?.map((file) => ({
        filename: file.Key,
        size: file.Size,
        type: file.Key?.split(".").pop(), // Get the file extension
        url: `https://${bucketName}.s3.amazonaws.com/${file.Key}`, // Generate the URL to the file
        lastModified: file.LastModified?.toISOString(), // Convert to ISO string for consistency
        // You could add additional fields here based on what the API returns
      }));
      return files;
    } catch (error) {
      // It's a good practice to log the actual error for debugging purposes
      // console.error("Error fetching files from S3:", error);
      // ThrowError("Failed to retrieve files from S3 bucket");
    }
  }),
  updateFileName: publicProcedure
    .input(
      z.object({
        oldFileName: z.string(),
        newFileName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { oldFileName, newFileName } = input;
      if (!bucketName) {
        ThrowError("AWS_BUCKET_NAME environment variable is not set");
      }

      // const copyCommand = new CopyObjectCommand({
      //   Bucket: bucketName,
      //   CopySource: encodeURIComponent(`${bucketName}/${oldFileName}`),
      //   Key: newFileName,
      // });

      const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: encodeURIComponent(`${bucketName}/${oldFileName}`),
        Key: newFileName,
        ACL: "public-read", // Make the file publicly readable
      });

      try {
        // First, copy the file to the new name
        await s3Client.send(copyCommand);

        // If copy succeeds, delete the old file
        const deleteCommand = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: oldFileName,
        });

        await s3Client.send(deleteCommand);

        return {
          success: true,
          message: "File name updated successfully",
          oldFileName,
          newFileName,
        };
      } catch (error) {
        console.error("Error updating file name on S3:", error);
        ThrowError("Failed to update file name on S3 bucket");
      }
    }),
  deleteFile: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { fileName } = input;
      if (!bucketName) {
        ThrowError("AWS_BUCKET_NAME environment variable is not set");
      }

      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      try {
        // Perform the delete operation
        const deleteResult = await s3Client.send(deleteCommand);

        if (!deleteResult) {
          ThrowError("Failed to delete file from S3 bucket");
        }

        return {
          success: true,
          message: "File deleted successfully",
          fileName,
        };
      } catch (error) {
        console.error("Error deleting file from S3:", error);
        ThrowError("Failed to delete file from S3 bucket");
      }
    }),
});
