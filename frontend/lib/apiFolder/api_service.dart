import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontend/storage/authentication.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:provider/provider.dart';

class ApiService {
  final String baseUrl;

  ApiService(this.baseUrl);
  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> login(String email, String password) async {
    Uri url = Uri.parse("$baseUrl/auth/login");

    print('Sending POST request to: $url');
    print(
        'Request body: ${jsonEncode({'email': email, 'password': password})}');

    try {
      final response = await http.post(
        url,
        body: jsonEncode({'email': email, 'password': password}),
        headers: base_headers,
      );

      print('Response status code: ${response.statusCode}');

      if (response.statusCode >= 200 && response.statusCode < 300) {
        print('Response body: ${response.body}');
        return json.decode(response.body);
      } else {
        final responseBody = json.decode(response.body);
        print('Error response body: $responseBody');
        throw Exception(responseBody['message'] ?? 'Unknown error occurred');
      }
    } catch (e) {
      print('Error during login API call: $e');
      rethrow;
    }
  }

  Future<dynamic> signUp(String email, String password) async {
    final url = Uri.parse('$baseUrl/users/send-verification');

    try {
      final response = await http.post(
        url,
        body: jsonEncode({'email': email, 'password': password}),
        headers: base_headers,
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to sign up: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error during sign up: $e');
    }
  }

  Future<dynamic> sendVerificationCode(
      BuildContext context, String email, String enteredCode) async {
    Uri url = Uri.parse("http://localhost:3000/users/verify-code");
    try {
      final Response response = await http.post(
        url,
        body: jsonEncode({'email': email, 'code': enteredCode}),
        headers: {'Content-Type': 'application/json'},
      );
      var responseBody = jsonDecode(response.body);
      if (responseBody['message'] != null) {
        return response;
      } else {
        return null;
      }
    } catch (exception) {
      return null;
    }
  }

  Future<dynamic> addUserContacts(BuildContext context,
      List<String> contactTypes, List<String> contactValues) async {
    final authProvider =
        Provider.of<AuthProvider>(context as BuildContext, listen: false);
    String jwtToken = authProvider.token;

    final Uri url = Uri.parse("$baseUrl/contacts");

    int counter = contactTypes.length;
    try {
      List<Map<String, String>> contacts = [];
      for (int i = 0; i < counter; i++) {
        contacts.add({
          'contact_type': contactTypes[i],
          'contact_value': contactValues[i]
        });
      }
      final Response response = await http.post(
        url,
        body: json.encode({'contacts': contacts}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwtToken,
        },
      );
      return response;
    } catch (exception) {
      return (exception);
    }
  }
}
