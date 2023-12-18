
# Hotel Room Booking System

This project is a comprehensive solution for managing rooms in a hotel, offering a user-friendly interface for both administrators and customers. It empowers users to create, edit, delete, and view room bookings, transforming it into a robust hotel booking system. The project is built using the following technologies:

## Front-end
- HTML, CSS
- JavaScript
- React

## Back-end
- Node.js
- Express.js

## Database
- MongoDB

### Key Functionalities

#### User Features:

1. **User Authentication:**
   - Users can securely log in or sign up using JSON Web Token (JWT) authentication.
   - Two roles are supported: CUSTOMER and ADMIN.

2. **Role-Based Access:**
   - Different roles have different access levels.
   - **CUSTOMER:**
     - Can request room bookings.
     - Can view all available rooms.
   - **ADMIN:**
     - Can manage rooms, bookings, and users.

3. **Booking Rooms:**
   - Customers can book rooms by providing necessary details such as name, email, room preferences, start time, and end time.
   - The price of the booking updates dynamically as customers modify any booking details.
   - Overlapping bookings for the same room are not allowed.

4. **Editing Bookings:**
   - Customers can edit their booking details, including personal information and reservation details.
   - The updated price is recalculated upon confirmation.

5. **Canceling Bookings:**
   - Customers can cancel future bookings with refund conditions:
     - If the booking start time is more than 48 hours, a complete refund is issued.
     - If the booking start time is within 24 to 48 hours, a 50% refund is issued.
     - Otherwise, no refund is provided, but customers can still cancel the booking.

6. **Viewing Bookings:**
   - Customers can view their own bookings, both upcoming and past reservations.
   - Admins can view all bookings, both upcoming and passed, with various filters:
     - Filter by room number and room type.
     - Filter by start time and end time.

## Email Confirmation Feature

We've added an exciting new feature to enhance user experience—the Email Confirmation feature. Now, users will receive email confirmations for successful room bookings, providing them with a detailed record of their reservation.

### How It Works

When a user successfully books a room, a confirmation email is automatically sent to the provided email address. The email contains important details such as the reservation dates, room preferences, and any other relevant information.

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
