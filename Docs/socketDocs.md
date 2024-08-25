# PROJECT-X Docs

## Overview

This documentation covers the 6 Socket.IO events used in the system, consisting of 1 emitters and 5 listeners.

### Connection with Server

You can establish a connection with the server using the following URL:

```
https://project-x-6666.onrender.com?userId=<your-userId>&username=<your-username>
```
There are 2 query params which are need to be passed in order to connect:
| Parameter | Value                      |
|-----------|----------------------------|
| userID    | your-user-id                     |
| name      | your-username              |


## Emitters

### 1. sendMessage

***Event Name** : "sendMessage"

This event is used to sendMessage to another user on a one-one chat:

Json body:

```json
{
    "friendId" : "66c5c604761bba1d607bc6e2",
    "message" : {
        "senderId" : "66c5c59a761bba1d607bc6de",
        "contentType" : "text",
        "content" : "Hello aasif"
    }
}
```
#### Body Explanation

| Field     | Description                                                      |
|-----------|------------------------------------------------------------------|
| `friendId`  | ID of your friend to whom you want to send the message        |
| `message`  | Details of the message  |



## Listeners

### 1. Success 
**Event Name** : "success"

This listener is used during development to catch any successful operations. You can capture and log the success message.

```json
{
    "message" : "Your success message is here for the requests"
}
```
### 2. Error 
**Event Name** : "error"

This listener is used during development to catch any errors that occur during the socket exchange process. You can capture and log the error message.

```json
{
    "message" : "Your error message is here for the requests"
}

```
### 3. Receive Message
**Event Name** : "receiveMessage"

This listener allows the user to listen to any of the incoming message by his/her friend in realtime:

Body of the incoming message:
```json
{
    "senderId": "66c5c604761bba1d607bc6e2",
    "contentType": "text",
    "content": "Hello Shri"
}
```
### 4. Receive Friend Request
**Event Name** : "receiveFriendRequest"

You can receive realtime Friend Request from this listener.

```json
{
    "user": {
        "username": "Shri123",
        "photo": null
    },
    "createdAt": "2024-08-25T14:49:56.313Z"
}
```
### 5. Friend Request accepted

**Event Name** : "acceptedFriendRequest"

When your friend accepts your friend request then you will recieve your friend data so that you can add him/her in your friends section.

```json
{
    "username": "aasif",
    "photo": null,
    "UID": "66c5c604761bba1d607bc6e2"
}
```






  
   
   
