import requests

#type
#classification = "post"
#classification = "author"
classification = "like"
#classification = "comment
#classification = "edit_post"

if classification == "post":
    data = {
        "type":"post",
        "title":"A post title about a post about web dev",
        "id":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/4eb224d9-ce3c-4b8b-ae24-7fdfef4a2e90/",
        "source":"http://lastplaceigotthisfrom.com/posts/yyyyy",
        "origin":"http://whereitcamefrom.com/posts/zzzzz",
        "description":"This post discusses stuff -- brief",
        "contentType":"text/plain",
        "content":"TEST Þā wæs on burgum Bēowulf Scyldinga, lēof lēod-cyning, longe þrāge folcum gefrǣge (fæder ellor hwearf, aldor of earde), oð þæt him eft onwōc hēah Healfdene; hēold þenden lifde, gamol and gūð-rēow, glæde Scyldingas. Þǣm fēower bearn forð-gerīmed in worold wōcun, weoroda rǣswan, Heorogār and Hrōðgār and Hālga til; hȳrde ic, þat Elan cwēn Ongenþēowes wæs Heaðoscilfinges heals-gebedde. Þā wæs Hrōðgāre here-spēd gyfen, wīges weorð-mynd, þæt him his wine-māgas georne hȳrdon, oð þæt sēo geogoð gewēox, mago-driht micel. Him on mōd bearn, þæt heal-reced hātan wolde, medo-ærn micel men gewyrcean, þone yldo bearn ǣfre gefrūnon, and þǣr on innan eall gedǣlan geongum and ealdum, swylc him god sealde, būton folc-scare and feorum gumena. Þā ic wīde gefrægn weorc gebannan manigre mǣgðe geond þisne middan-geard, folc-stede frætwan. Him on fyrste gelomp ǣdre mid yldum, þæt hit wearð eal gearo, heal-ærna mǣst; scōp him Heort naman, sē þe his wordes geweald wīde hæfde. Hē bēot ne ālēh, bēagas dǣlde, sinc æt symle. Sele hlīfade hēah and horn-gēap: heaðo-wylma bād, lāðan līges; ne wæs hit lenge þā gēn þæt se ecg-hete āðum-swerian 85 æfter wæl-nīðe wæcnan scolde. Þā se ellen-gǣst earfoðlīce þrāge geþolode, sē þe in þȳstrum bād, þæt hē dōgora gehwām drēam gehȳrde hlūdne in healle; þǣr wæs hearpan swēg, swutol sang scopes. Sægde sē þe cūðe frum-sceaft fīra feorran reccan",
        "author":{
            "type":"author",
            "id":"http://127.0.0.1:5454/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d",
            "host":"http://127.0.0.1:5454/",
            "displayName":"Lara Croft",
            "url":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            "github": "http://github.com/laracroft",
            "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
        },
        "categories":["web","tutorial"],
        "count": 1023,
        "comments":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
        "commentsSrc":{
            "type":"comments",
            "page":1,
            "size":5,
            "post":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
            "id":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
            "comments":[
                {
                    "type":"comment",
                    "author":{
                        "type":"author",
                        "id":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                        "url":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                        "host":"http://127.0.0.1:5454/",
                        "displayName":"Greg Johnson",
                        "github": "http://github.com/gjohnson",
                        "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
                    },
                    "comment":"Sick Olde English",
                    "contentType":"text/markdown",
                    "published":"2015-03-09T13:07:04+00:00",
                    "id":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
                }
            ]
        },
        "published":"2015-03-09T13:07:04+00:00",
        "visibility":"PUBLIC",
        "unlisted":False
    }

if classification == "like":
    data = {
        "@context": "https://www.w3.org/ns/activitystreams",
        "summary": "Lara Croft Likes your post",         
        "type": "Like",
        "author":{
            "type":"author",
            "id":"http://127.0.0.1:5454/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d",
            "host":"http://127.0.0.1:5454/",
            "displayName":"Lara Croft",
            "url":"http://127.0.0.1:5454/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d",
            "github":"http://github.com/laracroft",
            "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
        },
        "object":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/4eb224d9-ce3c-4b8b-ae24-7fdfef4a2e90"
    }

if classification == "edit_post":
    data = {
        "type":"post",
        "title":"PATCHED PATCHED PATCHED--------------------------------",
        "id":"http://127.0.0.1:5454/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d/posts/4eb224d9-ce3c-4b8b-ae24-7fdfef4a2e90/",
        "source":"http://lastplaceigotthisfrom.com/posts/yyyyy",
        "origin":"http://whereitcamefrom.com/posts/zzzzz",
        "description":"PATCHED PATCHED PATCHED--------------------------------",
        "contentType":"text/plain",
        "content":"PATCHED PATCHED PATCHED--------------------------------",
        "author":{
            "type":"author",
            "id":"http://127.0.0.1:5454/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d",
            "host":"http://127.0.0.1:5454/",
            "displayName":"Lara Croft",
            "url":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            "github": "http://github.com/laracroft",
            "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
        },
        "categories":["web","tutorial"],
        "count": 1023,
        "comments":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
        "commentsSrc":{
            "type":"comments",
            "page":1,
            "size":5,
            "post":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
            "id":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
            "comments":[
                {
                    "type":"comment",
                    "author":{
                        "type":"author",
                        "id":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                        "url":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                        "host":"http://127.0.0.1:5454/",
                        "displayName":"Greg Johnson",
                        "github": "http://github.com/gjohnson",
                        "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
                    },
                    "comment":"Sick Olde English",
                    "contentType":"text/markdown",
                    "published":"2015-03-09T13:07:04+00:00",
                    "id":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
                }
            ]
        },
        "published":"2015-03-09T13:07:04+00:00",
        "visibility":"PUBLIC",
        "unlisted":False
    }

if classification == "author":
    data = {
        "type":"author",
        "id":"http://127.0.0.1:5454/authors/eed0ec23-267a-49f2-88d5-73b75d2baeb3",
        "host":"http://127.0.0.1:5454/",
        "displayName":"blud",
        "url":"http://127.0.0.1:5454/authors/eed0ec23-267a-49f2-88d5-73b75d2baeb3",
        "github": "http://github.com/laracroft",
        "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
    }

if classification == "comment":
    data = {
    "type":"comment",
    "author":{
        "type":"author",
        "id":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
        "url":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
        "host":"http://127.0.0.1:5454/",
        "displayName":"Greg Johnson",
        "github": "http://github.com/gjohnson",
        "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
    },
    "comment":"Sick Olde English",
    "contentType":"text/markdown",
    "published":"2015-03-09T13:07:04+00:00",
    "id":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
}

#action
#test = "delete"
test = "post"

if test == "post":
    if classification == "post":
        #url = "http://127.0.0.1:8000/service/authors/admin/posts/"  # url handle who they are wanting to follow
        url = "http://127.0.0.1:8000/service/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d/posts/"
    elif classification == "edit_post":
        url = "http://127.0.0.1:8000/service/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d/posts/4eb224d9-ce3c-4b8b-ae24-7fdfef4a2e90"
    elif classification == "author":
        url = "http://127.0.0.1:8000/service/authors/eed0ec23-267a-49f2-88d5-73b75d2baeb3"
    elif classification == "like":
        url = "http://127.0.0.1:8000/service/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d/inbox/"
    elif classification == "comment":
        url = "http://127.0.0.1:8000/service/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d/posts/4eb224d9-ce3c-4b8b-ae24-7fdfef4a2e90/comments"

    response = requests.post(url, json=data)


elif test == "delete":
    url = "http://127.0.0.1:8000/service/authors/b078bbd8-2ab0-469a-a7c6-4c7b7056e21d/posts/494b3b7a-b5ff-418d-98a5-119814a4661c"
    response = requests.delete(url)

elif test == "patch":
    #academy and good use this
    url = "http://127.0.0.1:8000/service/authors/admin/posts/3"
    response = requests.patch(url, json=data)


#data = {"add_follow_request": "None", "delete_follow_request": "2","add_following": "None", "delete_following": "2"}


if response.status_code == 200:
    print(f"{test} request was successful!")
else:
    print(f"{test} request failed with status code {response.status_code}: {response.text}")


print(response.status_code)
print(response.json())