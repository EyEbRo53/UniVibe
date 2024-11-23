
# Hints

### this is an example of how to handle api calls

Future<void> loginUser(String email, String password) async {
  final url = Uri.parse('http://your-api-url/users/login');
  try {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'password': password,
      }),
    );
    if (response.statusCode == 200) {
      setState(() {
        _message = 'Login successful';
      });
    } else if (response.statusCode == 401) {
      setState(() {
        _message = 'Invalid credentials';
      });
    } else if (response.statusCode == 400) {
      setState(() {
        _message = 'User not found';
      });
    } else {
      setState(() {
        _message = 'An unexpected error occurred';
      });
    }
  } catch (error) {
    setState(() {
      _message = 'Network error: $error';
    });
  }
}


# API calls

## signup

!!! follow order of execution

1-
/users/send-verification

body:

{

  "email": "",
  
  "password": ""
  
}

2-
/users/verify-code

body:

{

  "email": "",
  
  "code": ""
  
}

3-
/users/register

body:

{

  "email": "",

  "user_name": ""

}


## login

/users/login

body:

{

  "email": "",

  "password": ""

}

# JWT working

- JWT will be created during login and passed to client through response
- Client will pass JWT inside of header of each request

-key: Authorization
-value: Bearer example-token

(the space is important after Bearer. This token will be passed in the header of each request made after log in)
