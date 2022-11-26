class PerlinNoise2D {
  seed          = null
  permutations  = []





  constructor(seed) {
    // Generate random seed if seed not specified
    this.seed = seed || Math.floor(Math.random() * 10e6)
    this.generatePermutations()
  }





  /**
   * Generate an array of random number from 0 - 255
   */
  generatePermutations() {
    // Fill the array
    for (let i=0; i<256; i++) {
      this.permutations[i] = i
    }

    // Shuffle the array
    for (let i=0; i<256; i++) {
      const random_index = this.getRandomNumber() % 256     // Get random number from 0 to 255
      const temp         = this.permutations[random_index]

      this.permutations[random_index] = this.permutations[i]
      this.permutations[i]            = temp
    }

    // To avoid index wrapping we need to double the array.
    for (let i=0; i<256; i++) {
      this.permutations[256+i] = this.permutations[i]
    }
  }





  /**
   * A seedable random number generator based on ZX81
   * 
   * Reference = https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
   * 
   * @returns a random number
   */
  getRandomNumber() {
    // this.seed = (this.seed * 1103515245 + 12345) % 0x80000000
    this.seed = (this.seed * 75 + 74) % 65537
    return this.seed
  }





  /**
   * Get a noise intensity in a specific (x, y) coordinate
   * 
   * @param {float} x - The x coordinate
   * @param {float} y - The y coordinate
   * @returns the intensity of the noise (A float between -1 and 1)
   */
  evaluateNoise(x, y, frequency = 20) {
    x /= frequency
    y /= frequency

    let X = Math.floor(x) & 255
    let Y = Math.floor(y) & 255

    x -= Math.floor(x)
    y -= Math.floor(y)

    let u = this.fade(x)
    let v = this.fade(y)

    let A = this.permutations[X    ] + Y, AA = this.permutations[A], AB = this.permutations[A + 1]
    let B = this.permutations[X + 1] + Y, BA = this.permutations[B], BB = this.permutations[B + 1]

    return this.lerp(
      v,
      this.lerp(u, this.grad(AA, x, y  ), this.grad(BA, x-1, y  )),
      this.lerp(u, this.grad(AB, x, y-1), this.grad(BB, x-1, y-1))
    )
  }




  /**
   * Smooth the relative coordinate inside the perlin grd
   *  
   * @param {float} t - A coordinate (x/y) inside a perlin grid
   * @returns the eased version of that coordinate
   */
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }





  /**
   * Calculate the linear interpolation between two value
   * 
   * @param {float} t - The alpha
   * @param {float} a - The first number
   * @param {float} b - The second number
   * @returns a interpolated value between a and b
   */
  lerp(t, a, b) {
    return (1-t)*a + t*b
  }




  /**
   * Calculate the dot product a specific point inside the specific perlin grid
   * 
   * @param {int} hash - An int (hash value) based on the permutations table
   * @param {float} x - The relative x coordinate inside the perlin grid
   * @param {float} y - The relative y coordinate inside the perlin grid
   * @return the dot product of that specific x and y
   */
  grad(hash, x, y) {
    return ((hash & 1) ? x : -x) + ((hash & 2) ? y : -y)
  }






  /**
   * A function to calculate the Fractal Brownian Motion
   * 
   * Reference = https://gamedev.stackexchange.com/questions/197861/how-to-handle-octave-frequency-in-the-perlin-noise-algorithm
   * 
   * @param {int} x - The x coordinate
   * @param {int} y - The y coordinate
   * @param {int} amplitude - A value to control the solidity of the noise
   * @param {float} frequency - A value to control the scale of the noise
   * @param {int} octave - How many layer the noise should be stacked
   * @param {float} persistence - A value to control how quick a later octave fade
   * @param {int} lacunarity - A value greater than 1 to control how much finer a scale of each octaves
   * @returns the noise intensity
   */
  evaluateFBM(
    x,
    y,
    amplitude   = 1,
    frequency   = 1,
    octave      = 5,
    persistence = 0.5,
    lacunarity  = 2
  ) {
    let value = 0

    for (let i=0; i<octave; i++) {
      value     += amplitude * this.evaluateNoise(x * frequency, y*frequency)
      amplitude *= persistence
      frequency *= lacunarity
    }

    return value 
  }
}