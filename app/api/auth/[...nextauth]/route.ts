/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { handlers } from "../../../../lib/auth";

// Export standard API route handler wrappers for GET and POST requests in Next.js 16 App Router
export const { GET, POST } = handlers;
