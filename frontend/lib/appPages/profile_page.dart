import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/profile_api_service.dart';
import 'package:frontend/signup/contact_info.dart';
import 'package:provider/provider.dart';
import 'package:frontend/storage/authentication.dart';

class Contact {
  int contactId = 0;
  String contactType = "";
  String contactValue = "";
}

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late ProfileApiService profileApiService;
  String username = "Username";
  String email = "email@example.com";
  String? profilePicUrl;
  bool isLoading = true;

  List<Contact> _contacts = [];
  String _errorMessage = "";

  @override
  void initState() {
    super.initState();
    profileApiService = ProfileApiService('http://localhost:3000');
    _loadProfileInfo();
    _loadContactInfo();
  }

  Future<void> _loadProfileInfo() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final profileInfo = await profileApiService.getProfileInfo(authProvider);

      setState(() {
        username = profileInfo['user_name'] ?? 'Username';
        email = profileInfo['email'] ?? 'email@example.com';
        profilePicUrl = profileInfo['profile_pic_url'];
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  Future<void> _loadContactInfo() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final authToken = authProvider.token;

      // Fetch contact info from the API service
      final fetchedContacts = await profileApiService.getContactInfo(authToken);
      print('Fetched contacts: $fetchedContacts');

      if (fetchedContacts.isEmpty) {
        setState(() {
          _contacts = []; // No contacts available
        });
      } else {
        setState(() {
          // Map the fetched contacts to a list of `Contact` objects
          _contacts = fetchedContacts.map((contact) {
            return Contact()
              ..contactId = int.tryParse(contact['contact_id'] ?? '0') ?? 0
              ..contactType = contact['contact_type'] ?? ''
              ..contactValue = contact['contact_value'] ?? '';
          }).toList();
        });
      }
    } catch (e) {
      setState(() {
        _contacts = [];
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to load contacts')),
      );
    }
  }

  Future<void> _saveContacts() async {
    try {
      if (_contacts.any((contact) =>
          contact.contactType.isEmpty || contact.contactValue.isEmpty)) {
        setState(() {
          _errorMessage = "Contact types or values cannot be empty.";
        });
        return;
      }

      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final authToken = authProvider.token;

      final contacts = _contacts.map((contact) {
        return {
          'contact_type': contact.contactType,
          'contact_value': contact.contactValue,
        };
      }).toList();

      final response =
          await profileApiService.saveContactInfo(authToken, contacts);

      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Contacts saved!')));
      } else {
        setState(() {
          _errorMessage = "Failed to save contacts.";
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = "An error occurred: $e";
      });
    }
  }

  void _addContactRow() {
    setState(() {
      _contacts.add(Contact()
        ..contactType = ''
        ..contactValue = '');
    });
  }

  Widget _buildContactRows() {
    return _contacts.isEmpty
        ? const Center(child: Text('No contact info found'))
        : ListView.builder(
            shrinkWrap: true,
            itemCount: _contacts.length,
            itemBuilder: (context, index) {
              final contact = _contacts[index];
              return ContactRow(
                index: index,
                initialContactType: contact.contactType,
                initialContactValue: contact.contactValue,
                onChanged: (type, value) async {
                  setState(() {
                    contact.contactType = type;
                    contact.contactValue = value;
                  });
                  await _updateContactInDatabase(contact.contactId);
                },
                onDelete: () async {
                  print("index = $index");
                  final contactId = contact.contactId;
                  await _deleteContactFromDatabase(contactId);
                  setState(() {
                    _contacts.removeAt(index);
                  });
                },
              );
            },
          );
  }

  Future<void> _updateContactInDatabase(int index) async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final authToken = authProvider.token;

      final contact = _contacts[index];

      await profileApiService.replaceContactInfo(
        authToken,
        contact.contactId,
        contact.contactType,
        contact.contactValue,
      );

      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Contact updated successfully!')));
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Error updating contact: $e')));
    }
  }

  Future<void> _deleteContactFromDatabase(int contactId) async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final authToken = authProvider.token;

      await profileApiService.deleteContact(authToken, contactId);

      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Contact deleted successfully!')));
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Error deleting contact: $e')));
    }
  }

  void _logout() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    authProvider.logout();
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile Page'),
        backgroundColor: Colors.blueAccent,
        actions: [
          IconButton(
            icon: const Icon(Icons.exit_to_app),
            onPressed: _logout,
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // Profile Info Section
                    Center(
                      child: Column(
                        children: [
                          CircleAvatar(
                            radius: 50,
                            backgroundColor: Colors
                                .grey[200], // Optional: Add a background color
                            backgroundImage: profilePicUrl != null
                                ? NetworkImage(profilePicUrl!) as ImageProvider
                                : null,
                            child: profilePicUrl == null
                                ? const Icon(
                                    Icons.person, // Default fallback icon
                                    size: 50, // Adjust size as needed
                                    color: Colors.grey, // Icon color
                                  )
                                : null,
                          ),
                          const SizedBox(height: 10),
                          Text(username, style: const TextStyle(fontSize: 20)),
                          Text(email,
                              style: const TextStyle(color: Colors.grey)),
                        ],
                      ),
                    ),
                    const Divider(height: 40, thickness: 2),

                    // Contact Info Section
                    const Text(
                      'Contact Info',
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    _buildContactRows(),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: _addContactRow,
                      child: const Text('Add Another Contact'),
                    ),
                    ElevatedButton(
                      onPressed: _saveContacts,
                      child: const Text('Save Contacts'),
                    ),
                    if (_errorMessage.isNotEmpty)
                      Text(
                        _errorMessage,
                        style: const TextStyle(color: Colors.red),
                      ),
                    const Divider(height: 40, thickness: 2),
                    // Logout section
                    const Text(
                      'Logout',
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),

                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: _logout,
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class ContactRow extends StatefulWidget {
  final int index;
  final String initialContactType;
  final String initialContactValue;
  final Function(String type, String value) onChanged;
  final VoidCallback onDelete;

  const ContactRow({
    super.key,
    required this.index,
    required this.initialContactType,
    required this.initialContactValue,
    required this.onChanged,
    required this.onDelete,
  });

  @override
  _ContactRowState createState() => _ContactRowState();
}

class _ContactRowState extends State<ContactRow> {
  late String selectedContactType;
  late TextEditingController valueController;

  @override
  void initState() {
    super.initState();
    // Initialize the dropdown value and text field controller
    selectedContactType = widget.initialContactType;
    valueController = TextEditingController(text: widget.initialContactValue);
  }

  @override
  void dispose() {
    // Dispose the controller when the widget is destroyed
    valueController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        DropdownButton<String>(
          value: selectedContactType.isEmpty ? null : selectedContactType,
          hint: const Text('Select Type'),
          items: const [
            DropdownMenuItem(value: 'LinkedIn', child: Text('LinkedIn')),
            DropdownMenuItem(value: 'Twitter', child: Text('Twitter')),
            DropdownMenuItem(
                value: 'Phone Number', child: Text('Phone Number')),
          ],
          onChanged: (String? type) {
            if (type != null) {
              setState(() {
                selectedContactType = type;
              });
              widget.onChanged(selectedContactType, valueController.text);
            }
          },
        ),
        SizedBox(
          width: 150,
          child: TextField(
            controller: valueController,
            decoration: const InputDecoration(labelText: 'Contact Value'),
            onChanged: (value) {
              widget.onChanged(selectedContactType, value);
            },
          ),
        ),
        IconButton(
          icon: const Icon(Icons.delete),
          onPressed: widget.onDelete,
        ),
      ],
    );
  }
}
