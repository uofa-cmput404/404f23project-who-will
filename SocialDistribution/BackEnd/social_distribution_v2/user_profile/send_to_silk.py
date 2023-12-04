import requests
import json

WHOWILLHOST = "https://whowill-22f35606f344.herokuapp.com/"


"""
SILK
"""
Silk_post_url = "https://silk-cmput404-project-21e5c91727a7.herokuapp.com/api/signup"
SilkUsername = "Whoiswill"
SilkPassword = "Whoiswill1!"


def send_silk(raw):

    if not raw['foreign'] == raw['id']:
        return

    data2= {
        "type": "author",
            "id": f"{WHOWILLHOST}authors/{raw['id']}",
            "host": f"{WHOWILLHOST}",
            "displayName": raw['username'],
            "url": f"{WHOWILLHOST}authors/{raw['id']}",
            "github": "https://github.com/Joe",
            "password": "nunyabiz"
    }

    print("\n\n\n\n\n\n\nsending this data:", data2)
    try:
        response = requests.post(Silk_post_url, data=data2, auth=(SilkUsername, SilkPassword))
    except Exception as e:
        print("data failed to send\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
        print(e)

    print("\n\n\n\n\n\n\n\n\nData sent???? \n\n\n\n\n\n\n\n\n\n\n\n\n")

    print(f"\n\n\n\n\n{response.status_code} \n\n\n\n")
    print(f"\n\n\n\n {response.json()} \n\n\n")