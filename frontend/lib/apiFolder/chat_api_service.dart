import 'dart:convert';
import 'package:frontend/apiFolder/api_service.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';


class ChatApiService {
  final String baseUrl;
  Future<List<dynamic>>? _futureChats;

  ChatApiService(this.baseUrl);

  final base_headers = {'Content-Type': 'application/json'};

  Future<dynamic> getAllChats() async {
    ApiService apiService = ApiService(baseUrl);
    final responseLogin = await apiService.login("abdurrehman4415@gmail.com", "a12345678");

    String jwtToken = "Bearer ${responseLogin['access_token']}";

    Uri uri = Uri.parse("$baseUrl/chat/get-chats");
    try {
      Response response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json','Authorization':jwtToken},
      );
      if (response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        return "Failed to Post: ${json.decode(response.body) }";
      }
    } catch (error) {
      print("Error: $error");
      return "Unknown error occurred";
    }
  }
  Future<dynamic> getMessages(int userId) async {
    ApiService apiService = ApiService(baseUrl);
    final responseLogin = await apiService.login("abdurrehman4415@gmail.com", "a12345678");

    String jwtToken = "Bearer ${responseLogin['access_token']}";

    Uri uri = Uri.parse("$baseUrl/chat/get-messages");
    try {
      Response response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json','Authorization':jwtToken},
        body: jsonEncode({ "receiverId": 17})
      );
      if (response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        return "Failed to Get Messages: ${json.decode(response.body) }";
      }
    } catch (error) {
      print("Error: $error");
      return "Unknown error occurred";
    }
  }
}