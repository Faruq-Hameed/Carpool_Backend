import { add } from '../math';

describe('Math functions', () => {
  it('should add two numbers correctly', () => {
    expect(add(1, 2)).toEqual(3);
  });
});
