import 'package:flutter/material.dart';
import 'package:frontend/appPages/createpost.dart';
import 'package:frontend/appPages/homepage.dart';
import 'package:frontend/appPages/dm.dart';

class PageCard extends StatefulWidget {
  const PageCard({super.key});

  @override
  State<PageCard> createState() => _PageCardState();
}

class _PageCardState extends State<PageCard> {
  final List<Icon> hamburgerIcons = [
    const Icon(Icons.home),
    const Icon(Icons.add),
    const Icon(Icons.message),
    const Icon(Icons.notifications),
    const Icon(Icons.group),
    const Icon(Icons.person),
  ];

  final List<String> hamburgerLabels = [
    "Home",
    "Create Post",
    "Messages",
    "Notifications",
    "Activities",
    "Profile",
  ];

  String currentPage = "Home";

  void _changePage(int index) {
    setState(() {
      currentPage = hamburgerLabels[index];
    });
  }

  Widget _getPageContent() {
    switch (currentPage) {
      case "Create Post":
        return const CreatePostPage();
      case "Messages":
        return  ChatScreen();
      case "Notifications":
        return const Center(
            child: Text("Notifications Page", style: TextStyle(fontSize: 24)));
      case "Activities":
        return const Center(
            child: Text("Activities Page", style: TextStyle(fontSize: 24)));
      case "Profile":
        return const Center(
            child: Text("Profile Page", style: TextStyle(fontSize: 24)));
      default:
        return Homepage();
    }
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    const double drawerThreshold = 700.0;

    Drawer drawerWidget = Drawer(
      child: ListView.builder(
        itemCount: hamburgerIcons.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            return const SizedBox(
              height: 120,
              child: DrawerHeader(
                margin: EdgeInsets.only(bottom: 0),
                padding: EdgeInsets.symmetric(vertical: 2, horizontal: 16),
                child: Align(
                  alignment: Alignment.bottomLeft,
                  child: Text(
                    "UniVibe",
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Colors.deepPurple, // Your desired color
                    ),
                  ),
                ),
              ),
            );
          }
          return ListTile(
            leading: hamburgerIcons[index - 1],
            title: Text(hamburgerLabels[index - 1]),
            onTap: () {
              _changePage(index - 1);
              // Navigator.pop(context); // Close the drawer after selection
            },
          );
        },
      ),
    );

    return Scaffold(
      appBar: screenWidth < drawerThreshold
          ? AppBar(
              title: Text(currentPage),
            )
          : null,
      drawer: screenWidth < drawerThreshold ? drawerWidget : null,
      body: Row(
        children: [
          if (screenWidth >= drawerThreshold)
            SizedBox(
              width: 200,
              child: drawerWidget,
            ),
          // Main Content Area
          Expanded(
            child: _getPageContent(),
          ),
        ],
      ),
    );
  }
}
