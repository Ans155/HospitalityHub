# Hotel Room Management Admin App
This project is a complete admin-facing solution for managing rooms in a hotel. It allows admins to create, edit, delete, and view room bookings. The project is built using the following technologies:

# Front-end:
HTML, CSS
JavaScript
React

# Back-end:
Node.js
Express.js
Database:

# MongoDB
The app provides the following features:

**Key Functionalities**
-----------------------
- Admins can book rooms by providing the user's email, room number, start time, and end time.
The price of the booking updates dynamically as admins modify any of the booking details.
Overlapping bookings for the same room are not allowed.
## Editing Bookings:

Admins can edit booking details, including user email, room number, start time, and end time.
The updated price is recalculated upon confirmation.
## Canceling Bookings:

-Admins can cancel future bookings with refund conditions:
If the booking start time is more than 48 hours, a complete refund is issued.
If the booking start time is within 24 to 48 hours, a 50% refund is issued.
Otherwise, no refund is provided, but admins can still cancel the booking.
## Viewing Bookings:
-Admins can view all bookings, both upcoming and passed, with various filters:
Filter by room number and room type.
Filter by start time and end time.
## Creating Bookings:
Admins can book rooms by providing the user's email, room number, start time, and end time.
The price of the booking updates dynamically as admins modify any of the booking details.



# Installation
Clone the repository:
```bash
Copy code
git clone https://github.com/your-username/hotel-room-management-app.git
cd hotel-room-management-app
```
Install dependencies for the client and server:

```bash
Copy code
cd client
npm install
cd ../server
npm install
Set up the MongoDB database:

Create a MongoDB database and configure the connection string in server/config/db.js.
Start the client and server:

In the client directory, run npm start to start the React app.
In the server directory, run npm start to start the Node.js server.
Access the app in your browser at http://localhost:3000.

```

**Resources**
-----------------------
- MongoDB
- React
- Node.js
- Express.js
