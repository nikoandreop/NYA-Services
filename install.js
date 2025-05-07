
// Installation script for NYA Services Dashboard
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Async readline function
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('\n========================================');
  console.log('NYA Services Dashboard - Installation');
  console.log('========================================\n');

  console.log('This script will set up NYA Services Dashboard for local hosting.\n');
  
  // Create data directory
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Created data directory');
  } else {
    console.log('✅ Data directory already exists');
  }

  // Admin user setup
  let adminUsername = 'admin';
  let adminPassword = '';
  let adminEmail = '';
  
  console.log('\nConfiguring admin user:');
  
  try {
    adminUsername = await question('Admin username (default: admin): ') || adminUsername;
    adminPassword = await question('Admin password (default: nyaservices2025): ') || 'nyaservices2025';
    adminEmail = await question('Admin email: ');
    
    const hashedPassword = crypto.createHash('sha256').update(adminPassword).digest('hex');
    
    // Save admin user to users.json
    const usersFilePath = path.join(dataDir, 'users.json');
    const users = [{
      id: 1,
      username: adminUsername,
      password: hashedPassword,
      name: 'Administrator',
      email: adminEmail || 'admin@example.com',
      role: 'admin',
      status: 'Active'
    }];
    
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    console.log('✅ Admin user configured');
    
    // Create empty services.json
    const servicesFilePath = path.join(dataDir, 'services.json');
    if (!fs.existsSync(servicesFilePath)) {
      fs.writeFileSync(servicesFilePath, JSON.stringify([], null, 2));
      console.log('✅ Services file created');
    }
    
    // Create empty tickets.json
    const ticketsFilePath = path.join(dataDir, 'tickets.json');
    if (!fs.existsSync(ticketsFilePath)) {
      fs.writeFileSync(ticketsFilePath, JSON.stringify([], null, 2));
      console.log('✅ Tickets file created');
    }
    
    // Create integrations.json
    const integrationsFilePath = path.join(dataDir, 'integrations.json');
    if (!fs.existsSync(integrationsFilePath)) {
      const integrations = {
        uptimeKuma: {
          url: '',
          apiKey: ''
        },
        authentik: {
          url: '',
          apiKey: ''
        }
      };
      fs.writeFileSync(integrationsFilePath, JSON.stringify(integrations, null, 2));
      console.log('✅ Integrations file created');
    }
    
    console.log('\nInstalling dependencies...');
    
    try {
      // Check if we're using npm or yarn
      let npmCommand = 'npm';
      if (fs.existsSync(path.join(__dirname, 'yarn.lock'))) {
        npmCommand = 'yarn';
      }
      
      // Install server dependencies
      execSync(`${npmCommand} install express cors body-parser`, { stdio: 'inherit' });
      
      // Create .env file for frontend
      const envFilePath = path.join(__dirname, '.env');
      fs.writeFileSync(envFilePath, 'VITE_API_URL=http://localhost:3001/api\n');
      console.log('✅ Created .env file for frontend');
      
      console.log('\n✅ Installation completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Build the frontend: npm run build');
      console.log('2. Start the server: node server.js');
      console.log('3. Access NYA Services at: http://localhost:3001');
      console.log('\nLogin with:');
      console.log(`Username: ${adminUsername}`);
      console.log(`Password: ${adminPassword}`);
      
    } catch (error) {
      console.error('\n❌ Error installing dependencies:', error.message);
      console.log('Please install them manually using: npm install express cors body-parser');
    }
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    rl.close();
  }
}

setup();
