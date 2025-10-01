# Task Management Web App

A full-stack web application for managing personal and team tasks with a modern, responsive interface. Built with React frontend and Node.js backend, featuring user authentication, task management, and real-time updates.

## 🚀 Features

### User Management
- **User Registration & Login** - Secure authentication with JWT tokens
- **Protected Routes** - Access control for authenticated users
- **Session Management** - Persistent login sessions

### Task Management
- **Create Tasks** - Add new tasks with title and description
- **Update Tasks** - Edit existing task details
- **Delete Tasks** - Remove completed or unnecessary tasks
- **Mark Complete** - Toggle task completion status
- **Search & Filter** - Find tasks quickly with search and status filters

### User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Clean, intuitive interface built with TailwindCSS
- **Real-time Updates** - Instant feedback on task operations
- **Dashboard View** - Overview of all tasks and user statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Query** - Data fetching and caching
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
Task-Management-Web-App/
├── backend/
│   ├── controller/          # Route controllers
│   │   ├── task.controller.js
│   │   └── user.controller.js
│   ├── middleware/          # Custom middleware
│   │   └── authentication.middleware.js
│   ├── models/             # Database models
│   │   ├── task.model.js
│   │   └── user.model.js
│   ├── routes/             # API routes
│   │   ├── task.route.js
│   │   └── user.route.js
│   ├── jwt/                # JWT utilities
│   │   └── token.js
│   ├── index.js            # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── assets/         # Static assets
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Public assets
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task-Management-Web-App
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

#### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanager
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET_KEY=your_super_secret_jwt_key_here
NODE_ENV=development
```

#### Frontend Environment Variables
Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## 🔧 Development

### Available Scripts

#### Backend
- `npm start` - Start the development server with nodemon
- `npm test` - Run tests (when implemented)

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Schema

#### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

#### Task Model
```javascript
{
  title: String,
  description: String,
  status: String (pending/completed),
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables on your hosting platform
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `dist/` folder to platforms like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Hiten** - Full Stack Developer

## 🔮 Future Enhancements

- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] File attachments
- [ ] Team collaboration features
- [ ] Task sharing and assignment
- [ ] Advanced filtering and sorting
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Data export/import functionality

---

**Happy Task Managing! 🎯**
