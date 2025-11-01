// SQLite Database for FinClash Trading Simulator
// This file handles all database initialization and operations

// Initialize SQLite Database
let db = null;
let dbReady = false;

// Initialize SQL.js and create/load database
async function initDatabase() {
    try {
        console.log('🗄️ Initializing SQLite database...');

        // Load sql.js with WASM
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        // Try to load existing database from localStorage
        const savedDb = localStorage.getItem('tradeWars_sqlite_db');
        if (savedDb) {
            const uint8Array = new Uint8Array(JSON.parse(savedDb));
            db = new SQL.Database(uint8Array);
            console.log('✅ Loaded existing SQLite database from localStorage');
        } else {
            db = new SQL.Database();
            console.log('✅ Created new SQLite database');
        }

        // Create tables if they don't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS personal_accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_code TEXT UNIQUE NOT NULL,
                user_name TEXT NOT NULL,
                user_email TEXT NOT NULL,
                passcode TEXT NOT NULL,
                portfolio TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Migration: Add user_email and passcode columns if they don't exist
        try {
            const checkColumns = db.exec('PRAGMA table_info(personal_accounts)');
            if (checkColumns.length > 0) {
                const columns = checkColumns[0].values.map(row => row[1]);

                if (!columns.includes('user_email')) {
                    console.log('📝 Adding user_email column to existing database...');
                    db.run('ALTER TABLE personal_accounts ADD COLUMN user_email TEXT DEFAULT ""');
                }

                if (!columns.includes('passcode')) {
                    console.log('📝 Adding passcode column to existing database...');
                    db.run('ALTER TABLE personal_accounts ADD COLUMN passcode TEXT DEFAULT ""');
                }
            }
        } catch (migrationError) {
            console.warn('Migration check skipped:', migrationError);
        }

        db.run(`
            CREATE TABLE IF NOT EXISTS competitions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE NOT NULL,
                total_pool REAL DEFAULT 0,
                start_time TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                competition_code TEXT NOT NULL,
                member_id TEXT NOT NULL,
                name TEXT NOT NULL,
                contribution REAL DEFAULT 0,
                portfolio TEXT NOT NULL,
                joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(competition_code, member_id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS reset_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT NOT NULL,
                code_hash TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                attempts INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Save database to localStorage
        saveDatabase();

        dbReady = true;
        console.log('✅ SQLite database initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing SQLite:', error);
        dbReady = false;
    }
}

// Save database to localStorage
function saveDatabase() {
    if (!db) return;
    try {
        const data = db.export();
        const buffer = Array.from(data);
        localStorage.setItem('tradeWars_sqlite_db', JSON.stringify(buffer));
        console.log('💾 Database saved to localStorage');
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// SQLite Database Functions
const SQLiteDB = {
    // Create new personal account
    createAccount(code, userName, userEmail, passcode, portfolio) {
        if (!db) throw new Error('Database not initialized');

        const portfolioJson = JSON.stringify(portfolio);
        const now = new Date().toISOString();

        db.run(
            'INSERT INTO personal_accounts (account_code, user_name, user_email, passcode, portfolio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [code, userName, userEmail, passcode, portfolioJson, now, now]
        );

        saveDatabase();
        console.log('✅ Account saved to SQLite:', code);

        return {
            account_code: code,
            user_name: userName,
            user_email: userEmail,
            passcode: passcode,
            portfolio: portfolio,
            created_at: now
        };
    },

    // Get account by code
    getAccount(code) {
        if (!db) throw new Error('Database not initialized');

        const result = db.exec(
            'SELECT * FROM personal_accounts WHERE account_code = ?',
            [code]
        );

        if (result.length === 0 || result[0].values.length === 0) {
            return null;
        }

        const row = result[0].values[0];
        return {
            id: row[0],
            account_code: row[1],
            user_name: row[2],
            user_email: row[3],
            passcode: row[4],
            portfolio: JSON.parse(row[5]),
            created_at: row[6],
            updated_at: row[7]
        };
    },

    // Get account by email and passcode (for login)
    getAccountByEmailAndPasscode(email, passcode) {
        if (!db) throw new Error('Database not initialized');

        const result = db.exec(
            'SELECT * FROM personal_accounts WHERE user_email = ? AND passcode = ?',
            [email, passcode]
        );

        if (result.length === 0 || result[0].values.length === 0) {
            return null;
        }

        const row = result[0].values[0];
        return {
            id: row[0],
            account_code: row[1],
            user_name: row[2],
            user_email: row[3],
            passcode: row[4],
            portfolio: JSON.parse(row[5]),
            created_at: row[6],
            updated_at: row[7]
        };
    },

    // Get account by email only (for password reset)
    getAccountByEmail(email) {
        if (!db) throw new Error('Database not initialized');

        const result = db.exec(
            'SELECT * FROM personal_accounts WHERE user_email = ?',
            [email]
        );

        if (result.length === 0 || result[0].values.length === 0) {
            return null;
        }

        const row = result[0].values[0];
        const portfolioData = row[5];
        let portfolio;
        try {
            portfolio = typeof portfolioData === 'string' ? JSON.parse(portfolioData) : portfolioData;
        } catch (e) {
            console.error('Error parsing portfolio data:', e);
            portfolio = { cash: 100000, stocks: {} };
        }

        return {
            id: row[0],
            account_code: row[1],
            user_name: row[2],
            user_email: row[3],
            passcode: row[4],
            portfolio: portfolio,
            created_at: row[6],
            updated_at: row[7]
        };
    },

    // Update account portfolio
    updateAccount(code, portfolio) {
        if (!db) throw new Error('Database not initialized');

        const portfolioJson = JSON.stringify(portfolio);
        const now = new Date().toISOString();

        db.run(
            'UPDATE personal_accounts SET portfolio = ?, updated_at = ? WHERE account_code = ?',
            [portfolioJson, now, code]
        );

        saveDatabase();
        console.log('✅ Account updated in SQLite:', code);
        return true;
    },

    // Get all accounts (for debugging)
    getAllAccounts() {
        if (!db) return [];

        const result = db.exec('SELECT account_code, user_name FROM personal_accounts');
        if (result.length === 0) return [];

        return result[0].values.map(row => ({
            account_code: row[0],
            user_name: row[1]
        }));
    }
};
