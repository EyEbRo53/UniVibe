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

  /// Save contact information for a user
  Future<http.Response> saveContactInfo(
      String authToken, List<Map<String, String>> contacts) async {
    final url = Uri.parse('$baseUrl/contacts/add-contacts');

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $authToken',
      },
      body: jsonEncode({'contacts': contacts}), // Send contacts as the body
    );

    if (response.statusCode != 201 && response.statusCode != 200) {
      throw Exception(
          'Failed to save contact info: ${response.statusCode} ${response.body}');
    }

    return response;
  }

  /// Retrieve contact information for a user
  Future<List<Map<String, dynamic>>> getContactInfo(String authToken) async {
    try {
      final url = Uri.parse('$baseUrl/contacts/');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $authToken',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final contacts = data['contacts'] as List<dynamic>;

        return contacts.map((contact) {
          return {
            'contact_id': contact['contact_id'].toString(),
            'contact_type': contact['contact_type'],
            'contact_value': contact['contact_value'],
          };
        }).toList();
      } else {
        throw Exception('Failed to fetch contacts: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching contacts: $e');
      return []; // Return an empty list on error
    }
  }

  /// Replace a contact's information
  Future<Map<String, dynamic>> replaceContactInfo(String authToken,
      int contactId, String contactType, String contactValue) async {
    const replaceContactPath = '/contacts/replace-contact';
    final url = Uri.parse('$baseUrl$replaceContactPath');

    // Validate input
    if (authToken.isEmpty) {
      throw Exception('Authorization token is missing.');
    }
    if (contactType.isEmpty || contactValue.isEmpty) {
      throw Exception('Contact type and value cannot be empty.');
    }

    try {
      final response = await http
          .put(
        url,
        headers: {
          'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode({
          'contact_id': contactId,
          'contact_type': contactType,
          'contact_value': contactValue,
        }),
      )
          .timeout(const Duration(seconds: 10), onTimeout: () {
        throw Exception('Request timed out. Please try again.');
      });

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        String errorMessage = 'Failed to replace contact info. ';
        try {
          final responseBody = jsonDecode(response.body);
          errorMessage += responseBody['message'] ?? response.body;
        } catch (e) {
          errorMessage += 'No detailed error provided.';
        }
        throw Exception('$errorMessage (Status Code: ${response.statusCode})');
      }
    } catch (e) {
      print('Error in replaceContactInfo: $e');
      rethrow;
    }
  }

  /// Delete a contact
  Future<http.Response> deleteContact(String authToken, int contactId) async {
    final url =
        Uri.parse('$baseUrl/contacts/delete-contact?contact_id=$contactId');

    final response = await http.delete(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $authToken',
      },
    );

    if (response.statusCode != 200) {
      throw Exception(
          'Failed to delete contact: ${response.statusCode} ${response.body}');
    }
    return response;
  }
}
