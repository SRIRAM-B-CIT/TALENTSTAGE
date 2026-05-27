/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import app from '../server';
import { initDatabase } from '../mongodb-client';

// Eagerly initialize and seed database on serverless cold starts
initDatabase().catch(err => {
  console.warn("Eager database initialization failed/resilient fallback active:", err);
});

export default app;
