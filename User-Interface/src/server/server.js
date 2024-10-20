const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');  // Declare this only once at the top
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());  // Enable CORS for all routes

// Ensure correct path formatting
const dbPath = path.join(__dirname, '/database.json');  

// Endpoint to update the balance in database.json
app.post('/update-balance', (req, res) => {
  const { accountNumber, newFiatBalance } = req.body;

  // Read the current database
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading database:', err);
      return res.status(500).json({ error: 'Error reading database' });
    }

    let database;
    try {
      database = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ error: 'Error parsing database' });
    }

    // Update the balance for the specified user
    const updatedDatabase = database.map(user => {
      if (user['Account Number'] === accountNumber) {
        return {
          ...user,
          Balance: newFiatBalance  // Update the user's balance
        };
      }
      return user;
    });

    // Write the updated database back to the file
    fs.writeFile(dbPath, JSON.stringify(updatedDatabase, null, 2), (err) => {
      if (err) {
        console.error('Error writing to database:', err);
        return res.status(500).json({ error: 'Error writing to database' });
      }
      res.json({ message: 'Balance updated successfully' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
