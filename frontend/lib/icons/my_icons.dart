import 'package:flutter/material.dart';

class CustomIcons {
  static Widget instagramIcon = Container(
    decoration: BoxDecoration(
      color: Colors.white, // Optional: white background for contrast
      borderRadius: BorderRadius.circular(12), // Rounded corners
    ),
    child: ClipRRect(
      borderRadius: BorderRadius.circular(12), // Make sure the corners are rounded
      child: Image.asset(
        'assets/images/instagram.png', // Path to the Instagram icon
        width: 24,
        height: 24,
        fit: BoxFit.cover, // Ensure the image covers the container
      ),
    ),
  );

  static Widget xIcon = Container(
    decoration: BoxDecoration(
      color: Colors.white, // Optional: white background for contrast
      borderRadius: BorderRadius.circular(12), // Rounded corners
    ),
    child: ClipRRect(
      borderRadius: BorderRadius.circular(12), // Make sure the corners are rounded
      child: Image.asset(
        'assets/images/x.png', // Path to the X icon
        width: 24,
        height: 24,
        fit: BoxFit.cover, // Ensure the image covers the container
      ),
    ),
  );

  static Widget whatsappIcon = Container(
    decoration: BoxDecoration(
      color: Colors.white, // Optional: white background for contrast
      borderRadius: BorderRadius.circular(12), // Rounded corners
    ),
    child: ClipRRect(
      borderRadius: BorderRadius.circular(12), // Make sure the corners are rounded
      child: Image.asset(
        'assets/images/whatsapp.png', // Path to the WhatsApp icon
        width: 24,
        height: 24,
        fit: BoxFit.cover, // Ensure the image crovers the container
      ),
    ),
  );
}