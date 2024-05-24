import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { VideoEntity } from "./../entity/Video";
import { s3 } from "../index";

type videoType = {
  title: string;
  buffer: Buffer;
}

@Resolver()
export class VideoResolver {
  @Query(() => [VideoEntity])
  async videos() {
    return await VideoEntity.find();
  }

  @Mutation(() => VideoEntity)
  async createVideo(
    @Arg("title") title: string,
    @Arg("description") description: string,
    @Arg("user_id") user_id: string,
    @Arg("video_file") video_file: videoType
  ): Promise<VideoEntity> {
    const video = VideoEntity.create({ title, description, user_id });
    await video.save();

    const params = {
      Bucket: "emberplaybucket",
      Key: video_file.title,
      Body: video_file.buffer,
    };

    try {
      const data = await s3.upload(params).promise();
      console.log("File uploaded successfully. File location:", data.Location);
    } catch (err) {
      console.log("Error uploading file:", err);
      throw new Error("Failed to upload video file");
    }

    return video;
  }

  @Mutation(() => VideoEntity, { nullable: true })
  async updateVideo(
    @Arg("title", { nullable: true }) title: string,
    @Arg("description", { nullable: true }) description: string,
    @Arg("user_id") user_id: string
  ): Promise<VideoEntity | null> {
    const video = await VideoEntity.findOne({ where: { user_id, title } });
    if (!video) {
      return null;
    }

    if (title !== undefined) {
      video.title = title;
    }
    if (description !== undefined) {
      video.description = description;
    }

    await video.save();
    return video;
  }
}
