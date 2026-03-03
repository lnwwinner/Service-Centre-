import Database from 'better-sqlite3';
import path from 'path';
import { APP_CONFIG } from './config';

const dbPath = path.join(process.cwd(), APP_CONFIG.DB_NAME);
const db = new Database(dbPath);

// Initialize Database Schema
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      permissions TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role_id INTEGER,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      contact TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vin TEXT UNIQUE,
      license_plate TEXT,
      customer_id INTEGER,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS service_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      details TEXT,
      branch_id TEXT,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT,
      user_id INTEGER,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
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
      category TEXT, -- Engine, Electrical, Brake, etc.
      data JSON,
      severity TEXT, -- Critical, Warning, Info
      recommendation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    );

    CREATE TABLE IF NOT EXISTS customizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      feature TEXT, -- Lighting, Locking, Alerts
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
      status TEXT DEFAULT 'PENDING', -- PENDING, CONFIRMED, COMPLETED, CANCELLED
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
      status TEXT DEFAULT 'WAITING', -- WAITING, IN_PROGRESS, TESTING, READY
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
      type TEXT, -- USB, BLUETOOTH, WIFI, CLOUD
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
  const rolesCount = db.prepare('SELECT count(*) as count FROM roles').get() as { count: number };
  if (rolesCount.count === 0) {
    db.prepare('INSERT INTO roles (name, permissions) VALUES (?, ?)').run(APP_CONFIG.ROLES.ADMIN, APP_CONFIG.PERMISSIONS.ADMIN);
    db.prepare('INSERT INTO roles (name, permissions) VALUES (?, ?)').run(APP_CONFIG.ROLES.STAFF, APP_CONFIG.PERMISSIONS.STAFF);
    db.prepare('INSERT INTO roles (name, permissions) VALUES (?, ?)').run(APP_CONFIG.ROLES.AUDITOR, APP_CONFIG.PERMISSIONS.AUDITOR);
  }

  // Seed Users
  const usersCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (usersCount.count === 0) {
    db.prepare('INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)').run('admin', 'password123', 1);
    db.prepare('INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)').run('staff', 'password123', 2);
    db.prepare('INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)').run('auditor', 'password123', 3);
  }
}

export default db;
