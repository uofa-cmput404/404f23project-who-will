
import requests
import json

#the same for all requests
csrf_token_url = "https://cmput404-httpacademy2-1c641b528836.herokuapp.com/authors/login"
#the same for all requests
login_url = "https://cmput404-httpacademy2-1c641b528836.herokuapp.com/authors/user"
post_url = "https://cmput404-httpacademy2-1c641b528836.herokuapp.com/authors/register"
session = requests.Session()
print("Session:", session)

# credentials
email = "admin@email.com"
password = "admin"


data = {
    "username": "oops",
    "email": "oops@gmail.com",
    "password": "ogo12345",
    "id": "https://whoiswill-7ef8b333cade.herokuapp.com/authors/217549b1-11c0-491c-8414-0d27905e764f"
}

# Get CSRF token
csrf_response = session.post(
csrf_token_url, json={'email': email, "password": password})
print(f"\nCSRF Response Status Code:  {csrf_response.status_code}\n")
print(f"\nCSRF Response JSON: {csrf_response.json()} \n")

csrf_token = csrf_response.json().get('csrf_token')
print("CSRF Token:", csrf_token)


header = {
    'X-CSRFToken': csrf_token
}

# Login request
login_response = session.get(login_url, headers=header)
print(f"\nLogin Response Status Code: {login_response.status_code} \n\n")

post_response = session.post(post_url, json=data, headers={
    'X-CSRFToken': csrf_token,
    'Referer': csrf_token_url
})

if post_response.status_code == 200:
    print("post call successful!")
    # THIS IS THE DATA TO RETRIEVE
    print("post Response JSON:", json.dumps(post_response.json(), indent=4))
    # Check if the user exists and has a valid password

else:
    # debugging stuff
    print(f"API call failed with status code: {post_response.status_code}")
    print("Login Response Text:", post_response.text)
    # Print out the response headers and cookies for debugging
    print("Response Headers:", post_response.headers)
    print("Response Cookies:", len(post_response.cookies))
