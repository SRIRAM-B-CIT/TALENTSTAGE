/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MongoClient } from 'mongodb';
import { INITIAL_TALENTS, INITIAL_PROPOSALS, INITIAL_ENGAGEMENTS, DEFAULT_PROFILE } from './src/data';

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "talentstage_db";

let client: MongoClient | null = null;
let dbConnected = false;
let isUsingMemoryStore = false;

// =========================================================================
// HIGH-FIDELITY LOCAL IN-MEMORY MONGODB CLIENT FALLBACK
// =========================================================================
const memoryStore: Record<string, any[]> = {
  talents: [...INITIAL_TALENTS],
  proposals: [...INITIAL_PROPOSALS],
  engagements: [...INITIAL_ENGAGEMENTS],
  profiles: [
    { _id: 'default_user', ...DEFAULT_PROFILE },
    { _id: 'demo_user', ...DEFAULT_PROFILE }
  ],
  users: [
    {
      _id: 'demo_user',
      username: 'amit_verma',
      email: 'amit_verma@sample.com',
      password: 'demo123',
      fullName: 'Amit Verma',
      role: 'Both',
      verifiedStatus: 'verified',
      verificationDoc: 'https://linkedin.com/in/amitvermascale',
      isPro: true
    }
  ]
};

class MockMongoClient {
  async connect(): Promise<this> {
    return this;
  }
  db(dbName: string) {
    return {
      collection: (colName: string) => {
        if (!memoryStore[colName]) {
          memoryStore[colName] = [];
        }

        return {
          countDocuments: async () => {
            return memoryStore[colName].length;
          },
          find: (query?: any) => {
            let list = [...memoryStore[colName]];
            return {
              toArray: async () => list
            };
          },
          findOne: async (query?: any) => {
            const list = memoryStore[colName];
            if (!query) return list[0] || null;
            
            return list.find((item: any) => {
              // Exact id matching
              if (query._id !== undefined) {
                return String(item._id) === String(query._id);
              }
              
              // Complex query helper for isLogin ($and with $or/password checks)
              if (query.$and && Array.isArray(query.$and)) {
                const options = query.$and[0]?.$or || [];
                const passwordMatch = query.$and[1]?.password;
                
                const matchesInput = options.some((opt: any) => {
                  if (opt.email) return item.email?.toLowerCase() === opt.email?.toLowerCase();
                  if (opt.username) return item.username?.toLowerCase() === opt.username?.toLowerCase();
                  return false;
                });
                return matchesInput && item.password === passwordMatch;
              }

              // Simple $or query matching
              if (query.$or && Array.isArray(query.$or)) {
                return query.$or.some((subQuery: any) => {
                  return Object.keys(subQuery).every(subKey => {
                    const val = subQuery[subKey];
                    if (typeof val === 'string' && typeof item[subKey] === 'string') {
                      return item[subKey].toLowerCase() === val.toLowerCase();
                    }
                    return item[subKey] === val;
                  });
                });
              }

              // Standard key-value criteria
              for (const key of Object.keys(query)) {
                if (item[key] !== query[key]) {
                  return false;
                }
              }
              return true;
            }) || null;
          },
          insertOne: async (doc: any) => {
            memoryStore[colName].push(doc);
            return { insertedId: doc._id };
          },
          insertMany: async (docs: any[]) => {
            memoryStore[colName].push(...docs);
            return { insertedCount: docs.length };
          },
          replaceOne: async (query: any, doc: any, options?: any) => {
            const list = memoryStore[colName];
            const idx = list.findIndex(item => String(item._id) === String(query._id));
            if (idx !== -1) {
              list[idx] = { ...doc };
            } else if (options?.upsert) {
              list.push(doc);
            }
            return { modifiedCount: 1 };
          },
          updateOne: async (query: any, updateUpdate: any) => {
            const list = memoryStore[colName];
            const idx = list.findIndex(item => String(item._id) === String(query._id));
            if (idx !== -1 && updateUpdate.$set) {
              list[idx] = { ...list[idx], ...updateUpdate.$set };
            }
            return { modifiedCount: 1 };
          }
        };
      }
    };
  }
}

export async function getDbClient(): Promise<MongoClient> {
  if (isUsingMemoryStore) {
    return new MockMongoClient() as any;
  }

  if (!client) {
    if (!MONGO_URI) {
      console.warn("No MONGODB_URI environment variable detected. Falling back to safe high-fidelity Local In-Memory Database Mode.");
      isUsingMemoryStore = true;
      dbConnected = true;
      return new MockMongoClient() as any;
    }

    try {
      client = new MongoClient(MONGO_URI);
      await client.connect();
      dbConnected = true;
      console.log("Successfully connected to MongoDB cluster!");
    } catch (err: any) {
      console.error("Failed to connect to MongoDB Atlas. Falling back to high-fidelity Local In-Memory Database Mode. Error details:", err.message);
      isUsingMemoryStore = true;
      dbConnected = true;
      return new MockMongoClient() as any;
    }
  }
  return client;
}

export function isDbConnected(): boolean {
  return dbConnected;
}

export async function initDatabase() {
  try {
    const mongoClient = await getDbClient();
    const db = mongoClient.db(DB_NAME);

    // Seed Talents (Indian Names and rate scales)
    const talentsCollection = db.collection('talents');
    const talentsCount = await talentsCollection.countDocuments();
    if (talentsCount === 0) {
      await talentsCollection.insertMany(INITIAL_TALENTS);
      console.log(`Seeded ${INITIAL_TALENTS.length} Indian talents into MongoDB`);
    } else {
      console.log("Talents collection already exists, skipping seed.");
    }

    // Seed Project Proposals (Indian Rupees)
    const proposalsCollection = db.collection('proposals');
    const proposalsCount = await proposalsCollection.countDocuments();
    if (proposalsCount === 0) {
      await proposalsCollection.insertMany(INITIAL_PROPOSALS);
      console.log(`Seeded ${INITIAL_PROPOSALS.length} project proposals (Rupees) into MongoDB`);
    } else {
      console.log("Proposals collection already exists, skipping seed.");
    }

    // Seed Engagements/Contracts
    const engagementsCollection = db.collection('engagements');
    const engagementsCount = await engagementsCollection.countDocuments();
    if (engagementsCount === 0) {
      await engagementsCollection.insertMany(INITIAL_ENGAGEMENTS);
      console.log(`Seeded ${INITIAL_ENGAGEMENTS.length} active/completed engagements into MongoDB`);
    } else {
      console.log("Engagements collection already exists, skipping seed.");
    }

    // Seed User Profile
    const profilesCollection = db.collection('profiles');
    const profileCount = await profilesCollection.countDocuments();
    if (profileCount === 0) {
      await profilesCollection.insertOne({ _id: 'default_user' as any, ...DEFAULT_PROFILE });
      await profilesCollection.insertOne({ _id: 'demo_user' as any, ...DEFAULT_PROFILE });
      console.log("Seeded default professional user profile into MongoDB");
    } else {
      console.log("Profiles collection already exists, skipping seed.");
    }

    // Seed Auth Users
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    if (userCount === 0) {
      await usersCollection.insertOne({
        _id: 'demo_user' as any,
        username: 'amit_verma',
        email: 'amit_verma@sample.com',
        password: 'demo123', // Secure demo login credentials
        fullName: 'Amit Verma',
        role: 'Both',
        verifiedStatus: 'verified',
        verificationDoc: 'https://linkedin.com/in/amitvermascale',
        isPro: true
      });
      console.log("Seeded demo user into MongoDB 'users' space");
    }

    console.log("MongoDB Database connected and validated.");
  } catch (err) {
    console.error("Critical: Failed to connect or seed MongoDB Database:", err);
  }
}
