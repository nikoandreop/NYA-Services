
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Apply middleware
app.use(cors());
app.use(bodyParser.json());

// Data directory - try multiple locations
const DATA_DIRS = [
  path.join(__dirname, 'data'),
  path.join(process.cwd(), 'data'),
  '/app/data'
];

// Find a writable data directory
let DATA_DIR;
for (const dir of DATA_DIRS) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o777 });
      console.log(`Created data directory at ${dir} with permissions 777`);
    }
    
    // Test if directory is writable
    const testFile = path.join(dir, '.write-test');
    fs.writeFileSync(testFile, 'test', { mode: 0o666 });
    fs.unlinkSync(testFile);
    
    DATA_DIR = dir;
    console.log(`Using data directory: ${DATA_DIR}`);
    break;
  } catch (error) {
    console.error(`Cannot use data directory ${dir}:`, error);
  }
}

if (!DATA_DIR) {
  console.error('FATAL ERROR: Could not find or create a writable data directory');
  process.exit(1);
}

// Define data file paths
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TICKETS_FILE = path.join(DATA_DIR, 'tickets.json');
const INTEGRATIONS_FILE = path.join(DATA_DIR, 'integrations.json');

// Helper to safely write files with proper permissions
const safeWriteFile = (filePath, data) => {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true, mode: 0o777 });
    }
    
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, { mode: 0o666 });
    console.log(`Successfully wrote to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// Helper to read JSON data
const readJsonFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  try {
    // Check if services file exists, if not create it
    if (!fs.existsSync(SERVICES_FILE)) {
      safeWriteFile(SERVICES_FILE, [
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
      ]);
    }

    // Check if users file exists, if not create it
    if (!fs.existsSync(USERS_FILE)) {
      const adminPassword = crypto.createHash('sha256').update('nyaservices2025').digest('hex');
      safeWriteFile(USERS_FILE, [
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
      ]);
    }

    // Check if tickets file exists, if not create it
    if (!fs.existsSync(TICKETS_FILE)) {
      safeWriteFile(TICKETS_FILE, [
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
      ]);
    }

    // Check if integrations file exists, if not create it
    if (!fs.existsSync(INTEGRATIONS_FILE)) {
      safeWriteFile(INTEGRATIONS_FILE, {
        uptimeKuma: {
          url: '',
          apiKey: ''
        },
        authentik: {
          url: '',
          apiKey: ''
        }
      });
    }
    
    console.log('Data files initialized successfully');
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
};

// Try to initialize data files
initializeDataFiles();

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
    if (!users) {
      return res.status(500).json({ error: 'Error reading users data' });
    }
    
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

// =========================================================
// API ROUTES
// =========================================================

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
  if (!safeWriteFile(SERVICES_FILE, services)) {
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
  if (!safeWriteFile(SERVICES_FILE, services)) {
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

  if (!safeWriteFile(SERVICES_FILE, filteredServices)) {
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
  if (!safeWriteFile(USERS_FILE, users)) {
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
  if (!safeWriteFile(USERS_FILE, users)) {
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
  if (!safeWriteFile(TICKETS_FILE, tickets)) {
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
  if (!safeWriteFile(TICKETS_FILE, tickets)) {
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

  if (!safeWriteFile(TICKETS_FILE, tickets)) {
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
  if (!safeWriteFile(INTEGRATIONS_FILE, req.body)) {
    return res.status(500).json({ error: 'Error saving integrations' });
  }
  res.json(req.body);
});

// =========================================================
// SERVING STATIC FILES & CLIENT ROUTES
// =========================================================

// Static files - Serve these first
app.use(express.static(path.join(__dirname, 'dist')));

// API 404 handler - Only for paths that start with /api
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// React app fallback - Using a simple string path to avoid regex issues
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NYA Services Dashboard is available at: http://localhost:${PORT}`);
  console.log('Default login credentials:');
  console.log('Username: admin');
  console.log('Password: nyaservices2025');
});
