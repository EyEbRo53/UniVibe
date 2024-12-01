import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider with ChangeNotifier {
  String _token = '';

  String get token => _token;

  Future<void> setToken(String newToken) async {
    _token = newToken;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', _token);
    notifyListeners();
  }

  Future<void> clearToken() async {
    _token = '';
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    notifyListeners();
  }

  Future<void> loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token') ?? '';
    notifyListeners();
  }

  bool isAuthenticated() {
    return _token.isNotEmpty && isTokenValid(_token);
  }

  bool isTokenValid(String token) {
    try {
      final payload = json.decode(utf8
          .decode(base64Url.decode(base64Url.normalize(token.split(".")[1]))));
      final expiry = DateTime.fromMillisecondsSinceEpoch(payload['exp'] * 1000);
      return DateTime.now().isBefore(expiry);
    } catch (_) {
      return false;
    }
  }
}
