import { 
  Hex, Cuboid, Axial, Cartesian, Offset, 
  isCartesian, isCuboid, isAxial,
  PointyDirection, FlatDirection
} from '../hex';

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

  describe('coordinates', () => {
    it('are stored as cuboid', () => {
      const cuboid: Cuboid = { q: 5, r: 3, s: -5 - 3 };
      const hex = new Hex(cuboid);
      expect(hex.coordinates).toStrictEqual(cuboid);
    });

    it('are frozen', () => {
      const hex = new Hex({ q: 0, r: 0 });
      expect(Object.isFrozen(hex.coordinates)).toBeTruthy();
      expect(() => {
        hex.coordinates.q = 5;
      }).toThrow();
    });
  });

  describe('symbol', () => {
    it('identifies the hex', () => {
      const hex = new Hex({ q: 0, r: 1 });
      expect(hex.symbol).toStrictEqual(Symbol.for('hex(0,1,-1)'));
    });

    it('is equal for hexes at the same coordinates', () => {
      const hex1 = new Hex({ q: 0, r: 0 });
      const hex2 = new Hex({ q: 0, r: 0 });
      expect(hex1).not.toBe(hex2);
      expect(hex1.symbol).toEqual(hex2.symbol);
    });

    it('is different for hexes at different coordinates', () => {
      const hex1 = new Hex({ q: 0, r: 0 });
      const hex2 = new Hex({ q: 1, r: 1 });
      expect(hex1.symbol).not.toEqual(hex2.symbol);
    });
  });

  describe('add', () => {
    it('returns a new Hex', () => {
      const hex1 = new Hex({ q: 1, r: -1 });
      const hex2 = new Hex({ q: 1, r: -1 });
      expect(hex1.add(hex2)).not.toBe(hex1);
    });

    it('adds the coordinates piecewise', () => {
      const hex = new Hex({ q: 1, r: -1 });
      const result = new Hex({ q: 2, r: -2 });
      expect(hex.add(hex)).toStrictEqual(result);
    });

    it('copies the callers value', () => {
      const hex1 = new Hex<number>({ q: 1, r: -1 }, 10);
      const hex2 = new Hex<number>({ q: 0, r: 5 }, 5);
      expect(hex1.add(hex2).value).toBe(10);
    });

    it('adds hexes regardless of generic type', () => {
      const hex1 = new Hex({ q: 1, r: 0 });
      const hex2 = new Hex<number>({ q: 1, r: 0 });
      const result = new Hex({ q: 2, r: 0 });
      expect(hex1.add(hex2)).toStrictEqual(result);
    })
  });

  describe('subtract', () => {
    it('returns a new Hex', () => {
      const hex1 = new Hex({ q: 1, r: -1 });
      const hex2 = new Hex({ q: 1, r: -1 });
      expect(hex1.subtract(hex2)).not.toBe(hex1);
    });

    // NOTE: this particular calculation results in an
    // s-coordinate of -0, which is not make +0 by Hex.
    it('subtracts the coordinates piecewise', () => {
      const hex = new Hex({ q: 1, r: -1 });
      const result = new Hex({ q: 0, r: 0, s: 0 });
      expect(hex.subtract(hex)).toEqual(result);
    });

    it('copies the callers value', () => {
      const hex1 = new Hex<number>({ q: 1, r: -1 }, 10);
      const hex2 = new Hex<number>({ q: 0, r: 5 }, 5);
      expect(hex1.subtract(hex2).value).toBe(10);
    });
  });

  describe('multiply', () => {
    it('returns a new Hex', () => {
      const hex1 = new Hex({ q: 1, r: -1 });
      expect(hex1.multiply(10)).not.toBe(hex1);
    });

    it('adds the coordinates piecewise', () => {
      const hex = new Hex({ q: 1, r: -1 });
      const result = new Hex({ q: 10, r: -10 });
      expect(hex.multiply(10)).toStrictEqual(result);
    });

    it('copies the callers value', () => {
      const hex = new Hex<number>({ q: 1, r: -1 }, 10);
      expect(hex.multiply(10).value).toBe(10);
    });
  });

  describe('length', () => {
    it('returns the vector length of the coordinates', () => {
      const hex = new Hex({ q: 1, r: 1 });
      expect(hex.length()).toBe(2);
    });
  });

  describe('distanceTo', () => {
    it('returns the vector length to the passed hex', () => {
      const hex1 = new Hex({ q: 1, r: 1 });
      const hex2 = new Hex({ q: -1, r: -1 });
      expect(hex1.distanceTo(hex2)).toBe(4);
    });

    it('returns the same value in either direction', () => {
      const hex1 = new Hex({ q: 1, r: 1 });
      const hex2 = new Hex({ q: -1, r: -1 });
      expect(hex1.distanceTo(hex2)).toEqual(hex2.distanceTo(hex1));
    });
  });

  describe('neighbor', () => {
    it('returns the appropriate hex, in a pointy direction', () => {
      const hex = new Hex({ q: 0, r: 0 });
      const E = new Hex({ q: 1, r: 0 });
      const W = new Hex({ q: -1, r: 0 });
      expect(hex.neighbor(PointyDirection.E)).toStrictEqual(E);
      expect(hex.neighbor(PointyDirection.W)).toStrictEqual(W);
    });

    it('returns the appropriate hex, in a pointy direction', () => {
      const hex = new Hex({ q: 0, r: 0 });
      const N = new Hex({ q: 0, r: -1 });
      const S = new Hex({ q: 0, r: 1 });
      expect(hex.neighbor(FlatDirection.N)).toStrictEqual(N);
      expect(hex.neighbor(FlatDirection.S)).toStrictEqual(S);
    });
  });
});
