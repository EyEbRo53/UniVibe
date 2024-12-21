import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/chat_api_service.dart';

class ChatScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth < 600) {
            return MobileChatView();
          } else {
            return DesktopChatView();
          }
        },
      ),
    );
  }
}

class MobileChatView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Navigator(
      onGenerateRoute: (settings) {
        if (settings.name == '/' || settings.name == null) {
          return MaterialPageRoute(builder: (_) => DMListScreen());
        } else {
          // Extract userName and userId from the route
          final parts = settings.name!.split('/');
          final userName = parts[2]; // userName is at index 2
          final userId = parts[3]; // userId is at index 3
          return MaterialPageRoute(
              builder: (_) => ChatDetailScreen(
                    userName: userName,
                    userId: int.parse(userId),
                  ));
        }
      },
      initialRoute: '/',
    );
  }
}

class DesktopChatView extends StatefulWidget {
  @override
  _DesktopChatViewState createState() => _DesktopChatViewState();
}

class _DesktopChatViewState extends State<DesktopChatView> {
  String? selectedUser;
  int? userId;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          flex: 1,
          child: DMListScreen(
            onUserSelected: (userName, id) {
              setState(() {
                selectedUser = userName;
                userId = int.parse(id)
                    as int?; // Set the userId when a user is selected
                print(userId);
              });
            },
          ),
        ),
        // Chat detail area
        Expanded(
          flex: 3,
          child: selectedUser == null
              ? const Center(
                  child: Text(
                    "Select a user to view the chat",
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                )
              : ChatDetailScreen(
                  userName: selectedUser!,
                  userId: userId!,
                ),
        ),
      ],
    );
  }
}

class DMListScreen extends StatefulWidget {
  final Function(String, String)?
      onUserSelected; // Updated to accept both userName and userId.

  DMListScreen({this.onUserSelected});

  @override
  State<DMListScreen> createState() => _DMListScreenState();
}

class _DMListScreenState extends State<DMListScreen> {
  Future<List<dynamic>>? _futureChats;

  @override
  void initState() {
    super.initState();
    _futureChats = getAllChats();
  }

  Future<List<dynamic>> getAllChats() async {
    ChatApiService chatApiService = ChatApiService("http://localhost:3000");
    try {
      var postResponse = await chatApiService.getAllChats(context);
      print(postResponse);
      return postResponse;
    } catch (e) {
      print("Could not get Chats: $e");
      return []; // Return an empty list on error.
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<dynamic>>(
        future: _futureChats,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator(); // Show loading spinner.
          } else if (snapshot.hasError) {
            return const Text("Error loading posts");
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Text("No Chats available");
          } else {
            List<dynamic> chats = snapshot.data!;
            return ListView.builder(
              itemCount: chats.length,
              itemBuilder: (context, index) {
                final userName = chats[index]["user_name"];
                final userId = chats[index]["user_id"]
                    .toString(); // Extract userId from chat data
                return ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.purple[50],
                    child: const Icon(Icons.person, color: Colors.white),
                  ),
                  title: Text(
                    userName,
                    style: TextStyle(
                      color: Colors.grey[800],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  onTap: () {
                    if (MediaQuery.of(context).size.width < 600) {
                      // Pass both userName and userId
                      Navigator.of(context)
                          .pushNamed('/chat/$userName/$userId');
                    } else if (widget.onUserSelected != null) {
                      // Update selected user for desktop, passing userId as well
                      widget.onUserSelected!(userName, userId);
                    }
                  },
                );
              },
            );
          }
        });
  }
}

class ChatDetailScreen extends StatefulWidget {
  final String userName;
  final int userId;

  ChatDetailScreen({required this.userName, required this.userId});

  @override
  _ChatDetailScreenState createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen> {
  late Future<List<dynamic>> messages;

  @override
  void initState() {
    super.initState();
    messages = getMessages(); // Ensure this returns a Future<List<dynamic>>
  }

  Future<List<dynamic>> getMessages() async {
    ChatApiService chatApiService = ChatApiService("http://localhost:3000");
    try {
      final response = await chatApiService.getMessages(widget.userId, context);
      print("Messages for user ${widget.userId}: $response");
      return response;
    } catch (e) {
      print("Error fetching messages: $e");
      return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.green[50],
      child: Column(
        children: [
          // Chat Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.green[100],
              border: Border(
                bottom: BorderSide(color: Colors.green[200]!),
              ),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.green[300],
                  child: const Icon(Icons.person, color: Colors.white),
                ),
                const SizedBox(width: 12),
                Text(
                  widget.userName,
                  style: TextStyle(
                    color: Colors.grey[800],
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ],
            ),
          ),
          // Chat Messages
          Expanded(
            child: FutureBuilder<List<dynamic>>(
              future: messages,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return const Center(
                    child: Text(
                      "Error loading messages.",
                      style: TextStyle(color: Colors.red),
                    ),
                  );
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(
                    child: Text(
                      "No messages yet.",
                      style: TextStyle(color: Colors.grey),
                    ),
                  );
                }
                final messageList = snapshot.data!;

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: messageList.length,
                  itemBuilder: (context, index) {
                    final message = messageList[index];
                    final isMe = message['senderId'] == widget.userId;
                    return Align(
                      alignment:
                          isMe ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 4),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: isMe ? Colors.blue[100] : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          message['content'],
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey[800],
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
          // Input Field
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "Type a message...",
                      hintStyle: TextStyle(color: Colors.grey[500]),
                      filled: true,
                      fillColor: Colors.grey[100],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    style: TextStyle(color: Colors.grey[800]),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: Colors.blue[300],
                  child: const Icon(Icons.send, color: Colors.white),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
