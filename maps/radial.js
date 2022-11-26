class RadialGradient {
  
  constructor(w, h, radius) {
    this.w = w
    this.h = h
    this.radius = radius
  }

  lerp(t, a, b) {return (1-t)*a + b*t}

  evaluate(x, y) {
    // Get the distance to center
    let a         = Math.abs(x - ((this.w-1)/2))
    let b         = Math.abs(y - ((this.h-1)/2))
    let distance  = Math.sqrt(a**2+b**2)

    let value;
    if (distance < this.radius) {
      value = distance/this.radius
      value = this.lerp(value, -1, 1)
    } else {
      value = 1
    }

    return -value
  }

}