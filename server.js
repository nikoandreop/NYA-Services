
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Apply middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Data directory
const DATA_DIR = path.join(__dirname, 'data');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TICKETS_FILE = path.join(DATA_DIR, 'tickets.json');
const INTEGRATIONS_FILE = path.join(DATA_DIR, 'integrations.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  if (!fs.existsSync(SERVICES_FILE)) {
    fs.writeFileSync(
      SERVICES_FILE,
      JSON.stringify([
        {
          id: '1',
          name: 'Jellyfin',
          description: 'Media streaming service',
          logo: '/lovable-uploads/387f4f7a-9636-4bb7-9369-45965d77c4f7.png',
          url: 'https://jellyfin.example.com',
          status: 'up',
          uptimePercentage: 99.8,
          adminPanel: 'https://jellyfin-admin.example.com'
        },
        {
          id: '2',
          name: 'Nextcloud',
          description: 'File storage and collaboration',
          logo: 'https://nextcloud.com/media/nextcloud-logo.png',
          url: 'https://nextcloud.example.com',
          status: 'up',
          uptimePercentage: 99.5,
          adminPanel: 'https://nextcloud-admin.example.com'
        }
      ])
    );
  }

  if (!fs.existsSync(USERS_FILE)) {
    // Create default admin user with SHA-256 hashed password
    const adminPassword = crypto.createHash('sha256').update('nyaservices2025').digest('hex');
    
    fs.writeFileSync(
      USERS_FILE,
      JSON.stringify([
        {
          id: 1,
          username: 'admin',
          password: adminPassword,
          name: 'Administrator',
          email: 'admin@example.com',
          role: 'admin',
          status: 'Active'
        },
        {
          id: 2,
          username: 'demo',
          password: crypto.createHash('sha256').update('password').digest('hex'),
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'user',
          status: 'Active'
        }
      ])
    );
  }

  if (!fs.existsSync(TICKETS_FILE)) {
    fs.writeFileSync(
      TICKETS_FILE,
      JSON.stringify([
        {
          id: 'TKT-001',
          subject: 'Jellyfin Buffering Issue',
          status: 'Open',
          priority: 'High',
          assignedTo: 'admin',
          date: '2025-05-01',
          description: "I'm experiencing constant buffering when watching 4K content on Jellyfin.",
          messages: [
            { sender: 'user', text: 'The buffering happens every 10-15 seconds.', timestamp: '2025-05-01 10:30' }
          ],
          userId: 1
        }
      ])
    );
  }

  if (!fs.existsSync(INTEGRATIONS_FILE)) {
    fs.writeFileSync(
      INTEGRATIONS_FILE,
      JSON.stringify({
        uptimeKuma: {
          url: '',
          apiKey: ''
        },
        authentik: {
          url: '',
          apiKey: ''
        }
      })
    );
  }
};

initializeDataFiles();

// Helper to read/write JSON data
const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Simple token validation (in production, use proper JWT verification)
    const [username, timestamp] = Buffer.from(token, 'base64').toString().split(':');
    const users = readJsonFile(USERS_FILE);
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = { username: user.username, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Auth routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = readJsonFile(USERS_FILE);
  if (!users) {
    return res.status(500).json({ error: 'Error reading users data' });
  }

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  const user = users.find(u => u.username === username && u.password === hashedPassword);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create a simple token (in production, use proper JWT)
  const timestamp = Date.now();
  const token = Buffer.from(`${username}:${timestamp}`).toString('base64');

  res.json({ 
    token,
    user: {
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Services API
app.get('/api/services', (req, res) => {
  const services = readJsonFile(SERVICES_FILE);
  if (!services) {
    return res.status(500).json({ error: 'Error reading services data' });
  }
  res.json(services);
});

app.post('/api/services', authenticate, isAdmin, (req, res) => {
  const services = readJsonFile(SERVICES_FILE);
  if (!services) {
    return res.status(500).json({ error: 'Error reading services data' });
  }

  const newService = {
    id: Date.now().toString(),
    ...req.body
  };

  services.push(newService);
  if (!writeJsonFile(SERVICES_FILE, services)) {
    return res.status(500).json({ error: 'Error saving service' });
  }

  res.status(201).json(newService);
});

app.put('/api/services/:id', authenticate, isAdmin, (req, res) => {
  const services = readJsonFile(SERVICES_FILE);
  if (!services) {
    return res.status(500).json({ error: 'Error reading services data' });
  }

  const index = services.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  services[index] = { ...services[index], ...req.body };
  if (!writeJsonFile(SERVICES_FILE, services)) {
    return res.status(500).json({ error: 'Error updating service' });
  }

  res.json(services[index]);
});

app.delete('/api/services/:id', authenticate, isAdmin, (req, res) => {
  const services = readJsonFile(SERVICES_FILE);
  if (!services) {
    return res.status(500).json({ error: 'Error reading services data' });
  }

  const filteredServices = services.filter(s => s.id !== req.params.id);
  if (filteredServices.length === services.length) {
    return res.status(404).json({ error: 'Service not found' });
  }

  if (!writeJsonFile(SERVICES_FILE, filteredServices)) {
    return res.status(500).json({ error: 'Error deleting service' });
  }

  res.json({ success: true });
});

// User API
app.get('/api/users', authenticate, isAdmin, (req, res) => {
  const users = readJsonFile(USERS_FILE);
  if (!users) {
    return res.status(500).json({ error: 'Error reading users data' });
  }
  
  // Don't send passwords in response
  const sanitizedUsers = users.map(({ password, ...user }) => user);
  res.json(sanitizedUsers);
});

app.post('/api/users', authenticate, isAdmin, (req, res) => {
  const users = readJsonFile(USERS_FILE);
  if (!users) {
    return res.status(500).json({ error: 'Error reading users data' });
  }

  const { username, password, ...userData } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (users.some(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    username,
    password: hashedPassword,
    ...userData
  };

  users.push(newUser);
  if (!writeJsonFile(USERS_FILE, users)) {
    return res.status(500).json({ error: 'Error saving user' });
  }

  const { password: _, ...userResponse } = newUser;
  res.status(201).json(userResponse);
});

app.put('/api/users/:id', authenticate, isAdmin, (req, res) => {
  const users = readJsonFile(USERS_FILE);
  if (!users) {
    return res.status(500).json({ error: 'Error reading users data' });
  }

  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userData } = req.body;
  
  // If password is being updated, hash it
  if (password) {
    userData.password = crypto.createHash('sha256').update(password).digest('hex');
  } else {
    userData.password = users[index].password;
  }

  users[index] = { ...users[index], ...userData };
  if (!writeJsonFile(USERS_FILE, users)) {
    return res.status(500).json({ error: 'Error updating user' });
  }

  const { password: _, ...userResponse } = users[index];
  res.json(userResponse);
});

// Support tickets API
app.get('/api/tickets', authenticate, (req, res) => {
  const tickets = readJsonFile(TICKETS_FILE);
  if (!tickets) {
    return res.status(500).json({ error: 'Error reading tickets data' });
  }
  
  // Filter tickets based on user role
  if (req.user.role !== 'admin') {
    const userTickets = tickets.filter(t => t.userId === req.user.id);
    return res.json(userTickets);
  }
  
  res.json(tickets);
});

app.post('/api/tickets', authenticate, (req, res) => {
  const tickets = readJsonFile(TICKETS_FILE);
  if (!tickets) {
    return res.status(500).json({ error: 'Error reading tickets data' });
  }

  const ticketCount = tickets.length;
  const newTicket = {
    id: `TKT-${String(ticketCount + 1).padStart(3, '0')}`,
    status: 'Open',
    date: new Date().toISOString().split('T')[0],
    messages: [],
    ...req.body,
    userId: req.user.id
  };

  tickets.push(newTicket);
  if (!writeJsonFile(TICKETS_FILE, tickets)) {
    return res.status(500).json({ error: 'Error saving ticket' });
  }

  res.status(201).json(newTicket);
});

app.put('/api/tickets/:id', authenticate, (req, res) => {
  const tickets = readJsonFile(TICKETS_FILE);
  if (!tickets) {
    return res.status(500).json({ error: 'Error reading tickets data' });
  }

  const index = tickets.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // Non-admins can only update their own tickets
  if (req.user.role !== 'admin' && tickets[index].userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  tickets[index] = { ...tickets[index], ...req.body };
  if (!writeJsonFile(TICKETS_FILE, tickets)) {
    return res.status(500).json({ error: 'Error updating ticket' });
  }

  res.json(tickets[index]);
});

app.post('/api/tickets/:id/messages', authenticate, (req, res) => {
  const tickets = readJsonFile(TICKETS_FILE);
  if (!tickets) {
    return res.status(500).json({ error: 'Error reading tickets data' });
  }

  const index = tickets.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // Non-admins can only add messages to their own tickets
  if (req.user.role !== 'admin' && tickets[index].userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  const newMessage = {
    sender: req.user.role === 'admin' ? 'admin' : 'user',
    text: req.body.text,
    timestamp: new Date().toLocaleString()
  };

  if (!tickets[index].messages) {
    tickets[index].messages = [];
  }
  tickets[index].messages.push(newMessage);

  if (!writeJsonFile(TICKETS_FILE, tickets)) {
    return res.status(500).json({ error: 'Error adding message' });
  }

  res.status(201).json(newMessage);
});

// Integrations API
app.get('/api/integrations', authenticate, isAdmin, (req, res) => {
  const integrations = readJsonFile(INTEGRATIONS_FILE);
  if (!integrations) {
    return res.status(500).json({ error: 'Error reading integrations data' });
  }
  res.json(integrations);
});

app.put('/api/integrations', authenticate, isAdmin, (req, res) => {
  if (!writeJsonFile(INTEGRATIONS_FILE, req.body)) {
    return res.status(500).json({ error: 'Error saving integrations' });
  }
  res.json(req.body);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
