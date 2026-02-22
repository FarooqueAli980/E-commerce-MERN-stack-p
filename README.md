# E-Commerce MERN Stack Application

A full-stack e-commerce application built with **MongoDB**, **Express.js**, **React**, and **Node.js** (MERN stack).

## Features

- 🛍️ Product catalog with detailed product views
- 🛒 Shopping cart functionality
- 💳 Stripe payment integration
- 👤 User authentication with JWT
- 📧 Email verification with OTP
- 👨‍💼 Admin panel for product management
- 🔐 Secure payment processing
- 📦 Order management system
- 🎨 Responsive UI with modern design

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email service

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Redux** - State management
- **React Router** - Client-side routing
- **Stripe.js** - Payment integration
- **Sonner** - Toast notifications
- **Shadcn/ui** - Component library

## Project Structure

```
e-commerce/
├── backend/
│   ├── controllers/      # Route handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── emailVerify/     # Email verification logic
│   ├── database/        # Database connection
│   ├── server.js        # Express server
│   ├── seedAdmin.js     # Admin seeding script
│   ├── package.json     # Backend dependencies
│   ├── .env.example     # Environment variables template
│   └── .gitignore       # Git ignore rules
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store & slices
│   │   ├── assets/      # Images and static files
│   │   ├── lib/         # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # React entry point
│   ├── index.html       # HTML template
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
│
└── README.md            # This file
```

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)
- **Stripe** account (for payment processing)
- **Gmail** account (for email verification)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FarooqueAli980/E-commerce-MERN-stack-p.git
   cd E-commerce-MERN-stack-p
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend` folder:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   PORT=8000
   SECRET_KEY=your_jwt_secret_key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
   FRONTEND_URL=http://localhost:5173
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Development Mode

1. **Start Backend Server** (from `backend` folder)
   ```bash
   npm start
   # Server runs on http://localhost:8000
   ```

2. **Start Frontend Dev Server** (from `frontend` folder, in a new terminal)
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | Server port (default: 8000) |
| `SECRET_KEY` | JWT secret key |
| `EMAIL_USER` | Gmail for OTP verification |
| `EMAIL_PASS` | Gmail app-specific password |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_PUBLIC_KEY` | Stripe public API key |
| `FRONTEND_URL` | Frontend URL for redirects |

## API Endpoints

### User Routes
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/verify-email` - Verify email with OTP
- `GET /api/users/profile` - Get user profile (protected)

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Payment Routes
- `POST /api/payments/create-checkout-session` - Create Stripe checkout session
- `GET /api/payments/success` - Payment success callback
- `GET /api/payments/cancel` - Payment cancellation

### Order Routes
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details

## Key Features Explained

### User Authentication
- JWT-based authentication
- Email verification with OTP
- Secure password handling

### Payment Integration
- Stripe checkout integration
- Order creation after successful payment
- Payment success/cancellation handling

### Admin Panel
- Product management (CRUD operations)
- Order management
- User management

### Email Verification
- OTP generation and sending
- Email verification workflow
- Secure token validation

## Security Features

- ✅ JWT authentication
- ✅ Password hashing
- ✅ Protected API routes
- ✅ Environment variable protection (.env not committed)
- ✅ CORS enabled
- ✅ Secure payment processing via Stripe

## Future Enhancements

- [ ] User reviews and ratings
- [ ] Product search and filters
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Admin analytics dashboard
- [ ] User profile management
- [ ] Refund processing
- [ ] Multi-language support

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MONGODB_URI in `.env`
   - Ensure MongoDB is running

2. **Email Not Sending**
   - Verify Gmail app-specific password
   - Enable "Less secure apps" if using plain Gmail password
   - Check EMAIL_USER in `.env`

3. **Stripe Payment Issues**
   - Verify STRIPE_SECRET_KEY and STRIPE_PUBLIC_KEY
   - Check FRONTEND_URL for redirect

4. **CORS Errors**
   - Ensure backend and frontend are on correct URLs
   - Check CORS configuration in Express

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**FarooqueAli980**

- GitHub: [@FarooqueAli980](https://github.com/FarooqueAli980)
- Repository: [E-commerce MERN Stack](https://github.com/FarooqueAli980/E-commerce-MERN-stack-p)

## Support

For support, email farooqueali980@gmail.com or open an issue on GitHub.

---

**Happy Coding!** 🚀
