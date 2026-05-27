/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import app from '../server';
import { initDatabase } from '../mongodb-client';

// Lazy init the DB connection under Vercel serverless functions
let isDbReady = false;
app.use(async (req, res, next) => {
  if (!isDbReady) {
    try {
      await initDatabase();
      isDbReady = true;
    } catch (err) {
      console.error("Failed serverless database initial connection:", err);
    }
  }
  next();
});

export default app;
