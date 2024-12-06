import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/api_service.dart';
import 'package:frontend/storage/authentication.dart'; // Replace with actual location
import 'package:path/path.dart' as Path;
import 'package:provider/provider.dart';

class ContactInfoPage extends StatefulWidget {
  const ContactInfoPage({super.key});

  @override
  State<ContactInfoPage> createState() => _ContactInfoPageState();
}

class _ContactInfoPageState extends State<ContactInfoPage> {
  late ApiService apiService;
  final _formKey = GlobalKey<FormState>(); // Main form key
  final _dialogFormKey = GlobalKey<FormState>(); // Dialog form key (new)

  final TextEditingController contactTypeController = TextEditingController();
  final TextEditingController contactValueController = TextEditingController();
  List<Map<String, dynamic>> contacts = [];

  bool isLoading = false;

  Future<void> _loadContacts(String authToken) async {
    setState(() => isLoading = true);
    try {
      final fetchedContacts = await apiService.getContactInfo(authToken);
      setState(() => contacts = fetchedContacts);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to fetch contacts: $e')),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> _addContact(String authToken) async {
    if (_formKey.currentState!.validate()) {
      final contact = {
        'contact_type': contactTypeController.text.trim(),
        'contact_value': contactValueController.text.trim(),
      };
      setState(() => isLoading = true);
      try {
        await apiService.saveContactInfo(authToken, [contact]);
        await _loadContacts(authToken); // Reload contacts after adding
        contactTypeController.clear();
        contactValueController.clear();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Contact added successfully!')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to add contact: $e')),
        );
      } finally {
        setState(() => isLoading = false);
      }
    }
  }

  Future<void> _deleteContact(String authToken, int contactId) async {
    setState(() => isLoading = true);
    try {
      await apiService.deleteContact(authToken, contactId);
      await _loadContacts(authToken); // Reload contacts after deletion
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Contact deleted successfully!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete contact: $e')),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  // Future<void> _replaceContact(String authToken, int contactId) async {
  //   if (_formKey.currentState!.validate()) {
  //     final contactType = contactTypeController.text.trim();
  //     final contactValue = contactValueController.text.trim();

  //     print("Inside replace contact function, contactId: $contactId");
  //     setState(() => isLoading = true);
  //     try {
  //       // Ensure contactId is an integer
  //       await apiService.replaceContactInfo(
  //         authToken,
  //         contactId, // contactId should be an integer
  //         contactType,
  //         contactValue,
  //       );
  //       await _loadContacts(authToken); // Reload contacts after replacement
  //       ScaffoldMessenger.of(context).showSnackBar(
  //         const SnackBar(content: Text('Contact replaced successfully!')),
  //       );
  //     } catch (e) {
  //       ScaffoldMessenger.of(context).showSnackBar(
  //         SnackBar(content: Text('Failed to replace contact: $e')),
  //       );
  //     } finally {
  //       setState(() => isLoading = false);
  //     }
  //   } else {
  //     print("not valid key.");
  //   }
  // }

  // void _showEditDialog(String authToken, Map<String, dynamic> contact) {
  //   contactTypeController.text = contact['contact_type'];
  //   contactValueController.text = contact['contact_value'];

  //   showDialog(
  //     context: context,
  //     builder: (context) {
  //       return AlertDialog(
  //         title: const Text('Edit Contact'),
  //         content: Form(
  //           key: _dialogFormKey, // Use dialog-specific key
  //           child: Column(
  //             mainAxisSize: MainAxisSize.min,
  //             children: [
  //               TextFormField(
  //                 controller: contactTypeController,
  //                 decoration: const InputDecoration(labelText: 'Type'),
  //                 validator: (value) => value!.isEmpty ? 'Required' : null,
  //               ),
  //               TextFormField(
  //                 controller: contactValueController,
  //                 decoration: const InputDecoration(labelText: 'Value'),
  //                 validator: (value) => value!.isEmpty ? 'Required' : null,
  //               ),
  //             ],
  //           ),
  //         ),
  //         actions: [
  //           TextButton(
  //             onPressed: () => Navigator.of(context).pop(),
  //             child: const Text('Cancel'),
  //           ),
  //           ElevatedButton(
  //             onPressed: () {
  //               Navigator.of(context).pop();
  //               _replaceContact(authToken, contact['contact_id']);
  //             },
  //             child: const Text('Save'),
  //           ),
  //         ],
  //       );
  //     },
  //   );
  // }

  @override
  void initState() {
    super.initState();
    apiService = ApiService('http://localhost:3000');
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final authToken = authProvider.token;
    _loadContacts(authToken);
  }

  void _onConfirmPressed() {
    // Navigate to '/page_card'
    Navigator.pushNamed(context, '/page card');
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final authToken = authProvider.token;

    return Scaffold(
      appBar: AppBar(title: const Text('Manage Contacts')),
      body: authToken == null
          ? const Center(child: Text('Please log in to manage contacts.'))
          : isLoading
              ? const Center(child: CircularProgressIndicator())
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Form(
                        key: _formKey,
                        child: Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: contactTypeController,
                                decoration:
                                    const InputDecoration(labelText: 'Type'),
                                validator: (value) =>
                                    value!.isEmpty ? 'Required' : null,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: TextFormField(
                                controller: contactValueController,
                                decoration:
                                    const InputDecoration(labelText: 'Value'),
                                validator: (value) =>
                                    value!.isEmpty ? 'Required' : null,
                              ),
                            ),
                            const SizedBox(width: 16),
                            ElevatedButton(
                              onPressed: () => _addContact(authToken),
                              child: const Text('Add'),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      Expanded(
                        child: contacts.isEmpty
                            ? const Center(child: Text('No contacts found.'))
                            : ListView.builder(
                                itemCount: contacts.length,
                                itemBuilder: (context, index) {
                                  final contact = contacts[index];
                                  return ListTile(
                                    title: Text(contact['contact_type']),
                                    subtitle: Text(contact['contact_value']),
                                    trailing: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        // IconButton(
                                        //   icon: const Icon(Icons.edit),
                                        //   onPressed: () => _showEditDialog(
                                        //       authToken, contact),
                                        // ),
                                        IconButton(
                                          icon: const Icon(Icons.delete),
                                          onPressed: () => _deleteContact(
                                            authToken,
                                            int.parse(contact['contact_id']),
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        child: ElevatedButton(
                          onPressed:
                              _onConfirmPressed, // Navigate to '/page_card'
                          child: const Text('Confirm'),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
