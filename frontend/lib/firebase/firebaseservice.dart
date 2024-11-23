import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:path/path.dart';
import 'package:image_picker/image_picker.dart';

class FirebaseService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  /// Upload an image (given as an XFile) to Firebase Storage.
  /// Returns the download URL of the uploaded image.
  Future<String?> uploadImage(XFile image) async {
    try {
      // Create a reference to Firebase Storage with a unique file name
      String fileName = basename(image.path);
      Reference ref = _storage.ref().child('images/$fileName');

      // Upload the image file to Firebase Storage
      await ref.putFile(File(image.path));

      // Get the download URL
      return await ref.getDownloadURL();
    } catch (e) {
      print('Error uploading image: $e');
      return null;
    }
  }

  /// Download an image from Firebase Storage using its URL.
  /// Returns the File object of the downloaded image.
  Future<File?> downloadImage(String url) async {
    try {
      // Create a reference to the image in Firebase Storage
      Reference ref = _storage.refFromURL(url);

      // Specify a local path to save the downloaded file
      String tempPath = '/tmp/${basename(ref.fullPath)}';
      File downloadToFile = File(tempPath);

      // Download the image to the specified file path
      await ref.writeToFile(downloadToFile);
      return downloadToFile;
    } catch (e) {
      print('Error downloading image: $e');
      return null;
    }
  }
}
