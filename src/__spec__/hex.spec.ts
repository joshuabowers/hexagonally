import { Hex, Cuboid, Axial, Cartesian, Offset, isCartesian, isCuboid, isAxial } from '../hex';

describe(isCuboid, () => {
  it('returns false for cartesian coordinates', () => {
    const cartesian: Cartesian = { row: 0, col: 0, offset: Offset.even };
    expect(isCuboid(cartesian)).toBeFalsy();
  });

  it('returns true for cuboid coordinates', () => {
    const cuboid: Cuboid = { q: 1, r: 0, s: -1 };
    expect(isCuboid(cuboid)).toBeTruthy();
  });

  it('returns false for axial coordinates', () => {
    const axial: Axial = { q: 1, r: 0 };
    expect(isCuboid(axial)).toBeFalsy();
  });
});

describe(isAxial, () => {
  it('returns false for cartesian coordinates', () => {
    const cartesian: Cartesian = { row: 0, col: 0, offset: Offset.even };
    expect(isAxial(cartesian)).toBeFalsy();
  });

  it('returns false for cuboid coordinates', () => {
    const cuboid: Cuboid = { q: 1, r: 0, s: -1 };
    expect(isAxial(cuboid)).toBeFalsy();
  });

  it('returns true for axial coordinates', () => {
    const axial: Axial = { q: 1, r: 0 };
    expect(isAxial(axial)).toBeTruthy();
  });
});

describe(isCartesian, () => {
  it('returns true for cartesian coordinates', () => {
    const cartesian: Cartesian = { row: 0, col: 0, offset: Offset.even };
    expect(isCartesian(cartesian)).toBeTruthy();
  });

  it('returns false for cuboid coordinates', () => {
    const cuboid: Cuboid = { q: 1, r: 0, s: -1 };
    expect(isCartesian(cuboid)).toBeFalsy();
  });

  it('returns false for axial coordinates', () => {
    const axial: Axial = { q: 1, r: 0 };
    expect(isCartesian(axial)).toBeFalsy();
  });
});

describe(Hex, () => {
  describe('constructor', () => {
    it('accepts cuboid coordinates', () => {
      const cuboid: Cuboid = { q: 1, r: 0, s: -1 };
      expect(() => {
        const hex = new Hex(cuboid);
      }).not.toThrow();
    });

    it('accepts axial coordinates', () => {
      const axial: Axial = { q: 1, r: 0 };
      expect(() => {
        const hex = new Hex(axial);
      }).not.toThrow();
    });

    it('accepts cartesian coordinates', () => {
      const cartesian: Cartesian = { row: 0, col: 0, offset: Offset.even };
      expect(() => {
        const hex = new Hex(cartesian);
      }).not.toThrow();
    });

    it('stores cuboid coordinates', () => {
      const cuboid: Cuboid = { q: 5, r: 3, s: -5 - 3 };
      const hex = new Hex(cuboid);
      expect(hex.coordinates).toStrictEqual(cuboid);
    });

    it('throws if cuboid coordinates do not zero sum', () => {
      const cuboid: Cuboid = { q: 5, r: 3, s: 0 };
      expect(() => {
        const hex = new Hex(cuboid);
      }).toThrow(RangeError);
    });

    it('calculates Cuboid.s for Axial coordinates', () => {
      const axial: Axial = { q: 5, r: 3 };
      const hex = new Hex(axial);
      expect(hex.coordinates.s).toBe(-5 - 3);
    });

    it('converts cartesian coordinates to cuboid', () => {
      const cartesian: Cartesian = { row: 0, col: 1, offset: Offset.even };
      const correct = { q: 1, r: -1, s: 0 };
      const hex = new Hex(cartesian);
      expect(hex.coordinates).toStrictEqual(correct);
    });

    it('stores the passed value', () => {
      type Cell = { name: string; color: number };
      const cell: Cell = { name: 'water', color: 0x2277aa };
      const hex = new Hex<Cell>({ q: 0, r: 0 }, cell);
      expect(hex.value).toStrictEqual(cell);
    });
  });
});
