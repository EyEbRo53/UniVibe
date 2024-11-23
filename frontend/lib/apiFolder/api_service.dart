import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class ApiService {
  final String baseUrl;

  ApiService(this.baseUrl);
  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> login(String email, String password) async {
    Uri url = Uri.parse("$baseUrl/auth/login");

    // Print the URL and the body of the request
    print('Sending POST request to: $url');
    print(
        'Request body: ${jsonEncode({'email': email, 'password': password})}');

    try {
      final response = await http.post(
        url,
        body: jsonEncode({'email': email, 'password': password}),
        headers: base_headers,
      );

      // Log the status code of the response
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
        url, body: jsonEncode({'email': email, 'code': enteredCode}),
        headers: {
          'Content-Type': 'application/json'
        }, // Set content type for JSON
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
    final responseLogin = await login("abdurrehman4415@gmail.com", "a12345678");

    final jwtToken = "Bearer ${responseLogin['access_token']}";
    //final jwtToken = Provider.of<AuthProvider>(context, listen: false).token;
    // const token =
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImFiZHVycmVobWFuNDQxNUBnbWFpbC5jb20iLCJpYXQiOjE3MzAwNTg0NDh9.qoOUEazuDozg2oaMOsg02DXTHop1w8nzsm4pZr-Reyg";
    // const jwtToken = "Bearer 3219371298371";

    // print(jwtToken);
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
