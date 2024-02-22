# Event App


## Overview

The Event Organization API is a Node.js and Express.js-based application that facilitates the management of events, shops, and their associated categories. Built on MongoDB, this API provides Create, Read, Update, and Delete (CRUD) operations to efficiently organize and handle event-related data.

## Models

**1.** **User:**
- Represents the owner of a shop.
- Establishes relationships with shops and events.

**2. Shop:**
- Stores information about shops.
- Connected to the User model to designate shop ownership.
- Associates with events.

**3. Event:**
- Captures details about events.
- Linked to a shop and its owner (User).
- Categorized under specific event categories.

**4. Event Category and Shop Category:**
- Define categories for events and shops, respectively.
- Events are organized into event categories.

## Installation and Usage
1. Clone the repository.
2. Install dependencies with **npm install**.
3. Set up your MongoDB connection.
4. Run the application using **npm start**.