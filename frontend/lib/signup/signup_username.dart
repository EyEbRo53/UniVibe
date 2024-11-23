import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontend/signup/contact_info.dart';
import 'package:frontend/signup/login.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class SignupUsername extends StatefulWidget {
  final String email;
  const SignupUsername({super.key, required this.email});

  @override
  State<SignupUsername> createState() => _SignupUsernameState();
}

class _SignupUsernameState extends State<SignupUsername> {
  final TextEditingController _usernameController = TextEditingController();
  String _errorMessage = "";

  Future<void> _finishSignUp() async {
    String username = _usernameController.text;
    if (username.isNotEmpty) {
      const String req = "http://localhost:3000/users/register";
      Uri url = Uri.parse(req);
      try {
        final Response response = await http.post(
          url,
          body: jsonEncode({
            'user_name': username,
            'email': widget.email,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        );
        if (response.statusCode == 201) {
          //final authProvider = Provider.of<AuthProvider>(context, listen: false);
          // ApiService apiService = ApiService("http://localhost:3000");
          // authProvider.setToken("");
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => ContactInfoPage()),
          );
        } else {
          final decodedResponse = jsonDecode(response.body); // Decode JSON body
          setState(() {
            _errorMessage = decodedResponse['message'] ?? 'Unknown error occurred';
          });
        }
      } catch (error) {
        setState(() {
          _errorMessage = 'Failed to register: $error';
        });
      }
    } else {
      setState(() {
        _errorMessage = "Username cannot be empty";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(30),
          decoration: BoxDecoration(
            border: Border.all(width: 1, color: Colors.black),
            borderRadius: const BorderRadius.all(Radius.circular(10)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Padding(
                padding: EdgeInsets.only(bottom: 20),
                child: Text(
                  "Enter Your Username to finish Sign up",
                  style: TextStyle(
                    fontSize: 22,
                  ),
                ),
              ),
              SizedBox(
                width: 300,
                child: TextField(
                  controller: _usernameController,
                  decoration: const InputDecoration(
                    labelText: 'Username',
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              TextButton(
                style: TextButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                ),
                onPressed: _finishSignUp,
                child: const Text("Confirm Username"),
              ),
              if (_errorMessage.isNotEmpty) // Only show if there's an error
                Padding(
                  padding: const EdgeInsets.only(top: 20),
                  child: Text(
                    _errorMessage,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

// Success page after sign up
class SuccessPage extends StatelessWidget {
  const SuccessPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "Sign Up Complete",
              style: TextStyle(fontSize: 22),
            ),
            const SizedBox(height: 20),
            TextButton(
              onPressed: () {
                Navigator.pushReplacement(
                    context, MaterialPageRoute(builder: (context) => const LoginPage()));
              },
              child: const Text(
                "Go to Home Page",
                style: TextStyle(color: Colors.blue),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
