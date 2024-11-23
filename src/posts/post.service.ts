import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostImage } from 'src/postImages/postImage.entity';
import { getDistance } from 'geolib';
import * as dotenv from 'dotenv';
import { Activity } from 'src/activity/activity.entity';
import { User } from 'src/users/user.entity';
dotenv.config();

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) { }

  private check_post_input(
    title: string,
    description: string,
    location: string,
  ) {
    if (!title?.trim())
      throw new BadRequestException('Title is required and cannot be empty.');
    if (!description?.trim())
      throw new BadRequestException(
        'Description is required and cannot be empty.',
      );
    if (!location?.trim())
      throw new BadRequestException(
        'Location is required and cannot be empty.',
      );

    // if (title.length < 50 || title.length > 200)
    //   throw new NotAcceptableException(
    //     'Title must be between 50 and 200 characters long.',
    //   );

    // if (description.length < 100 || description.length > 1000)
    //   throw new NotAcceptableException(
    //     'Description must be between 100 and 1000 characters.',
    //   );
  }

  async createPost(
    userId: number,
    title: string,
    description: string,
    location: string,
    activityTypeId: number,
    imageUrls: string[] = [],
  ): Promise<void> {
    this.check_post_input(title, description, location);

    const activityType = await this.activityRepository.findOne({
      where: { activity_id: activityTypeId },
    });

    if (!activityType) throw new NotFoundException('Activity type not found.');

    const expiresAt = new Date();
    let expireTimeHours = parseInt(process.env.EXPIRE_TIME, 10);

    // Check if EXPIRE_TIME is invalid or less than or equal to zero
    if (isNaN(expireTimeHours) || expireTimeHours <= 0) {
      console.error(`Invalid expiration time: ${process.env.EXPIRE_TIME}`);
      // Assign a default expiration time if the value is invalid
      expireTimeHours = 24; // Default to 24 hours if the environment variable is not valid
    }

    expiresAt.setHours(expiresAt.getHours() + expireTimeHours);  // Add the expiration time to the current date

    const post = this.postRepository.create({
      user: { user_id: userId } as any,
      title,
      description,
      location,
      activityType,
      expires_at: expiresAt,
    });

    const savedPost = await this.postRepository.save(post);

    if (imageUrls.length > 0) {
      const postImages = imageUrls.map((url) =>
        this.postImageRepository.create({
          post: savedPost,
          image_url: url,
        }),
      );
      await this.postImageRepository.save(postImages);
      savedPost.images = postImages;
    }
  }

  async updatePost(
    userId: number,
    postId: number,
    title?: string,
    description?: string,
    location?: string,
    activityTypeId?: number,
    imageUrls?: string[],
  ) {
    const post = await this.postRepository.findOne({
      where: { post_id: postId, user: { user_id: userId } },
      relations: ['images'],
    });

    if (!post) {
      throw new NotFoundException('Post not found or not authorized');
    }

    if (title || description || location) {
      this.check_post_input(
        title || post.title,
        description || post.description,
        location || post.location
      );
    }

    if (title) post.title = title;
    if (description) post.description = description;
    if (location) post.location = location;

    if (activityTypeId !== undefined) {
      const activityType = await this.activityRepository.findOne({
        where: { activity_id: activityTypeId },
      });
      if (!activityType) {
        throw new NotFoundException('Activity type not found');
      }
      post.activityType = activityType;
    }

    if (imageUrls !== undefined && Array.isArray(imageUrls)) {
      if (imageUrls.length > 0) {
        await this.postImageRepository.delete({ post: { post_id: postId } });

        const postImages = imageUrls.map((url) =>
          this.postImageRepository.create({
            post,
            image_url: url,
          }),
        );
        await this.postImageRepository.save(postImages);
        post.images = postImages;
      }
    }

    await this.postRepository.save(post);
  }

  async deletePost(userId: number, postId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { post_id: postId, user: { user_id: userId } },
    });

    if (!post) {
      throw new NotFoundException('Post not found or not authorized');
    }

    await this.postRepository.remove(post);
  }

  async getPosts(filters: { [key: string]: any }) {
    const { radius = '1km', 'activity type': activityType, location } = filters;

    if (!location) {
      throw new Error('Location is required to filter by radius');
    }

    const [userLatitude, userLongitude] = location
      .split(',')
      .map((coord) => parseFloat(coord.trim()));

    // Set the search radius (convert km to meters)
    const searchRadius = parseFloat(radius) * 1000 || 1000; // default to 1km

    // Retrieve posts from the database
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.activityType', 'activity');

    // Apply activity type filter if provided
    if (activityType) {
      query.andWhere('activity.type_name = :activityType', { activityType });
    }

    const posts = await query.getMany();

    // Filter posts by calculated distance
    const filteredPosts = posts.filter((post) => {
      if (!post.location) return false;

      const [postLatitude, postLongitude] = post.location
        .split(',')
        .map((coord) => parseFloat(coord.trim()));

      // Calculate the distance between user and post location
      const distance = getDistance(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: postLatitude, longitude: postLongitude },
      );

      return distance <= searchRadius;
    });

    return filteredPosts;
  }
  async getAllPosts() {
    try {
      const joinedData:Post[] = await this.postRepository.find({relations:["images","user"]});
      const postForHomePage = joinedData.map((post: Post) => {
        const { user, images, ...postDetails } = post;
        return {
          ...postDetails,
          user_id: user.user_id,
          user_name:user.user_name,
          images,
        };
      });
      return postForHomePage;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error while retrieving posts');
    }
  }

}
