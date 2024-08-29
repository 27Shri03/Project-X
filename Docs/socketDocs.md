# PROJECT-X Docs

## Overview

This documentation covers the 10 Socket.IO events used in the system, consisting of 3 emitters and 7 listeners.

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

### 1. joinRoom

This event will be emitted before using the sendMessage Emitter in order to join a common room:

Json body:

```json
{
    "conversationId" : "66c5c604761bba1d607bc6e2",
    "username" : "Shri123"
}
```
#### Body Explanation

| Field     | Description                                                      |
|-----------|------------------------------------------------------------------|
| `conversationId`  | Room ID associated with your friend
| `username`  | Your username  |

### 2. sendMessage

This event is used to sendMessage to another user on a one-one chat:

Json body:

```json
{
    "conversationId" : "66c5c604761bba1d607bc6e2",
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
| `conversationId`  | Room ID associated with your friend        |
| `message`  | Details of the message  |

### 3. userTyping

This event will be emitted when user start and end typing. Make sure to toggle the typing field to **true** or **false**:

Json body:

```json
{
    "conversationId" : "66c5c604761bba1d607bc6e2",
    "typing" : true
}
```
#### Body Explanation

| Field     | Description                                                      |
|-----------|------------------------------------------------------------------|
| `conversationId`  | Room ID associated with your friend
| `typing`  | True or false depends on start or end typing  |

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

### 6. User Typing

**Event Name** : "userTyping"

Receive realtime updates whether your friend is typing or not.

```json
{
    "typing": true,
}
```

### 7. Friend Status

**EVENT NAME** : "friendStatus"

Receive realtime updates whether your friend is online or not.

```json
{
    "userId" : "6646j2k6l2424523aa",
    "username" : "jimkahlon",
    "online" : true 
}
```







  
   
   
