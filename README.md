# Employee Management System (EMS)

A full-stack, responsive Employee Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring role-based authentication, beautiful UI with Tailwind CSS, and comprehensive employee management capabilities.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Role-based Access Control**: Admin, Manager, and Employee roles
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-specific access to different sections
- **Password Management**: Secure password hashing with bcrypt

### 👥 Employee Management
- **CRUD Operations**: Create, Read, Update, Delete employees
- **Advanced Search**: Search by name, department, position
- **Filtering**: Filter by department and status
- **Pagination**: Efficient data loading with pagination
- **Employee Profiles**: Detailed employee information

### 📊 Dashboard & Analytics
- **Role-based Dashboards**: Different views for different user roles
- **Statistics Cards**: Key metrics and KPIs
- **Charts & Graphs**: Visual representation of data using Recharts
- **Department Analytics**: Department-wise employee distribution
- **Recent Activity**: Latest hires and updates

### 🎨 User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional interface
- **Interactive Components**: Modals, forms, and dynamic content
- **Toast Notifications**: User feedback with react-hot-toast
- **Loading States**: Smooth user experience with loading indicators

### 🛠️ Technical Features
- **Error Handling**: Comprehensive try-catch error handling
- **API Integration**: Axios for HTTP requests with interceptors
- **Form Validation**: Client-side and server-side validation
- **State Management**: React Context for global state
- **Responsive Layout**: Mobile and desktop optimized

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **react-hot-toast** - Toast notifications
- **Lucide React** - Icon library
- **Recharts** - Chart components
- **Vite** - Build tool

## 📁 Project Structure

```
EMS/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Frontend dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── vite.config.js     # Vite configuration
├── models/                 # Database models
│   ├── User.js           # User model
│   └── Employee.js       # Employee model
├── routes/                # API routes
│   ├── auth.js           # Authentication routes
│   ├── employees.js      # Employee management routes
│   └── dashboard.js      # Dashboard routes
├── middleware/            # Custom middleware
│   └── auth.js           # Authentication middleware
├── server.js              # Main server file
├── package.json           # Backend dependencies
└── config.env             # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EMS
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ems
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

5. **Start MongoDB**
   - Ensure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud service)

6. **Run the application**

   **Terminal 1 - Backend:**
   ```bash
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## 👤 User Roles & Permissions

### 🔴 Admin
- Full access to all features
- Create, edit, delete employees
- View all statistics and analytics
- Manage user accounts
- Access to dashboard charts

### 🔵 Manager
- View and edit employee information
- Access to employee management
- View department statistics
- Limited administrative functions

### 🟢 Employee
- View own profile and information
- Update personal information
- Access to personal dashboard
- Limited to own data

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile devices** (320px+)
- **Tablets** (768px+)
- **Desktop** (1024px+)
- **Large screens** (1280px+)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Configurable cross-origin settings
- **Role-based Access**: Granular permission system
- **Secure Headers**: HTTP security headers

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Employees
- `GET /api/employees` - Get all employees (paginated)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/departments/stats` - Department statistics

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/employees/chart` - Chart data
- `GET /api/dashboard/search` - Search functionality

## 🎨 Customization

### Styling
- Modify `client/tailwind.config.js` for theme customization
- Update `client/src/index.css` for custom CSS
- Use Tailwind utility classes for rapid styling

### Components
- All components are modular and reusable
- Easy to extend and modify
- Follow React best practices

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure MongoDB connection
4. Set up reverse proxy (Nginx)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- [ ] Email notifications
- [ ] File upload for documents
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Real-time updates
- [ ] Advanced analytics

---

**Built with ❤️ using the MERN stack**
