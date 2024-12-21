import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/api_service.dart';
import 'package:frontend/storage/authentication.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:path/path.dart' as Path;
import 'package:provider/provider.dart';

class PostApiService {
  final String baseUrl;

  PostApiService(this.baseUrl);
  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> getAllPosts(BuildContext context) async {
    ApiService apiService = ApiService("http://localhost:3000");
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    String jwtToken = authProvider.token;
    jwtToken = "Bearer $jwtToken";
    Uri url = Uri.parse("$baseUrl/posts/all");
    final Response response = await http.get(
      url,
      headers: {'Content-Type': 'application/json', 'Authorization': jwtToken},
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.body;
    } else {
      final responseBody = json.decode(response.body);
      throw Exception(responseBody['message'] ?? 'Unknown error occurred');
    }
  }

  Future<Map<String, dynamic>> createPost(
    String title,
    String description,
    String location,
    int activityTypeId,
    List imageUrls,
    BuildContext context,
  ) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    String jwtToken = authProvider.token;
    jwtToken = "Bearer $jwtToken";

    Uri url = Uri.parse("$baseUrl/posts/create");

    // Prepare the request body
    final Map<String, dynamic> requestBody = {
      'title': title,
      'description': description,
      'location': location,
      'activityTypeId': activityTypeId,
      'imageUrls': imageUrls,
    };

    try {
      final response = await http.post(
        url,
        headers: {
          'Authorization': jwtToken,
          'Content-Type': 'application/json'
        },
        body: jsonEncode(requestBody),
      );

      // Check if the status code indicates success
      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        return responseBody; // Return success message from the response
      } else {
        final responseBody = json.decode(response.body);
        throw Exception(responseBody['message'] ?? 'Failed to create post');
      }
    } catch (e) {
      throw Exception('Error creating post: $e');
    }
  }
}
