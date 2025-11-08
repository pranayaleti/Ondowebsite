import pkg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_o0t1YrGAJByC@ep-restless-frost-adafv6il-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Default admin credentials
const adminEmail = 'admin@ondosoft.com';
const adminPassword = 'admin123';
const adminName = 'Admin User';

// Default client credentials
const clientEmail = 'client@ondosoft.com';
const clientPassword = 'client123';
const clientName = 'Test Client';

async function seedUsers() {
  try {
    // Create admin user
    const existingAdmin = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    
    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
    } else {
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        `INSERT INTO users (email, password, name, role)
         VALUES ($1, $2, $3, 'ADMIN')
         RETURNING id, email, name, role`,
        [adminEmail, hashedAdminPassword, adminName]
      );
      console.log('✅ Admin user created successfully!');
    }

    // Create client user
    const existingClient = await pool.query('SELECT * FROM users WHERE email = $1', [clientEmail]);
    
    if (existingClient.rows.length > 0) {
      console.log('⚠️  Client user already exists!');
    } else {
      const hashedClientPassword = await bcrypt.hash(clientPassword, 10);
      await pool.query(
        `INSERT INTO users (email, password, name, role)
         VALUES ($1, $2, $3, 'USER')
         RETURNING id, email, name, role`,
        [clientEmail, hashedClientPassword, clientName]
      );
      console.log('✅ Client user created successfully!');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 DEFAULT USER CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👨‍💼 ADMIN USER:');
    console.log('   📧 Email:', adminEmail);
    console.log('   🔑 Password:', adminPassword);
    console.log('   🔗 Dashboard: http://localhost:3000/admin');
    console.log('\n👤 CLIENT USER:');
    console.log('   📧 Email:', clientEmail);
    console.log('   🔑 Password:', clientPassword);
    console.log('   🔗 Portal: http://localhost:3000/portal');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can sign in at: http://localhost:3000/auth/signin');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await pool.end();
  }
}

seedUsers();
