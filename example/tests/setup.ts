import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";

import getPetFindByStatus from '../mocks/get-pet-findByStatus-200.json';

export const handlers = [
  rest.get("http://localhost:4010/pet/findByStatus", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(getPetFindByStatus));
  }),
];

const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
