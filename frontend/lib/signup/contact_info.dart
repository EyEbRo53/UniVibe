import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/api_service.dart';
import 'package:frontend/icons/my_icons.dart';
import 'package:http/http.dart';

List<DropdownMenuItem<String>> contactTypes = [
  const DropdownMenuItem(
    value: 'Phone Number',
    child: Row(
      children: [
        Icon(Icons.phone),
        SizedBox(width: 8),
        Text("Phone Number"),
      ],
    ),
  ),
  DropdownMenuItem(
    value: 'Whatsapp',
    child: Row(
      children: [
        CustomIcons.whatsappIcon,
        const SizedBox(width: 8),
        const Text("Whatsapp"),
      ],
    ),
  ),
  DropdownMenuItem(
    value: 'Instagram',
    child: Row(
      children: [
        CustomIcons.instagramIcon,
        const SizedBox(width: 8),
        const Text("Instagram"),
      ],
    ),
  ),
  DropdownMenuItem(
    value: 'X',
    child: Row(
      children: [
        CustomIcons.xIcon,
        const SizedBox(width: 8),
        const Text("X"),
      ],
    ),
  ),
];

class ContactInfoPage extends StatefulWidget {
  const ContactInfoPage({super.key});

  @override
  State<ContactInfoPage> createState() => _ContactInfoPageState();
}

class _ContactInfoPageState extends State<ContactInfoPage> {
  String _errroMessage = "";

  final List<String> _selectedTypes = [];
  final List<String> _contactValues = [];

  void _addContactRow() {
    setState(() {
      _selectedTypes.add('');
      _contactValues.add('');
    });
  }

  Future<void> _saveContacts() async {
    // Display saved contacts
    // print("\nHere are the type value pair\n");
    // print(_selectedTypes);
    // print(_contactValues);
    // print("\n\n");

    // Ensure that the contact types and values are not empty
    if (_selectedTypes.isEmpty || _contactValues.isEmpty) {
      _errroMessage = "Contact types or values cannot be empty.";
      //print("Error: Contact types or values cannot be empty.");
      return;
    }

    ApiService apiService = ApiService("http://localhost:3000");

    try {
      Response response = await apiService.addUserContacts(
          context, _selectedTypes, _contactValues);
      dynamic body = json.decode(response.body);
      String message = body['message'];
      print(message);
      if (response.statusCode == 201) {
        _errroMessage = "";
        //Positive
      } else if (response.statusCode == 400) {
        _errroMessage = message;
        //Bad Request
      } else if (response.statusCode == 409) {
        _errroMessage = message;
        //Conflict Exception
      }
    } catch (e) {
      // Handle any errors from the API call
      _errroMessage = "Unknown Error occured";
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Card(
          margin: const EdgeInsets.symmetric(vertical: 50),
          shadowColor: Colors.black,
          elevation: 100,
          shape: RoundedRectangleBorder(
            side: const BorderSide(width: 1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(
                  width: 300,
                  child: Text(
                    "Enter Contact Information",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 20),
                const SizedBox(
                  width: 400,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      SizedBox(
                        width: 168,
                        child: Text(
                          "Contact Type",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                      SizedBox(
                        width: 200,
                        child: Text(
                          "Contact Value",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      )
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                Flexible(
                  child: SizedBox(
                    width: 420,
                    child: ListView.builder(
                      itemCount: _selectedTypes.length,
                      itemBuilder: (context, index) {
                        return ContactRow(
                          index: index,
                          onChanged: (type, value) {
                            _selectedTypes[index] = type;
                            _contactValues[index] = value;
                          },
                        );
                      },
                    ),
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 18),
                    textStyle: const TextStyle(fontSize: 16),
                    backgroundColor: Colors.black,
                    shadowColor: Colors.black,
                  ),
                  onPressed: _addContactRow,
                  child: const Text(
                    "Add Another Contact",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                const SizedBox(height: 8),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 18),
                    textStyle: const TextStyle(fontSize: 16),
                    backgroundColor: Colors.black,
                    shadowColor: Colors.black,
                  ),
                  onPressed: _saveContacts,
                  child: const Text(
                    "Save Contacts",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                const SizedBox(
                  height: 8,
                ),
                if (_errroMessage.isNotEmpty)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.warning,
                        color: Colors.red,
                      ),
                      Text(
                        _errroMessage,
                        style: const TextStyle(color: Colors.red),
                      )
                    ],
                  ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  mainAxisSize: MainAxisSize.min, 
                  children: [
                    const SizedBox(width: 320,),
                    Padding(
                      padding: const EdgeInsets.only(top: 10),
                      child: TextButton(
                        iconAlignment: IconAlignment.end,
                        onPressed: () {},
                        child: const Text(
                          "Skip This",
                          style: TextStyle(color: Colors.lightBlue),
                        ),
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ContactRow extends StatefulWidget {
  final int index;
  final Function(String, String) onChanged;

  const ContactRow({required this.index, required this.onChanged, super.key});

  @override
  State<ContactRow> createState() => _ContactRowState();
}

class _ContactRowState extends State<ContactRow> {
  String? selectedContactType;
  final TextEditingController _valueController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _valueController.addListener(() {
      widget.onChanged(selectedContactType ?? '', _valueController.text);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Container(
          width: 168,
          height: 50,
          decoration: BoxDecoration(
            border: Border.all(width: 1),
            borderRadius: const BorderRadius.all(Radius.circular(5)),
          ),
          child: DropdownButton<String>(
            borderRadius: const BorderRadius.all(Radius.circular(5)),
            items: contactTypes,
            value: selectedContactType,
            hint: const Text('Select Type'),
            onChanged: (String? type) {
              if (type != null) {
                setState(() {
                  selectedContactType = type;
                  widget.onChanged(selectedContactType!, _valueController.text);
                });
              }
            },
          ),
        ),
        SizedBox(
          width: 200,
          height: 50,
          child: TextField(
            controller: _valueController,
            decoration: const InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(5)),
                borderSide: BorderSide(width: 1),
              ),
              labelText: "Contact Value",
            ),
          ),
        ),
      ],
    );
  }
}
