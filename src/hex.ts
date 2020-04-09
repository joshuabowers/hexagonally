export enum Offset {
  even  = +1,
  odd   = -1
}

export type Point = { x: number, y: number };

export type Cuboid = { q: number, r: number, s: number };
export type Axial = { q: number, r: number };
export type Cartesian = { col: number, row: number, offset: Offset };

export type Coordinates = Cuboid | Axial | Cartesian;
export function isCuboid( x: Coordinates ): x is Cuboid {

  return "s" in x;
}

export function isAxial( x: Coordinates ): x is Axial {
  return !("s" in x);
}

export function isCartesian( x: Coordinates ): x is Cartesian {
  return "col" in x;
}

/**
 * Represents hexagons within a hexagonal grid.
 * @template TValue user defined extra information stored in each Hex.
 */
export class Hex<TValue> {
  coordinates: Cuboid;
  value: TValue;

  constructor( coordinates: Coordinates, value: TValue ){
    this.coordinates = Hex.detectCoordinates( coordinates );
    this.value = value;
  }

  toPoint(): Point {
    return {
      x: 0,
      y: 0
    }
  }

  private static detectCoordinates( coordinates: Coordinates ): Cuboid {
    if( isAxial( coordinates ) ){
      return Hex.fromAxial( coordinates );
    } else if( isCartesian( coordinates ) ){
      return Hex.fromCartesian( coordinates );
    } else {
      return coordinates;
    }
  }

  private static fromAxial( coordinates: Axial ): Cuboid {
    return {
      q: coordinates.q,
      r: coordinates.r,
      s: -coordinates.q - coordinates.r
    }
  }

  private static fromCartesian( coordinates: Cartesian ): Cuboid {
    return Hex.fromAxial({
      q: coordinates.col,
      r: coordinates.row - (coordinates.col + coordinates.offset * (coordinates.col & 1)) / 2
    });
  }
}