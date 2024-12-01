// ignore_for_file: unused_import

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:frontend/appPages/page_card.dart';
import 'package:frontend/signup/contact_info.dart';
import 'package:frontend/signup/login.dart';
import 'package:frontend/signup/signup_username.dart';
import 'package:frontend/signup/verification.dart';
import './signup/signup.dart'; // Adjust the import based on your file structure
import 'package:provider/provider.dart';
import 'storage/authentication.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final authProvider = AuthProvider();
  await authProvider.loadToken(); // Load saved token

  runApp(
    ChangeNotifierProvider(
      create: (context) => authProvider,
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return MaterialApp(
      title: 'UniVibe',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.red),
        useMaterial3: true,
      ),
      home:
          authProvider.isAuthenticated() ? const PageCard() : const LoginPage(),
    );
  }
}
