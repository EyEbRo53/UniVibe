import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:frontend/apiFolder/post_api_service.dart';
import 'package:frontend/models/posts.dart';
import 'package:frontend/utils/utility.dart';

class Homepage extends StatefulWidget {
  const Homepage({super.key});

  @override
  State<Homepage> createState() => _HomepageState();
}
class _HomepageState extends State<Homepage> {
  Future<List<dynamic>>? _futurePosts;

  @override
  void initState() {
    super.initState();
    _futurePosts = getAllPosts();
  }

  Future<List<dynamic>> getAllPosts() async {
    PostApiService postApiService = PostApiService("http://localhost:3000");
    try {
      var postResponse =jsonDecode(await postApiService.getAllPosts());
      return postResponse['data']; // Return the list of posts.
    } catch (e) {
      print("Could not get posts: $e");
      return []; // Return an empty list on error.
    }
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.sizeOf(context).width;
    double widthThreshold = 1000;

    return Center(
      child: FutureBuilder<List<dynamic>>(
        future: _futurePosts,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator(); // Show loading spinner.
          } else if (snapshot.hasError) {
            return const Text("Error loading posts");
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Text("No posts available");
          } else {
            List<dynamic> posts = snapshot.data!;
            return ListView.builder(
              itemCount: posts.length,
              itemBuilder: (context, index) {
                return FractionallySizedBox(
                  widthFactor: screenWidth < widthThreshold ? 0.9 : 0.8,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                    child: SizedBox(
                      child: Card(
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              vertical: 20, horizontal: 40),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    decoration: const BoxDecoration(
                                        color: Colors.black),
                                    child: const Icon(
                                      Icons.person,
                                      color: Colors.white,
                                      size: 40,
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Text(
                                    posts[index]["user_name"],
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              const Divider(height: 10),
                              const SizedBox(height: 8),
                              Text(
                                posts[index]["title"],
                                style: const TextStyle(fontSize: 25),
                              ),
                              const SizedBox(height: 8),
                              Text(posts[index]["description"]),
                              const SizedBox(height: 8),
                              PageViewSlider(images: posts[index]["images"]),
                              const SizedBox(height: 10),
                              const Divider(
                                thickness: 1,
                                color: Colors.black,
                                height: 8,
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceAround,
                                children: [
                                  HoverButton(
                                    text: "Send Message",
                                    icon: const Icon(Icons.message),
                                    defaultColor: const Color.fromARGB(
                                        255, 149, 186, 229),
                                    hoverColor: const Color.fromARGB(
                                        165, 149, 186, 229),
                                    onTap: () {
                                      print("Send Message tapped");
                                    },
                                  ),
                                  HoverButton(
                                    text: "Join Activity",
                                    icon: const Icon(Icons.join_full),
                                    defaultColor: const Color.fromARGB(
                                        255, 149, 186, 229),
                                    hoverColor: const Color.fromARGB(
                                        165, 149, 186, 229),
                                    onTap: () {
                                      print("Join Activity tapped");
                                    },
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }
}

class PageViewSlider extends StatefulWidget {
  final List<dynamic> images;
 PageViewSlider({super.key, required this.images});

  @override
  State<PageViewSlider> createState() => _PageViewSliderState();
}

class _PageViewSliderState extends State<PageViewSlider> {
  final PageController _pageController = PageController();

  final double threshold1000 = 1000.0;
  final double threshold350 = 350.0;
  @override 
Widget build(BuildContext context) {
  if (widget.images.isEmpty) {
    return const Center(child: Text('No images available'));
  }
  double screenWidth = MediaQuery.of(context).size.width;
  return Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      SizedBox(
        width: 30,
        child: IconButton(
          onPressed: () {
            _pageController.previousPage(
              duration: const Duration(milliseconds: 500),
              curve: Curves.bounceIn,
            );
          },
          icon: const Icon(Icons.arrow_back_ios),
        ),
      ),
      Container(
        color: Colors.black,
        height: 250, //300
        width: screenWidth < threshold1000? 260 : 300 ,
        child: PageView.builder(
          controller: _pageController,
          itemCount: widget.images.length,
          itemBuilder: (context, index) {
            return Image.memory(
              base64Decode(widget.images[index]["image_url"]),
              fit: BoxFit.fitHeight,
            );
          },
        ),
      ),
      SizedBox(
        width: 30,
        child: IconButton(
          onPressed: () {
            _pageController.nextPage(
              duration: const Duration(milliseconds: 500),
              curve: Curves.bounceIn,
            );
          },
          icon: const Icon(Icons.arrow_forward_ios),
        ),
      ),
    ],
  );
}
}

class HoverButton extends StatefulWidget {
  final String text;
  final Icon icon;
  final Color defaultColor;
  final Color hoverColor;
  final Function onTap;

  const HoverButton({
    super.key,
    required this.text,
    required this.icon,
    required this.defaultColor,
    required this.hoverColor,
    required this.onTap,
  });

  @override
  _HoverButtonState createState() => _HoverButtonState();
}

class _HoverButtonState extends State<HoverButton> {
  bool isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click, 
      onEnter: (_) {
        setState(() {
          isHovered = true;
          
        });
      },
      onExit: (_) {
        setState(() {
          isHovered = false;
        });
      },
      child: GestureDetector(
        onTap: () {
          widget.onTap();
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 12),
          decoration: BoxDecoration(
            shape: BoxShape.rectangle,
            color: isHovered ? widget.hoverColor : widget.defaultColor,
            borderRadius: BorderRadius.circular(50),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              widget.icon,
              Text(widget.text),
            ],
          ),
        ),
      ),
    );
  }
}
