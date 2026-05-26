# StyleHub - E-Commerce & Inventory Management System

An automated, full-stack e-commerce solution designed for online retail and clothing storefronts. This application features a responsive, user-friendly digital marketplace built with **React**, paired with a powerful, automated backend inventory tracking system powered by **Node.js, Express, and MongoDB**.

🔗 **Live Link:** [Style Hub](https://style-hub-chi.vercel.app/)

---

## Key Features

### React Customer Storefront (UI/UX)
- **Component-Driven UI:** Highly reusable, card-based interface optimized for mobile, tablet, and desktop viewports.
- **Dynamic State Filtering:** Instantly filter and search catalog items by category, size, price, and real-time availability without page reloads.
- **Interactive Shopping Cart:** Real-time cart calculations (subtotal, tax, discounts) using React Context API or state persistence (`localStorage`).
- **Smooth Animations:** Modern UI transitions and animatable interactive elements for an engaging user experience.

### Automated Inventory Management (Admin Panel)
- **Real-Time Stock Automation:** Automated systems that instantly decrement stock quantities upon valid order placements and flag low-stock warnings.
- **Dynamic CRUD Control:** Dedicated administrative dashboard to add, update, read, and delete product listings, pricing matrices, and batch inventories.
- **API Engine:** Smooth data ingestion routines designed to communicate seamlessly with third-party suppliers or internal logistics databases.

---

## Tech Stack & Hosting

- **Frontend:** React.js (Hooks, Context API, Modern Component Architecture)
- **Backend Architecture:** Node.js, Express.js (RESTful API Framework)
- **Database Layer:** MongoDB (NoSQL Object Modeling via Mongoose)
- **Styling & Animations:** CSS3 / Tailwind CSS & JavaScript (ES6+)
- **Deployment & Hosting:** **Vercel** (Both Frontend and Backend Serverless Functions are completely hosted on Vercel)

---

## Project Architecture

```text
e-commerce/
├── backend/            # Express Server Configuration & Serverless Functions
│   ├── config/         # Database connection setups & environment bindings
│   ├── controllers/    # Express Route Logic (Products, Orders, Inventory)
│   ├── models/         # Mongoose Schemas (User, Product, Order)
│   ├── routes/         # REST API Endpoint declarations
│   └── server.js       # Express application entry point
│
├── frontend/           # React Frontend Application
│   ├── public/         # Static assets & index.html
│   └── src/
│       ├── components/ # Reusable UI components (ProductCard, Navbar, Cart)
│       ├── context/    # Global React Context state (Cart/Auth)
│       ├── pages/      # View Page components (Home, ProductDetails, Admin)
│       ├── App.js      # Core React Router setup & component rendering
│       └── index.js    # React DOM root initialization
│
├── .env.example        # Reference template for localized environment parameters
└── README.md           # Documentation manual
