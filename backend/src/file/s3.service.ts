import {
  CreateBucketCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { handleErrorLog } from "../utils/utils";
import config from "@/configs/env-config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function getClient(): S3Client {
  const region = config.aws.region;
  const endpoint = config.aws.endpoint;
  const accessKeyId = config.aws.access_key;
  const secretAccessKey = config.aws.secret_key;
  const forcePathStyle = config.aws.force_path_style === "true";
  const tls = config.aws.tsl === "true";
  if (region === "") {
    return new S3Client({
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: forcePathStyle,
      tls,
      endpoint,
    });
  } else {
    return new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle,
      tls,
      endpoint,
    });
  }
}
export async function createBucket(bucketName: string): Promise<void> {
  try {
    const client: S3Client = getClient();
    await client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      }),
    );
  } catch (e) {
    handleErrorLog(e);
  }
}

export async function createPresignedUrl(
  client: S3Client,
  bucketName: string,
  folderName: string, // client
  filename: string,
  //mimetype: string,
): Promise<string | undefined> {
  try {
    const url = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `${folderName}/${filename}`,
        //ContentType: mimetype,
      }),
      {
        expiresIn: 60 * 10,
      },
    );
    return url;
  } catch (e) {
    handleErrorLog(e);
  }
}

export async function getPresignedUrl(
  client: S3Client,
  bucketName: string,
  directoryPath: string,
  filename: string,
): Promise<string | undefined> {
  try {
    const url = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `${directoryPath}/${filename}`,
      }),
      {
        expiresIn: 60 * 10,
      },
    );
    return url;
  } catch (e) {
    handleErrorLog(e);
  }
}

export async function getListOfFiles(
  client: S3Client,
  bucketName: string,
): Promise<string[] | undefined> {
  try {
    const response = await client.send(
      new ListObjectsCommand({
        Bucket: bucketName,
      }),
    );
    if (!response.Contents) {
      throw new Error("No data returned from response body");
    }
    return response.Contents.filter(
      (file): file is { Key: string } => file.Key !== undefined,
    ).map((file) => file.Key);
  } catch (e) {
    handleErrorLog(e);
  }
}
