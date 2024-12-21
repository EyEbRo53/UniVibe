import 'package:flutter/material.dart';

class NotificationsPage extends StatelessWidget {
  final List<Map<String, String>> notifications = [
    {
      'title': 'New Message',
      'subtitle': 'You have a new message from Usman.',
      'time': '2 mins ago',
      'icon': 'message',
    },
    {
      'title': 'Activity Reminder',
      'subtitle': 'Your activity is about to start.',
      'time': '10 mins ago',
      'icon': 'event',
    },
    {
      'title': 'Update Available',
      'subtitle': 'A new update is ready to install.',
      'time': '1 hour ago',
      'icon': 'system_update',
    },
    {
      'title': 'Join Request',
      'subtitle': 'Hassan requested to join your activity.',
      'time': '3 hours ago',
      'icon': 'person_add',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications', style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.deepPurple,
      ),
      body: ListView.builder(
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          final notification = notifications[index];
          return ListTile(
            leading: Icon(
              _getIcon(notification['icon']!),
              color: Colors.deepPurple,
            ),
            title: Text(notification['title']!),
            subtitle: Text(notification['subtitle']!),
            trailing: Text(
              notification['time']!,
              style: TextStyle(color: Colors.grey, fontSize: 12),
            ),
          );
        },
      ),
    );
  }

  IconData _getIcon(String iconName) {
    switch (iconName) {
      case 'message':
        return Icons.message;
      case 'event':
        return Icons.event;
      case 'system_update':
        return Icons.system_update;
      case 'person_add':
        return Icons.person_add;
      default:
        return Icons.notifications;
    }
  }
}
