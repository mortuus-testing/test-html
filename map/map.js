class MapFactory {

  constructor(canvas) {
    this.canvas   = canvas
    this.context  = canvas.getContext('2d')
    this.canvasW  = canvas.offsetWidth
    this.canvasH  = canvas.offsetHeight

    this.canvas.width   = this.canvasW
    this.canvas.height  = this.canvasH

    this.imageData = this.context.getImageData(0, 0, this.canvasW, this.canvasH)
    this.pixels    = this.imageData.data
  }

  render(settings) {
    switch (settings.style) {
      case 'biomes':
        this.renderBiomes(settings)
        break
      case 'dune':
        this.renderDune(settings)
        break
      case 'polar':
        this.renderPolar(settings)
        break
    }
  }

  renderBiomes(settings) {
    let perlin_generator_1 = new PerlinNoise2D(settings.seed)
    let perlin_generator_2 = new PerlinNoise2D(settings.seed+1)

    let frequency = settings.frequency
    let persistence = settings.persistence

    for (let i=0; i<this.canvasW; i++) {
      for (let j=0; j<this.canvasH; j++) {
        const index = (this.canvasW * j + i) * 4

        const altitude            = perlin_generator_1.evaluateFBM(i/frequency, j/frequency, 1, 1, 5, persistence)                              // -1 < 1
        const distance_from_ocean = altitude > 0 ? altitude : 0                                           //  0 < 1
        const latitude            = Math.abs(this.canvasH/2 - j) / (this.canvasW/2)                       //  0 < 1
        const temperature         = (distance_from_ocean + (1-latitude)) - 1                              // -1 < 1
        const pricipitation       = (perlin_generator_2.evaluateFBM(i/frequency, j/frequency, 1, 1, 5, persistence) + (-(latitude*2-1))) / 2    // -1 < 1

        let color = [0, 0, 0]

        if      (altitude    < -0.8                        ) {color = [0, 0, 215]}  // Deep Sea
        else if (altitude    < -0.3                        ) {color = [0, 0, 235]}  // Sea
        else if (altitude    < -0.2                        ) {color = [0, 0, 255]}  // Sea
        else if (altitude    <  0   && pricipitation < -0.6) {color = [255, 255, 255]}  // Frozen Sea
        else if (altitude    <  0                          ) {color = [0, 50, 255]}  // Seashore
        else if (temperature < -0.6 && pricipitation < -0.8) {color = [255, 255, 255]} // Polar
        else if (temperature < -0.6 && pricipitation < -0.6) {color = [99, 183, 180]} // Tundra
        else if (temperature < -0.2 && pricipitation <  0  ) {color = [87, 156, 71]} // Boreal Forest
        else if (temperature <  0.2 && pricipitation < -0.6) {color = [209, 179, 0]} // Temperate Grassland / Desert
        else if (temperature <  0.2 && pricipitation < -0.2) {color = [184, 96, 0]} // Woodland
        else if (temperature <  0.2 && pricipitation <  0.2) {color = [121, 214, 100]} // Temperare Seasonal Forest
        else if (temperature <  0.2 && pricipitation <  0.3) {color = [62, 171, 37]} // Temperare Rain Forest
        else if (temperature <  1   && pricipitation < -0.4) {color = [190, 133, 37]} // Subtropical desert
        else if (temperature <  1   && pricipitation <  0.2) {color = [138, 150, 6]} // Tropical seasonal forest / savanna
        else if (temperature <  1   && pricipitation <  1  ) {color = [0, 96, 26]} // Tropical rain forest
        else                                                 {color = [0, 96, 26]}

        this.pixels[index  ] = color[0]
        this.pixels[index+1] = color[1]
        this.pixels[index+2] = color[2]
        this.pixels[index+3] = 255
      }
    }

    this.context.putImageData(this.imageData, 0, 0)
  }
  renderDune() {}
  renderPolar() {}
}