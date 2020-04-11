import { Orientation } from './orientation';
import { Point } from './point';
import { Hex } from './hex';

export class Layout {
  orientation: Orientation;
  size: Point;
  origin: Point;

  constructor(orientation: Orientation, size: Point, origin: Point) {
    this.orientation = orientation;
    this.size = size;
    this.origin = origin;
  }

  hexToPixel<T>( h: Hex<T> ): Point {
    const f = this.orientation.f;
    const { q, r } = h.coordinates;
    const x = (f[0] * q + f[1] * r) * this.size.x;
    const y = (f[2] * q + f[3] * r) * this.size.y;
    return new Point( x + this.origin.x, y + this.origin.y );
  }

  pixelToHex<T>( p: Point ): Hex<T> {
    const b = this.orientation.b;
    const pt = new Point( 
      (p.x - this.origin.x) / this.size.x,
      (p.y - this.origin.y) / this.size.y
    );
    const q = b[0] * pt.x + b[1] * pt.y;
    const r = b[2] * pt.x + b[3] * pt.y;
    return new Hex<T>({ q, r });
  }
}