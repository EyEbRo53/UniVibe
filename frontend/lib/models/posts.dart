
class Post {
  int postId;
  int userId;
  String title;
  String description;
  String? location;
  int activityTypeId;
  DateTime createdAt;
  DateTime expiresAt;
  List<PostImage> images;

  // Constructor
  Post({
    required this.postId,
    required this.userId,
    required this.title,
    required this.description,
    this.location,
    required this.activityTypeId,
    DateTime? createdAt,
    required this.expiresAt,
    this.images = const [],
  }) : createdAt = createdAt ?? DateTime.now();
}

class PostImage {
  int imageId;
  int postId;
  String imageUrl;
  DateTime uploadedAt;

  PostImage({
    required this.imageId,
    required this.postId,
    required this.imageUrl,
    DateTime? uploadedAt,
  }) : uploadedAt = uploadedAt ?? DateTime.now();
}