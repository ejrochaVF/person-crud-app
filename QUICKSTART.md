# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v14+) - Run: `node --version`
- ✅ MySQL installed and running - Run: `mysql --version`
- ✅ Visual Studio Code (recommended)

---

## Step-by-Step Setup

### 1️⃣ Database Setup (2 minutes)

Open MySQL (Command Line, Workbench, or any client):

```sql
-- Copy and paste the entire database_setup.sql file
-- Or run these essential commands:

CREATE DATABASE person_crud_db;
USE person_crud_db;

CREATE TABLE persons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional: Add sample data
INSERT INTO persons (name, surname, email, address, phone) VALUES
('John', 'Doe', 'john.doe@email.com', '123 Main St', '555-0101'),
('Jane', 'Smith', 'jane.smith@email.com', '456 Oak Ave', '555-0102');
```

---

### 2️⃣ Backend Setup (1 minute)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file (USE YOUR MYSQL PASSWORD!)
# Windows: notepad .env
# Mac/Linux: nano .env
# Or: code .env (if using VS Code)

# Start the backend server
npm start
```

You should see:
```
🚀 Server is running on port 5000
✅ Database connected successfully
```

---

### 3️⃣ Frontend Setup (1 minute)

**Open a NEW terminal** (keep backend running):

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

Browser will automatically open to `http://localhost:3000`

---

## ✅ Verification

You should now see:

1. **Backend Terminal:**
   ```
   🚀 Server is running on port 5000
   ✅ Database connected successfully
   ```

2. **Frontend Browser:**
   - Person Management interface
   - List of persons (if you added sample data)
   - "Add New Person" button

3. **Test CRUD Operations:**
   - Click "Add New Person"
   - Fill the form and click "Create"
   - See the new person in the list
   - Click "Edit" to modify
   - Click "Delete" to remove

---

## 🐛 Quick Troubleshooting

### Backend won't start?

**Problem:** `Error: Access denied for user`  
**Solution:** Check MySQL username/password in `.env` file

**Problem:** `ECONNREFUSED`  
**Solution:** Start MySQL server
```bash
# Windows
net start MySQL80

# Mac
mysql.server start

# Linux
sudo service mysql start
```

**Problem:** `Port 5000 already in use`  
**Solution:** Change PORT in `.env` to 5001

---

### Frontend won't start?

**Problem:** `Port 3000 already in use`  
**Solution:** The app will ask if you want to use a different port. Say YES.

**Problem:** `Cannot GET /api/persons`  
**Solution:** Make sure backend is running on port 5000

---

### Can't connect frontend to backend?

**Problem:** CORS errors in browser console  
**Solution:** Make sure backend has `cors()` enabled (it does by default)

**Problem:** Network error  
**Solution:** 
1. Check backend is running: Open `http://localhost:5000/api/persons`
2. You should see JSON data

---

## 📁 Project Structure Reference

```
person-crud-app/
├── backend/                # Node.js Backend
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database operations
│   │   ├── routes/        # API endpoints
│   │   └── server.js      # Entry point
│   ├── .env               # Your MySQL credentials (create this!)
│   └── package.json
│
├── frontend/              # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── services/      # API calls
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
└── README.md              # Full documentation
```

---

## 🎓 What to Learn Next

1. **Read the full README.md** for detailed explanations
2. **Read ARCHITECTURE_GUIDE.md** to understand 3-tier architecture
3. **Check backend/README.md** for backend details
4. **Check frontend/README.md** for React concepts

---

## 💡 Testing the API Directly

Open browser and visit:
- `http://localhost:5000/` - API info
- `http://localhost:5000/api/persons` - Get all persons (JSON)

Or use curl:
```bash
# Get all persons
curl http://localhost:5000/api/persons

# Create a person
curl -X POST http://localhost:5000/api/persons \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","surname":"User","email":"test@email.com","address":"123 St","phone":"555-1234"}'
```

---

## 📞 Need Help?

1. Check the full README.md
2. Check backend/README.md and frontend/README.md
3. Read ARCHITECTURE_GUIDE.md
4. Check browser console for errors (F12)
5. Check terminal for backend errors

---

## ⚙️ VS Code Setup (Optional but Recommended)

Open VS Code in the project root:
```bash
code person-crud-app
```

**Recommended Extensions:**
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier
- MySQL (for database management)

**Use Split Terminal:**
- Terminal 1: `cd backend && npm start`
- Terminal 2: `cd frontend && npm start`

---

## 🎯 You're Ready!

If you see the Person Management interface and can create/edit/delete persons, you're all set! 

**Next:** Explore the code, read the documentation, and start learning! 🚀

---

**Happy Coding!** 👨‍💻👩‍💻
