-- Create the "parkings" table
CREATE TABLE parkings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo TEXT,
    name TEXT NOT NULL,
    commune TEXT NOT NULL,
    description TEXT,
    slotPrice DECIMAL(10, 2) NOT NULL,
    numSlots INTEGER NOT NULL,
    latitude DECIMAL(9, 6),  
    longitude DECIMAL(9, 6)
);

-- Create the "users" table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    firstName TEXT,
    lastName TEXT,
    phone TEXT
);

-- Create the "reservations" table
CREATE TABLE reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    parkingId INTEGER NOT NULL,
    date DATE NOT NULL,
    entryTime TIME NOT NULL,
    exitTime TIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (parkingId) REFERENCES parkings(id)
);