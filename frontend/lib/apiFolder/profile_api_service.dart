import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:frontend/storage/authentication.dart';

class ProfileApiService {
  final String baseUrl;

  ProfileApiService(this.baseUrl);

  final baseHeaders = {'Content-Type': 'application/json'};

  Future<dynamic> getProfileInfo(AuthProvider authProvider) async {
    try {
      // Extract the token
      final token = authProvider.token;

      if (token.isEmpty) {
        throw Exception('User is not authenticated.');
      }

      // Decode the token to extract the user ID
      final payload = json.decode(
        utf8.decode(
          base64Url.decode(base64Url.normalize(token.split('.')[1])),
        ),
      );
      final userId = payload['user_id'];

      if (userId == null) {
        throw Exception('User ID not found in the token.');
      }

      // Make the API request
      final url = Uri.parse('$baseUrl/users/$userId/profile');
      final response = await http.get(url, headers: baseHeaders);

      if (response.statusCode == 200) {
        // Parse and return the JSON response
        return json.decode(response.body);
      } else {
        throw Exception(
            'Failed to fetch profile info: ${response.statusCode} ${response.body}');
      }
    } catch (e) {
      throw Exception('Error fetching profile info: $e');
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
  Future<http.Response> replaceContactInfo(String authToken, int contactId,
      String contactType, String contactValue) async {
    final url = Uri.parse('$baseUrl/contacts/replace-contact');

    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $authToken',
      },
      body: jsonEncode({
        'contact_id': contactId,
        'contact_type': contactType,
        'contact_value': contactValue,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception(
          'Failed to replace contact info: ${response.statusCode} ${response.body}');
    }

    return response;
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
