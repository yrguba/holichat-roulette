import { getRandomCode } from './random-code';

describe('getRandomCode', () => {
  it("returns true when given 'true'", () => {
    const result = getRandomCode();
    expect(result.toString().length === 4).toBe(true);
  });
});
