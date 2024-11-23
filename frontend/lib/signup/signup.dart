import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'verification.dart'; 

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  
  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
    
    
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  String _errorMessage = '';

  // Function to validate email format using regex
  bool _isEmailValid(String email) {
    // A basic email pattern, can be more strict if needed
    final RegExp emailRegExp = RegExp(
      r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
    );
    return emailRegExp.hasMatch(email);
  }

  // Function to validate password contains both alphabets and numbers
  bool _isPasswordValid(String password) {
    final RegExp passwordRegExp = RegExp(
      r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$', // At least 6 characters, with both letters and numbers
    );
    return passwordRegExp.hasMatch(password);
  }
  void  _signUp() async {
    //print("Running the sign up");
    String email = _emailController.text;
    String password = _passwordController.text;
    String confirmPassword = _confirmPasswordController.text;
    if (!_isEmailValid(email)) {
      setState(() {
        _errorMessage = 'Please enter a valid email';
      });
    } else if (!_isPasswordValid(password)) {
      setState(() {
        _errorMessage = 'Password must contain both letters and numbers';
      });
    } else if (password != confirmPassword) {
      setState(() {
        _errorMessage = 'Passwords do not match';
      });
    } else {
      // print("Sending post request");
      Uri url = Uri.parse("http://localhost:3000/users/send-verification");
      
      try{
        //sending sign in request
        final response = await http.post(url
        , body:jsonEncode({
          'email':email,
          'password':password
        }),
          headers: {'Content-Type': 'application/json'}, // Set content type for JSON 
        );
        var responseBody = jsonDecode(response.body);
        if(response.statusCode == 201){
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => VerificationPage(email: email),
            ));
        }
        else {
            setState(() {
              _errorMessage = responseBody['message'];//just print the recieved error message
            });
        } 
      }
      catch(exception){
        //print(exception);
        setState(() {
          _errorMessage = "Please try again later";
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fast Media App Users Page'),
      ),
      body: Center(
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.black, width: 2.0),
            borderRadius: BorderRadius.circular(10),
          ),
          padding: const EdgeInsets.only(
            top: 20,
            bottom: 40,
            left: 20,
            right: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              const Text(
                'Sign Up',
                style: TextStyle(
                  fontSize: 30,
                ),
              ),
              const SizedBox(height: 60),
              // Email TextField
              ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: 750,
                ),
                child: FractionallySizedBox(
                  widthFactor: 0.5,
                  child: TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'Enter Your Email',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.emailAddress,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Password TextField
              ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: 750,
                ),
                child: FractionallySizedBox(
                  widthFactor: 0.5,
                  child: TextField(
                    controller: _passwordController,
                    decoration: const InputDecoration(
                      labelText: 'Enter Your Password',
                      border: OutlineInputBorder(),
                    ),
                    obscureText: true,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Confirm Password TextField
              ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: 750,
                ),
                child: FractionallySizedBox(
                  widthFactor: 0.5,
                  child: TextField(
                    controller: _confirmPasswordController,
                    decoration: const InputDecoration(
                      labelText: 'Confirm Your Password',
                      border: OutlineInputBorder(),
                    ),
                    obscureText: true,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Sign Up Button
              Padding(
                padding: const EdgeInsets.all(10.0),
                child: SizedBox(
                  width: 170,
                  child: TextButton(
                    onPressed: _signUp,
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Sign Up'),
                  ),
                ),
              ),
              const SizedBox(height: 10),

              // Error Message for validation issues
              if (_errorMessage.isNotEmpty)
                Text(
                  _errorMessage,
                  style: const TextStyle(color: Colors.red),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
