import 'package:flutter/material.dart';

class AuthProvider with ChangeNotifier {
  String _token = '';

  String get token => _token;

  void setToken(String newToken) {
    _token = newToken;
    notifyListeners(); // Notify listeners about the change
  }

  void clearToken() {
    _token = '';
    notifyListeners(); // Notify listeners about the change
  }

  bool isAuthenticated() {
    return _token.isNotEmpty; // Check if the user is authenticated
  }
}
