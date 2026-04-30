# Personal Finance Tracker

A full-stack web application for tracking personal finances with income, expenses, and balance calculations.

## Project Structure

```
video18/
├── server.js           # Express server and API routes
├── db.js              # MongoDB connection and schema
├── package.json       # Node.js dependencies
├── .env              # Environment variables
└── public/
    ├── index.html    # Frontend HTML
    ├── styles.css    # Frontend CSS
    └── script.js     # Frontend JavaScript
```

## Features

- ✅ Add income and expense transactions
- ✅ View all transactions in a table
- ✅ Delete transactions
- ✅ Calculate total income, total expense, and balance
- ✅ Responsive design for mobile and desktop
- ✅ Real-time updates
- ✅ Form validation
- ✅ Success/Error alerts

## Prerequisites

Before running the application, make sure you have:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** (Local instance or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community)

## Installation

### Step 1: Install Dependencies

```bash
cd c:\Users\Admin\Desktop\Sigma\video18
npm install
```

### Step 2: Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
# or
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Update the connection string in `db.js`:
```javascript
const conn = await mongoose.connect('your-mongodb-atlas-uri', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### Step 3: Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Fill in the transaction form:
   - **Amount**: Enter the transaction amount
   - **Type**: Select Income or Expense
   - **Category**: Enter category (e.g., Salary, Groceries, Entertainment)
   - **Date**: Select the transaction date
3. Click "Add Transaction"
4. View all transactions in the table below
5. Delete transactions by clicking the "Delete" button
6. View your summary at the top (Total Income, Total Expense, Balance)

## API Endpoints

### Get All Transactions
```
GET /api/all
Response: { success: true, data: [...] }
```

### Add Transaction
```
POST /api/add
Body: {
  "amount": 100,
  "type": "income",
  "category": "Salary",
  "date": "2024-04-25"
}
Response: { success: true, message: "...", data: {...} }
```

### Delete Transaction
```
DELETE /api/delete/:id
Response: { success: true, message: "...", data: {...} }
```

## Database Schema

```javascript
{
  amount: Number,        // Transaction amount
  type: String,          // "income" or "expense"
  category: String,      // Transaction category
  date: Date,           // Transaction date
  createdAt: Date       // Creation timestamp
}
```

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API with JSON data transfer

## Development Mode

To run the server with auto-reload on file changes:

```bash
npm run dev
```

This requires `nodemon` which is included in the dev dependencies.

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px and above)
- Tablet (768px to 1199px)
- Mobile (below 768px)

## Error Handling

- Form validation alerts
- Network error handling
- MongoDB connection error handling
- API error responses with descriptive messages

## Future Enhancements

- Add user authentication
- Add expense categories filter
- Add date range filter
- Add charts and analytics
- Add budget limits
- Add recurring transactions
- Add CSV export
- Add search functionality

## Troubleshooting

**MongoDB Connection Error**
- Make sure MongoDB is running: `mongod`
- Check the connection string in `db.js`
- Verify MongoDB credentials if using Atlas

**Port Already in Use**
- Change `PORT` in `.env` file or in `server.js`

**npm install fails**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

## License

This project is open source and available under the MIT License.

## Author

Created as a full-stack web development tutorial project.
