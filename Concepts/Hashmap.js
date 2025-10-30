// 1️⃣ What is a HashMap (in general programming terms)?
// A HashMap is a data structure that stores key-value pairs using a hashing function to decide where each key-value pair lives in memory.

// Key → hashed (turned into a number using a hash function)
// That number decides where in the underlying array/bucket the value is stored.
// Hashing makes lookups, insertions, and deletions super fast (O(1) average case).
// Think of it like a locker system:
// The key you give gets converted into a locker number (hash).
// You just go to that locker and retrieve your stuff—no searching through all lockers.

// 2️⃣ How it works (the theory)

// You provide a key.
// A hash function turns the key into a hash code (a number).
// That hash code points to a specific bucket (slot in memory).
// The value is stored in that bucket.
// To get a value, you hash the key again and jump straight to the bucket.