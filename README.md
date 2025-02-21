
# Flask E-commerce Backend

A RESTful backend API for an e-commerce platform built with Flask and SQLAlchemy. This API provides functionality forproduct catalog, shopping cart operations, and category management.

## Features

- User Authentication & Authorization
- Product Management
- Category Management
- Shopping Cart Operations
- Admin Dashboard Support
- Token-based Authentication (JWT)
- Input Validation
- Error Handling

## Prerequisites

- Python 3.8+
- Flask
- SQLAlchemy
- Flask-CORS
- PyJWT

## Installation

1. Clone the repository:
```bash
git clone https://github.com/abhisha02/Ecommerce-Flask.git
cd flask-ecommerce-backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install flask flask-sqlalchemy flask-cors pyjwt
```

4. Set environment variables:
```bash
export SECRET_KEY="your-secret-key"  # On Windows: set SECRET_KEY="your-secret-key"
```

## Database Schema

The application uses SQLite with the following models:

- User: Stores user information and authentication details
- Category: Manages product categories
- Product: Stores product information
- CartItem: Manages shopping cart items

## API Endpoints

### Authentication

- POST `/api/register` - Register a new user
- POST `/api/login` - User login

### User Profile

- GET `/api/profile` - Get user profile
- PUT `/api/profile` - Update user profile

### Categories

- GET `/api/categories` - List all categories
- POST `/api/categories` - Add new category (Admin only)
- PUT `/api/categories/<id>` - Update category (Admin only)
- DELETE `/api/categories/<id>` - Delete category (Admin only)

### Products

- GET `/api/products` - List products (supports pagination)
- POST `/api/products` - Add new product (Admin only)
- PUT `/api/products/<id>` - Update product (Admin only)
- DELETE `/api/products/<id>` - Delete product (Admin only)

### Shopping Cart

- GET `/api/cart` - View cart items
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/<item_id>` - Update cart item
- DELETE `/api/cart/<item_id>` - Remove item from cart
- DELETE `/api/cart/clear` - Clear entire cart

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Admin Access

Default admin credentials:
- Username: admin
- Password: Admin@123

## Password Requirements

- Minimum 6 characters
- At least one number
- At least one special character

## Error Handling

The API includes comprehensive error handling for:
- 404 Not Found
- 500 Internal Server Error
- Input validation errors
- Authentication/Authorization errors

## Development

To run the development server:

```bash
python app.py
```

The server will start at `http://localhost:5000`

## Security Features

- Password hashing using Werkzeug
- Email validation
- Token-based authentication
- Admin role protection
- Input sanitization
- CORS support

## Database Initialization

The application automatically initializes the database with:
- Admin user
- Basic categories (Electronics, Clothing)
- SQLite database file in the project directory

# Flask E Commerce frontend

A modern React-based admin dashboard for managing products and categories with real-time statistics and monitoring capabilities.

## Features

- **Dashboard Overview**
  - Real-time statistics display
  - Recent products listing
  - Stock level monitoring
  - Category-wise stock distribution charts

- **Product Management**
  - List, create, edit, and delete products
  - Stock level tracking
  - Category assignment
 

- **Category Management**
  - Create and manage product categories
  - View products by category
  - Category-wise analytics

## Project Structure

```
src/
├── components/
│   ├── layout/              # Layout components
│   │   ├── Header.jsx      # Main navigation header
│   │   └── Footer.jsx      # Footer component
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── DashboardStats.jsx    # Statistics display
│   │   ├── RecentProducts.jsx    # Recent products list
│   │   └── StockChart.jsx        # Stock visualization
│   ├── products/          # Product management
│   │   ├── ProductsList.jsx      # Products table
│   │   └── ProductDialog.jsx     # Add/Edit product modal
│   ├── categories/        # Category management
│   │   ├── CategoriesList.jsx    # Categories table
│   │   └── CategoryDialog.jsx     # Add/Edit category modal
│   └── common/           # Shared components
│       ├── LoadingState.jsx      # Loading spinner
│       ├── ErrorState.jsx        # Error display
│       └── Notification.jsx      # Toast notifications
├── hooks/               # Custom React hooks
│   └── useNotification.js       # Notification management
├── services/           # API and service functions
│   └── api.js                   # API communication
└── pages/             # Page components
    └── admin/                   # Admin section pages
        ├── AdminDashboard.jsx   # Main dashboard page
        ├── DashboardTab.jsx     # Dashboard tab content
        ├── ProductsTab.jsx      # Products tab content
        └── CategoriesTab.jsx    # Categories tab content
```

## Technical Stack

- React.js
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- Custom hooks for state management

## Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Build**
   ```bash
   npm run build
   ```

## Component Dependencies

- `AdminDashboard`: Main container component
  - Requires: Header, Footer, DashboardTab, ProductsTab, CategoriesTab
  - Uses: LoadingState, ErrorState, Notification, useNotification

- `DashboardTab`: Dashboard view
  - Requires: DashboardStats, RecentProducts, StockChart
  - Props: products, categories, stockStats

- `ProductsTab`: Product management view
  - Requires: ProductsList, ProductDialog
  - Props: products, categories, various handlers

- `CategoriesTab`: Category management view
  - Requires: CategoriesList, CategoryDialog
  - Props: categories, products, various handlers

## State Management

- Uses React's built-in useState for local state
- Custom useNotification hook for toast notifications
- Props drilling for component communication

## UI Components

- **Common Components**
  - LoadingState: Centered loading spinner
  - ErrorState: Error message display
  - Notification: Toast notification system

- **Layout Components**
  - Header: Navigation and user controls
  - Footer: Copyright and links

## API Integration

The `api.js` service handles all communication with the backend:
- Products CRUD operations
- Category management
- Dashboard statistics

