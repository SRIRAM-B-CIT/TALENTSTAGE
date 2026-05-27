/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MongoClient } from 'mongodb';
import { INITIAL_TALENTS, INITIAL_PROPOSALS, INITIAL_ENGAGEMENTS, DEFAULT_PROFILE } from './src/data';

const MONGO_URI = "mongodb+srv://sriram23229_db_user:26G0P1F0XpUBLJ1C@cluster0.wjxutts.mongodb.net/?appName=Cluster0";
const DB_NAME = "talentstage_db";

let client: MongoClient | null = null;
let dbConnected = false;

export async function getDbClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    dbConnected = true;
    console.log("Successfully connected to MongoDB cluster!");
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
      console.log("Seeded default professional user profile into MongoDB");
    } else {
      console.log("Profiles collection already exists, skipping seed.");
    }

    console.log("MongoDB Database connected and validated.");
  } catch (err) {
    console.error("Critical: Failed to connect or seed MongoDB Database:", err);
  }
}
