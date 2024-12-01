// import 'dart:convert';
// import 'dart:io';
// import 'dart:typed_data';
// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'package:url_launcher/url_launcher.dart';

// class ImgurAuthService {
//   final String clientId = '';
//   final String clientSecret = '';
//   final String redirectUri = 'http://localhost:3000'; // e.g., https://localhost
  
//   Future<String?> authenticate(BuildContext context) async {
//     final Uri authorizationUrl = Uri.https('api.imgur.com', '/oauth2/authorize', {
//       'client_id': clientId,
//       'response_type': 'code',
//       'state': 'some_random_state',
//     });

//     if (await canLaunchUrl(authorizationUrl)) {
//       await launchUrl(authorizationUrl, mode: LaunchMode.externalApplication);
//     } else {
//       throw 'Could not launch $authorizationUrl';
//     }

//     return await _getAccessToken();
//   }

//   Future<String?> _getAccessToken() async {
//     print('Please paste the authorization code from the browser:');
//     final code = stdin.readLineSync();

//     final response = await http.post(
//       Uri.parse('https://api.imgur.com/oauth2/token'),
//       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//       body: {
//         'client_id': clientId,
//         'client_secret': clientSecret,
//         'grant_type': 'authorization_code',
//         'code': code,
//         'redirect_uri': redirectUri,
//       },
//     );

//     if (response.statusCode == 200) {
//       final responseData = jsonDecode(response.body);
//       print('Access Token: ${responseData['access_token']}');
//       return responseData['access_token'];
//     } else {
//       print('Failed to get access token: ${response.body}');
//       return null;
//     }
//   }

//   /// Uploads an image to Imgur using the authenticated user's access token.
//   Future<String?> uploadImage(Uint8List imageBytes, String accessToken) async {
//     try {
//       final response = await http.post(
//         Uri.parse('https://api.imgur.com/3/image'),
//         headers: {
//           'Authorization': 'Bearer $accessToken',
//         },
//         body: {
//           'image': base64Encode(imageBytes),
//           'type': 'base64',
//         },
//       );

//       if (response.statusCode == 200) {
//         final jsonResponse = jsonDecode(response.body);
//         return jsonResponse['data']['link'];
//       } else {
//         print('Failed to upload: ${response.body}');
//         return null;
//       }
//     } catch (e) {
//       print('Error uploading image: $e');
//       return null;
//     }
//   }
// }
