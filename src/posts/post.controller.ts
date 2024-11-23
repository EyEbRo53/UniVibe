import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  UseGuards,
  Put,
  Param,
  Query,
  NotFoundException,
  HttpException,
  HttpStatus,
  NotAcceptableException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authService: AuthService,
  ) { }

  // Create a new post
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('location') location: string,
    @Body('activityTypeId') activityTypeId: number,
    @Body('imageUrls') imageUrls: string[],
    @Req() req: any,
  ) {
    try {
      const user = await this.authService.identifyUser(
        req.headers['authorization'],
      );
      this.postService.createPost(
        user.user_id,
        title,
        description,
        location,
        activityTypeId,
        imageUrls,
      );

      return {
        status: HttpStatus.OK,
        message: 'post created successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof NotAcceptableException) {
        throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
      } else if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        console.error('Unexpected error while creating post:', error);
        throw new HttpException(
          'An error occurred while creating the post',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Update an existing post
  @Put(':postId')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Req() req: any,
    @Param('postId') postId: number,
    @Body('title') title?: string,
    @Body('description') description?: string,
    @Body('location') location?: string,
    @Body('activityTypeId') activityTypeId?: number,
    @Body('imageUrls') imageUrls?: string[]
  ) {
    try {
      const user = await this.authService.identifyUser(
        req.headers['authorization'],
      );
      await this.postService.updatePost(
        user.user_id,
        postId,
        title,
        description,
        location,
        activityTypeId,
        imageUrls || [],
      );

      return {
        status: HttpStatus.OK,
        message: 'Post updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof NotAcceptableException) {
        throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
      } else if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'an error occurred while updating the post',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Delete a post
  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('postId') postId: number, @Req() req: any) {
    try {
      const user = await this.authService.identifyUser(
        req.headers['authorization'],
      );
      await this.postService.deletePost(user.user_id, postId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Post deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'An error occurred while deleting the post',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  //TODO: to be tried and tested
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(@Query() filters: { [key: string]: any }) {
    try {
      return this.postService.getPosts(filters);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllPosts() {
    try {
      // Calling the service function to get all posts
      const posts = await this.postService.getAllPosts();
      return {
        message: 'Posts retrieved successfully',
        data: posts,
      };
    } catch (error) {
      // Handle possible errors and throw appropriate HttpExceptions
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
