import { afterEach, describe, expect, it, vi } from 'vitest';

const { pino } = vi.hoisted(() => ({
  pino: vi.fn(() => ({ child: vi.fn(() => ({})) })),
}));

vi.mock('pino', () => ({ default: pino }));

describe('logger', () => {
  afterEach(() => {
    vi.resetModules();
    pino.mockClear();
    delete process.env.NODE_ENV;
  });

  it('only enables pino-pretty explicitly in development', async () => {
    await import('../../lib/logger.js');
    expect(pino).toHaveBeenLastCalledWith(expect.not.objectContaining({ transport: expect.anything() }));

    vi.resetModules();
    process.env.NODE_ENV = 'development';
    await import('../../lib/logger.js');
    expect(pino).toHaveBeenLastCalledWith(expect.objectContaining({
      transport: expect.objectContaining({ target: 'pino-pretty' }),
    }));
  });
});
