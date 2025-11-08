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
                password_hash TEXT,
                portfolio TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Migration: Add user_email, passcode, and password_hash columns if they don't exist
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

                if (!columns.includes('password_hash')) {
                    console.log('📝 Adding password_hash column to existing database...');
                    db.run('ALTER TABLE personal_accounts ADD COLUMN password_hash TEXT');
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

// Helper function to safely extract row data by column name
function extractRowData(result) {
    if (result.length === 0 || result[0].values.length === 0) {
        return null;
    }

    const columns = result[0].columns;
    const row = result[0].values[0];

    // Create a map of column name to value
    const data = {};
    columns.forEach((col, index) => {
        data[col] = row[index];
    });

    return data;
}

// SQLite Database Functions
const SQLiteDB = {
    // Create new personal account
    createAccount(code, userName, userEmail, passcode, portfolio, passwordHash = null) {
        if (!db) throw new Error('Database not initialized');

        const portfolioJson = JSON.stringify(portfolio);
        const now = new Date().toISOString();

        db.run(
            'INSERT INTO personal_accounts (account_code, user_name, user_email, passcode, password_hash, portfolio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [code, userName, userEmail, passcode, passwordHash, portfolioJson, now, now]
        );

        saveDatabase();
        console.log('✅ Account saved to SQLite:', code, '| Has password:', !!passwordHash);

        return {
            account_code: code,
            user_name: userName,
            user_email: userEmail,
            passcode: passcode,
            password_hash: passwordHash,
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

        const data = extractRowData(result);
        if (!data) return null;

        // Parse portfolio with error handling
        let portfolio;
        try {
            portfolio = typeof data.portfolio === 'string'
                ? JSON.parse(data.portfolio)
                : data.portfolio;
        } catch (e) {
            console.error('Error parsing portfolio for account:', code, e);
            portfolio = { cash: 100000, positions: {}, history: [], lastBuyTime: {}, watchlist: [] };
        }

        return {
            id: data.id,
            account_code: data.account_code,
            user_name: data.user_name,
            user_email: data.user_email,
            passcode: data.passcode,
            password_hash: data.password_hash,
            portfolio: portfolio,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    },

    // Get account by email and passcode (for login)
    getAccountByEmailAndPasscode(email, passcode) {
        if (!db) throw new Error('Database not initialized');

        const result = db.exec(
            'SELECT * FROM personal_accounts WHERE user_email = ? AND passcode = ?',
            [email, passcode]
        );

        const data = extractRowData(result);
        if (!data) return null;

        // Parse portfolio with error handling
        let portfolio;
        try {
            portfolio = typeof data.portfolio === 'string'
                ? JSON.parse(data.portfolio)
                : data.portfolio;
        } catch (e) {
            console.error('Error parsing portfolio for email:', email, e);
            portfolio = { cash: 100000, positions: {}, history: [], lastBuyTime: {}, watchlist: [] };
        }

        return {
            id: data.id,
            account_code: data.account_code,
            user_name: data.user_name,
            user_email: data.user_email,
            passcode: data.passcode,
            password_hash: data.password_hash,
            portfolio: portfolio,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    },

    // Get account by email (for password login)
    getAccountByEmail(email) {
        if (!db) throw new Error('Database not initialized');

        const result = db.exec(
            'SELECT * FROM personal_accounts WHERE user_email = ?',
            [email]
        );

        const data = extractRowData(result);
        if (!data) return null;

        // Parse portfolio with error handling
        let portfolio;
        try {
            const portfolioData = data.portfolio;
            if (typeof portfolioData === 'string') {
                portfolio = JSON.parse(portfolioData);
            } else if (portfolioData && typeof portfolioData === 'object') {
                portfolio = portfolioData;
            } else {
                portfolio = { cash: 100000, positions: {}, history: [], lastBuyTime: {}, watchlist: [] };
            }
        } catch (e) {
            console.error('Error parsing portfolio for email:', email, e);
            portfolio = { cash: 100000, positions: {}, history: [], lastBuyTime: {}, watchlist: [] };
        }

        return {
            id: data.id,
            account_code: data.account_code,
            user_name: data.user_name,
            user_email: data.user_email,
            passcode: data.passcode,
            password_hash: data.password_hash,
            portfolio: portfolio,
            created_at: data.created_at,
            updated_at: data.updated_at
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
    },

    // Reset code functions
    createResetCode(email, codeHash, expiresAt) {
        if (!db) throw new Error('Database not initialized');

        // Clean up old codes for this email
        db.run('DELETE FROM reset_codes WHERE user_email = ? AND expires_at < ?',
            [email, new Date().toISOString()]);

        // Limit active codes per user to 3
        const countResult = db.exec('SELECT COUNT(*) as count FROM reset_codes WHERE user_email = ?', [email]);
        const count = countResult[0]?.values[0]?.[0] || 0;
        if (count >= 3) {
            db.run('DELETE FROM reset_codes WHERE user_email = ?', [email]);
        }

        const now = new Date().toISOString();
        db.run(
            'INSERT INTO reset_codes (user_email, code_hash, expires_at, attempts, created_at) VALUES (?, ?, ?, 0, ?)',
            [email, codeHash, expiresAt, now]
        );

        saveDatabase();
        console.log('✅ Reset code created for:', email);
    },

    getResetCode(email) {
        if (!db) throw new Error('Database not initialized');

        const result = db.exec(
            'SELECT * FROM reset_codes WHERE user_email = ? ORDER BY created_at DESC LIMIT 1',
            [email]
        );

        if (result.length === 0 || result[0].values.length === 0) {
            return null;
        }

        const row = result[0].values[0];
        return {
            id: row[0],
            user_email: row[1],
            code_hash: row[2],
            expires_at: row[3],
            attempts: row[4],
            created_at: row[5]
        };
    },

    incrementResetAttempts(id) {
        if (!db) throw new Error('Database not initialized');

        db.run('UPDATE reset_codes SET attempts = attempts + 1 WHERE id = ?', [id]);
        saveDatabase();
    },

    deleteResetCode(id) {
        if (!db) throw new Error('Database not initialized');

        db.run('DELETE FROM reset_codes WHERE id = ?', [id]);
        saveDatabase();
    },

    updatePasscode(email, newPasscode) {
        if (!db) throw new Error('Database not initialized');

        const now = new Date().toISOString();
        db.run(
            'UPDATE personal_accounts SET passcode = ?, updated_at = ? WHERE user_email = ?',
            [newPasscode, now, email]
        );

        saveDatabase();
        console.log('✅ Passcode updated for:', email);
        return true;
    }
};
