import requests
import json

WHOWILLHOST = "https://whowill-22f35606f344.herokuapp.com/"


'''
HTTPACADEMY 
'''
csrf_token_url = "https://cmput404-httpacademy8-3caa8234de32.herokuapp.com/authors/login"
# the same for all requests
login_url = "https://cmput404-httpacademy8-3caa8234de32.herokuapp.com/authors/user"
post_url = "https://cmput404-httpacademy8-3caa8234de32.herokuapp.com/authors/register"
session = requests.Session()
print("Session:", session)
# credentials
email = "admin@email.com"
password = "admin"



#Get CSRF token
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


def send_academy(raw):
    #NOTE: FIX THIS FRANK Pweaseeeee 🥹👉👈
    data = {
        "username": raw['username'],
        "email": raw['email'],
        "password": raw['password'],
        "id": f"{WHOWILLHOST}authors/{raw['id']}",
        "foreign": f"{raw['id']}",
        "isForeign": True

    }
    print("sending this data:", data)
    if raw['foreign'] == raw['id']:
        print('send to external')
        post_response = session.post(post_url, json=data, headers={
            'X-CSRFToken': csrf_token,
            'Referer': csrf_token_url
        })

        try:
            # send to HTTPACADEMY
            if post_response.status_code == 200:
                print("successfully created new user on HTTPACADEMY")
                print("post Response:", json.dumps(post_response.json(), indent=4))
            else:
                print("fail to add new user in academy")
                print("post Response:", json.dumps(post_response.json(), indent=4))
        except Exception as e:
            print(e)


    elif raw['foreign'] != raw['id']:
        print('do not send')
    return data
