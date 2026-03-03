import Database from 'better-sqlite3';

const db = new Database('toyota_diagnostic.db');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role_id INTEGER,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      vin TEXT UNIQUE,
      license_plate TEXT,
      model TEXT,
      year INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      rating INTEGER,
      comment TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serial_number TEXT UNIQUE,
      model TEXT,
      status TEXT,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS diagnostic_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      category TEXT,
      data JSON,
      severity TEXT,
      recommendation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );

    CREATE TABLE IF NOT EXISTS customizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      feature TEXT,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      vehicle_id INTEGER,
      appointment_date DATE,
      time_slot TEXT,
      status TEXT DEFAULT 'PENDING',
      service_type TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_name TEXT,
      sku TEXT UNIQUE,
      quantity INTEGER DEFAULT 0,
      threshold INTEGER DEFAULT 5,
      price REAL,
      category TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      appointment_id INTEGER,
      status TEXT DEFAULT 'WAITING',
      bay_id TEXT,
      technician_name TEXT,
      start_time DATETIME,
      end_time DATETIME,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
      FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    );

    CREATE TABLE IF NOT EXISTS obd_devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      connection_string TEXT,
      status TEXT DEFAULT 'DISCONNECTED',
      last_seen DATETIME,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS obd_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id INTEGER,
      vehicle_id INTEGER,
      command TEXT,
      response TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES obd_devices(id)
    );
  `);

  // Seed Roles
  const rolesCount = db.prepare('SELECT COUNT(*) as count FROM roles').get() as any;
  if (rolesCount.count === 0) {
    const insertRole = db.prepare('INSERT INTO roles (name) VALUES (?)');
    insertRole.run('Admin');
    insertRole.run('Staff');
    insertRole.run('Auditor');
  }

  // Seed Users
  const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  if (usersCount.count === 0) {
    const insertUser = db.prepare('INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)');
    insertUser.run('admin', 'password123', 1);
    insertUser.run('staff', 'password123', 2);
    insertUser.run('auditor', 'password123', 3);
  }
}

export default db;
