import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/api_service.dart';
import 'package:frontend/storage/authentication.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:path/path.dart';
import 'package:provider/provider.dart';

class PostApiService {
  final String baseUrl;

  PostApiService(this.baseUrl);
  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> getAllPosts() async {
    ApiService apiService = ApiService("http://localhost:3000");
    final authProvider =
        Provider.of<AuthProvider>(context as BuildContext, listen: false);
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
}
