import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/api_service.dart';
import 'package:frontend/appPages/page_card.dart';
import 'package:frontend/signup/signup.dart';
import 'package:frontend/storage/authentication.dart';
import 'package:frontend/utils/utility.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _errorMessage = "";

  bool _isEmailValid(String email) {
    final RegExp emailRegExp = RegExp(
      r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
    );
    return emailRegExp.hasMatch(email);
  }

  Future<void> _initiateLogin() async {
    String email = _emailController.text.trim();
    String password = _passwordController.text.trim();

    if (email.isEmpty) {
      _errorMessage =
          password.isEmpty ? "Email and Password are Empty" : "Email is Empty";
      setState(() {});
      return;
    }

    if (!_isEmailValid(email)) {
      _errorMessage = "Email is in invalid format";
      setState(() {});
      return;
    }

    if (password.isEmpty) {
      _errorMessage = "Password is Empty";
      setState(() {});
      return;
    }

    ApiService apiService = ApiService("http://localhost:3000");
    try {
      var responseBody = await apiService.login(email, password);

      if (!mounted) return;

      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      authProvider.setToken(responseBody["access_token"]);

      _errorMessage = "";

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const PageCard(),
        ),
      );
    } catch (exception) {
      _errorMessage = Utils.getReadableErrorMessage(exception.toString());
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          padding:
              const EdgeInsets.only(top: 50, bottom: 40, left: 50, right: 50),
          decoration: BoxDecoration(
            border: Border.all(width: 1, color: Colors.black),
            borderRadius: const BorderRadius.all(Radius.circular(10)),
          ),
          child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  child: const Text(
                    "Login Your Account",
                    style: TextStyle(
                      fontSize: 22,
                    ),
                  ),
                ),
                const SizedBox(
                  height: 50,
                  width: 0,
                ),
                SizedBox(
                  width: 350,
                  child: TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      label: Text("Email"),
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(
                  height: 10,
                  width: 0,
                ),
                SizedBox(
                  width: 350,
                  child: TextField(
                    controller: _passwordController,
                    decoration: const InputDecoration(
                      label: Text("Password"),
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                if (_errorMessage != "")
                  Container(
                    width: 280,
                    padding: const EdgeInsets.only(
                      top: 20,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.warning,
                          color: Colors.red,
                        ),
                        Text(_errorMessage,
                            style: const TextStyle(
                              color: Colors.red,
                            )),
                      ],
                    ),
                  ),
                const SizedBox(
                  height: 20,
                  width: 0,
                ),
                SizedBox(
                  width: 100,
                  child: TextButton(
                    onPressed: _initiateLogin,
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text("Login"),
                  ),
                ),
                const SizedBox(
                  height: 20,
                  width: 0,
                ),
                SizedBox(
                  width: 100,
                  child: TextButton(
                    onPressed: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => SignUpPage()));
                    },
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text("Sign Up"),
                  ),
                ),
              ]),
        ),
      ),
    );
  }
}
