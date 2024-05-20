import { title } from 'process';
import { VideoEntity } from './../entity/Video';
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { describe } from 'node:test';

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
    @Arg("user_id") user_id: string
  ): Promise<VideoEntity> {
    const video = VideoEntity.create({ title, description , user_id});
    await video.save();
    return video;
  }

  @Mutation(() => VideoEntity, { nullable: true })
  async updateUser(
    // @Arg("id") id: number,
    @Arg("title", { nullable: true }) title: string,
    @Arg("description", { nullable: true }) description: string,
    @Arg("user_id") user_id: string
  ): Promise<VideoEntity | null> {
    const video = await VideoEntity.findOneBy({ title, user_id});
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
