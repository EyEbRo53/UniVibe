import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/image_service.dart';
import 'package:image_picker/image_picker.dart';

class CreatePostPage extends StatefulWidget {
  const CreatePostPage({super.key});

  @override
  _CreatePostPageState createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _activityTypeController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();
  final List<String> _tags = [];
  String? _expiryDate;
  bool _isLoading = false;

  void _addTag(String tag) {
    setState(() {
      if (tag.isNotEmpty && !_tags.contains(tag)) {
        _tags.add(tag);
        _activityTypeController.clear();
      }
    });
  }

  void _pickExpiryDate() async {
    try {
      final pickedDate = await showDatePicker(
        context: context,
        initialDate: DateTime.now(),
        firstDate: DateTime.now(),
        lastDate: DateTime.now().add(const Duration(days: 365)), // 1 year range
      );
      if (pickedDate != null) {
        setState(() {
          _expiryDate = "${pickedDate.toLocal()}".split(' ')[0];
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error picking date: $e")),
      );
    }
  }

  void _createPost() {
    if (_titleController.text.isEmpty || _descriptionController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Title and Description are required.")),
      );
      return;
    }

    setState(() => _isLoading = true);

    // Simulate a delay for loading indicator
    Future.delayed(const Duration(seconds: 2), () {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Post Created: ${_titleController.text}")),
      );
    });
  }
  int widthThreshold=1000;
  @override
  Widget build(BuildContext context) {
  double screenWidth=MediaQuery.of(context).size.width;
  double paddingAmt= screenWidth<widthThreshold?40:120;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Create New Activity"),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: paddingAmt),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   const Text("Activity Details", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),

                  // Title
                  TextField(
                    controller: _titleController,
                    maxLength: 50,
                    decoration: const InputDecoration(
                      labelText: "Activity Title",
                      prefixIcon: Icon(Icons.title),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Description
                  TextField(
                    controller: _descriptionController,
                    maxLength: 250,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: "Activity Description",
                      prefixIcon: Icon(Icons.description),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Activity Type
                  const Text("Activity Type", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _activityTypeController,
                    decoration: InputDecoration(
                      labelText: "Activity Type",
                      prefixIcon: const Icon(Icons.tag),
                      border: const OutlineInputBorder(),
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.add),
                        onPressed: () {
                          _addTag(_activityTypeController.text);
                        },
                      ),
                    ),
                    onSubmitted: _addTag,
                  ),
                  const SizedBox(height: 8),

                  Wrap(
                    spacing: 8,
                    children: _tags.map((tag) {
                      return Chip(
                        label: Text(tag, style: const TextStyle(color: Colors.white)),
                        backgroundColor: Colors.deepPurple,
                        deleteIconColor: Colors.white,
                        deleteIcon: const Icon(Icons.close),
                        onDeleted: () {
                          setState(() {
                            _tags.remove(tag);
                          });
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // Location
                  TextField(
                    controller: _locationController,
                    decoration: const InputDecoration(
                      labelText: "Location",
                      prefixIcon: Icon(Icons.location_on),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Expiry Date Picker
                  const Text("Expiry Date", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: Text(_expiryDate ?? "No date selected", style: const TextStyle(fontSize: 16)),
                      ),
                      ElevatedButton(
                        onPressed: _pickExpiryDate,
                        child: const Text("Pick Date"),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Attachments Section Placeholder
                  const Text("Attachments", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Row(
                    children: [
                      Icon(Icons.image, color: Colors.grey),
                      SizedBox(width: 8),
                      Text("Add Attachments"),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Create Post button at bottom-right
            Align(
              alignment: Alignment.bottomRight,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _createPost,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isLoading ? Colors.grey : Colors.deepPurple,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          "Create Post",
                          style: TextStyle(color: Colors.white, fontSize: 16),
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
