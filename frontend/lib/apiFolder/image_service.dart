import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/api_service.dart';
import 'package:frontend/storage/authentication.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:path/path.dart';
import 'package:provider/provider.dart';

//  @Post('create')
//   @UseGuards(JwtAuthGuard)
//   async createPost(
//     @Body('title') title: string,
//     @Body('description') description: string,
//     @Body('location') location: string,
//     @Body('activityTypeId') activityTypeId: number,
//     @Body('imageUrls') imageUrls: string[],
//     @Req() req: any,
//   ) {
class ImageService {
  final String baseUrl;

  ImageService(this.baseUrl);

  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> uploadImage(String imageUrls, String jwtToken) async {
    ApiService apiService = ApiService(baseUrl);

    final authProvider =
        Provider.of<AuthProvider>(context as BuildContext, listen: false);

    jwtToken = authProvider.token;

    const String title = 'A Valid Title';
    const String description =
        'This is a valid description. quirement necessary length for a valid description that will pass the validation check that requires it to be between 100 and 1000 characters.';
    const String location = 'Cafe';

    // Prepare payload
    final Map<String, dynamic> payload = {
      'title': title,
      'description': description,
      'location': location,
      'activityTypeId': 3,
      'imageUrls': [imageUrls, imageUrls],
    };

    Uri uri = Uri.parse("$baseUrl/posts/create");
    base_headers['Authorization'] = jwtToken;

    try {
      Response response = await http.post(
        uri,
        headers: base_headers,
        body: jsonEncode(payload),
      );
      if (response.statusCode == 201) {
        return "Post Image Uploaded Successfully";
      } else {
        return "Failed to Post: ${response.body}";
      }
    } catch (error) {
      print("Error: $error");
      return "Unknown error occurred";
    }
  }
}
