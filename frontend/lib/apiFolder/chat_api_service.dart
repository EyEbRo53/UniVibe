import 'dart:convert';
import 'package:flutter/src/widgets/framework.dart';
import 'package:frontend/storage/authentication.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:path/path.dart';
import 'package:provider/provider.dart';

class ChatApiService {
  final String baseUrl;
  Future<List<dynamic>>? _futureChats;

  ChatApiService(this.baseUrl);

  final baseHeaders = {'Content-Type': 'application/json'};

  Future<dynamic> getAllChats() async {
    final authProvider =
        Provider.of<AuthProvider>(context as BuildContext, listen: false);

    String jwtToken = authProvider.token;
    Uri uri = Uri.parse("$baseUrl/chat/get-chats");
    try {
      Response response = await http.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwtToken,
        },
      );
      if (response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        return "Failed to Post: ${json.decode(response.body)}";
      }
    } catch (error) {
      print("Error: $error");
      return "Unknown error occurred";
    }
  }

  Future<dynamic> getMessages(int userId) async {
    final authProvider =
        Provider.of<AuthProvider>(context as BuildContext, listen: false);

    String jwtToken = authProvider.token;

    Uri uri = Uri.parse("$baseUrl/chat/get-messages");
    try {
      Response response = await http.post(uri,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtToken
          },
          body: jsonEncode({"receiverId": 17}));
      if (response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        return "Failed to Get Messages: ${json.decode(response.body)}";
      }
    } catch (error) {
      print("Error: $error");
      return "Unknown error occurred";
    }
  }
}
