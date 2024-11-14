# Project Overview

This project is inspired by the existing site [New Era Cap](https://www.neweracap.co.uk/). My goal was to recreate some of the functionalities from their site, specifically focusing on three main pages:

1. **Homepage** - Mirrors their product listing page for hats: [New Era Headwear](https://www.neweracap.co.uk/collections/headwear).
2. **Checkout** - Corresponds to their checkout page. Over time, New Era has redesigned and combined their Checkout and Payment pages into a single page, resulting in some design differences.
3. **Payment Page** - A dedicated page for completing the payment process.

Through this project, I aimed to demonstrate my skills in **React**, **TypeScript**, **Redux**, and **session management with asynchronous requests**.

---

## Features and Functionality

### Homepage
- The Homepage displays a list of products fetched from `db.json` (using `json-server` for a mock database).

### Checkout Page
- The Checkout page includes a **geolocation feature** to pre-fill the country field. 
- It uses a geolocator API to detect the client’s location; if the location cannot be determined, it defaults to "France."
- Upon form submission, a session entry is saved in `db.json` under the `sessions` collection. This entry includes:
  - A unique session ID
  - User-provided form data
  - Selected products for the order

### Payment Page
- Provides two payment options: **PayPal** and **Credit Card**.
   - For PayPal, a placeholder link simulates redirection to the PayPal site.
   - For Credit Card, I've integrated **Stripe** as the payment provider.
- Using Stripe, the test card credentials are:

Card Number: 4242 4242 4242 4242

Expiration: 04/30

CVC: 123

ZIP: 12345

- When a user places an order with these details, a new entry is created in the database under `payment` with an ID matching the session ID from `sessions`.

---

## Technologies Used

- **React** for UI components
- **TypeScript** for type-safe code
- **Redux** for state management
- **JSON Server** as a mock backend
- **Geolocation API** for user location data
- **Stripe** for payment processing simulation



## Installation
1. Clone the repository:
   - **git clone https://github.com/Stanislawwb/New-Era-Cap.git**
3. Navigate into the project directory.
4. Install the dependencies:
   - **npm install**


## Running the Project
1. Start the Vite server for React:
    - **npm run dev**
2. Start the JSON server to provide mock data:
    - **npx json-server --watch db.json --port 3000**
