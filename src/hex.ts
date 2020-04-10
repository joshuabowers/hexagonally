export enum Offset {
  even = +1,
  odd = -1,
}

export type Point = { x: number; y: number };

export type Cuboid = { q: number; r: number; s: number };
export type Axial = { q: number; r: number };
export type Cartesian = { col: number; row: number; offset: Offset };
export type Coordinates = Cuboid | Axial | Cartesian;

export function isCuboid(x: Coordinates): x is Cuboid {
  return 's' in x;
}

export function isCartesian(x: Coordinates): x is Cartesian {
  return 'row' in x && 'col' in x && 'offset' in x;
}

export function isAxial(x: Coordinates): x is Axial {
  return !isCuboid(x) && !isCartesian(x);
}

/**
 * Represents hexagons within a hexagonal grid.
 * @template TValue user defined extra information stored in each Hex.
 */
export class Hex<TValue> {
  readonly coordinates: Cuboid;
  value: TValue | undefined;
  readonly symbol: symbol;

  constructor(coordinates: Coordinates, value?: TValue) {
    this.coordinates = Hex.detectCoordinates(coordinates);
    this.value = value;
    this.validate();
    Object.freeze(this.coordinates);
    this.symbol = Symbol.for(this.computeSymbolKey());
  }

  add(b: Hex<TValue>): Hex<TValue> {
    const { q, r, s } = this.coordinates;
    return new Hex({ 
      q: q + b.coordinates.q, 
      r: r + b.coordinates.r, 
      s: s + b.coordinates.s 
    }, this.value);
  }

  subtract(b: Hex<TValue>): Hex<TValue> {
    const { q, r, s } = this.coordinates;
    return new Hex({ 
      q: q - b.coordinates.q, 
      r: r - b.coordinates.r, 
      s: s - b.coordinates.s 
    }, this.value);
  }

  multiply(k: number): Hex<TValue> {
    const { q, r, s } = this.coordinates;
    return new Hex({ q: q * k, r: r * k, s: s * k }, this.value);
  }

  length(): number {
    const { q, r, s } = this.coordinates;
    const abs = Math.abs;
    return (abs(q) + abs(r) + abs(s)) / 2;
  }

  distanceTo(b: Hex<TValue>): number {
    return this.subtract(b).length();
  }

  toPoint(): Point {
    return {
      x: 0,
      y: 0,
    };
  }

  private static detectCoordinates(coordinates: Coordinates): Cuboid {
    if (isAxial(coordinates)) {
      return Hex.fromAxial(coordinates);
    } else if (isCartesian(coordinates)) {
      return Hex.fromCartesian(coordinates);
    } else {
      return coordinates;
    }
  }

  private static fromAxial(coordinates: Axial): Cuboid {
    return {
      q: coordinates.q,
      r: coordinates.r,
      s: -coordinates.q - coordinates.r,
    };
  }

  private static fromCartesian(coordinates: Cartesian): Cuboid {
    const { row, col, offset } = coordinates;
    return Hex.fromAxial({
      q: col,
      r: row - (col + offset * (col & 1)) / 2,
    });
  }

  private validate() {
    const { q, r, s } = this.coordinates;
    if (q + r + s !== 0) {
      throw new RangeError(`Hex(${q}, ${r}, ${s}) invalid: does not zero-sum`);
    }
  }

  private computeSymbolKey() {
    const { q, r, s } = this.coordinates;
    return `hex(${q},${r},${s})`;
  }
}
