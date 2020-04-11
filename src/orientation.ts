type Mat2 = [number, number, number, number];
const sqrt = Math.sqrt;

export class Orientation {
  f: Mat2;
  b: Mat2;
  startAngle: number;

  private constructor(f: Mat2, b: Mat2, startAngle: number) {
    this.f = f;
    this.b = b;
    this.startAngle = startAngle
  }

  /** An orientation with hexagons rotated so a vertex is up */
  static pointy = new Orientation(
    [sqrt(3.0), sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0],
    [sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0],
    0.5
  )

  /** An orientation with hexagons rotated so an edge is up */
  static flat = new Orientation(
    [3.0 / 2.0, 0.0, sqrt(3.0) / 2.0, sqrt(3.0)],
    [2.0/ 3.0, 0.0, -1.0 / 3.0, sqrt(3.0) / 3.0],
    0.0
  )
}
