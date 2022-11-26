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
      case 'archipelago':
        this.renderArchipelago(settings)
        break
      case 'desert':
        this.renderDesert(settings)
        break
      case 'polar':
        this.renderPolar(settings)
        break
    }
    // this.renderPolar(settings)
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
        const distance_from_ocean = altitude > 0 ? altitude : 0                                                                                 //  0 < 1
        const latitude            = Math.abs(this.canvasH/2 - j) / (this.canvasW/2)                                                             //  0 < 1
        const temperature         = (distance_from_ocean + (1-latitude)) - 1                                                                    // -1 < 1
        const pricipitation       = (perlin_generator_2.evaluateFBM(i/frequency, j/frequency, 1, 1, 5, persistence) + (-(latitude*2-1))) / 2    // -1 < 1

        let color = [0, 0, 0]

        if      (altitude    < -0.8                        ) {color = [0, 20, 200]}  // Deep Sea
        else if (altitude    < -0.3                        ) {color = [0, 20, 215]}  // Sea
        else if (altitude    < -0.2                        ) {color = [0, 20, 230]}  // Sea
        else if (altitude    <  0   && pricipitation < -0.6) {color = [255, 255, 255]}  // Frozen Sea
        else if (altitude    <  0                          ) {color = [0, 50, 255]}  // Seashore
        else if (temperature < -0.6 && pricipitation < -0.8) {color = [255, 255, 255]} // Polar
        else if (temperature < -0.6 && pricipitation < -0.7) {color = [109, 193, 190]} // Tundra
        else if (temperature < -0.6 && pricipitation < -0.6) {color = [99, 183, 180]} // Tundra
        else if (temperature < -0.2 && pricipitation < -0.5) {color = [137, 206, 121]} // Boreal Forest
        else if (temperature < -0.2 && pricipitation < -0.4) {color = [127, 196, 111]} // Boreal Forest
        else if (temperature < -0.2 && pricipitation < -0.3) {color = [117, 186, 101]} // Boreal Forest
        else if (temperature < -0.2 && pricipitation < -0.2) {color = [107, 176, 91]} // Boreal Forest
        else if (temperature < -0.2 && pricipitation < -0.1) {color = [97, 166, 81]} // Boreal Forest
        else if (temperature < -0.2 && pricipitation <  0  ) {color = [87, 156, 71]} // Boreal Forest
        else if (temperature <  0.2 && pricipitation < -1  ) {color = [249, 219, 0]} // Temperate Grassland / Desert
        else if (temperature <  0.2 && pricipitation < -0.9) {color = [239, 209, 0]} // Temperate Grassland / Desert
        else if (temperature <  0.2 && pricipitation < -0.8) {color = [229, 199, 0]} // Temperate Grassland / Desert
        else if (temperature <  0.2 && pricipitation < -0.7) {color = [219, 189, 0]} // Temperate Grassland / Desert
        else if (temperature <  0.2 && pricipitation < -0.6) {color = [209, 179, 0]} // Temperate Grassland / Desert
        else if (temperature <  0.2 && pricipitation < -0.5) {color = [214, 126, 0]} // Woodland
        else if (temperature <  0.2 && pricipitation < -0.4) {color = [204, 116, 0]} // Woodland
        else if (temperature <  0.2 && pricipitation < -0.3) {color = [194, 106, 0]} // Woodland
        else if (temperature <  0.2 && pricipitation < -0.2) {color = [184, 96, 0]} // Woodland
        else if (temperature <  0.2 && pricipitation < -0.1) {color = [161, 244, 130]} // Temperare Seasonal Forest
        else if (temperature <  0.2 && pricipitation <  0  ) {color = [141, 234, 120]} // Temperare Seasonal Forest
        else if (temperature <  0.2 && pricipitation <  0.1) {color = [131, 224, 110]} // Temperare Seasonal Forest
        else if (temperature <  0.2 && pricipitation <  0.2) {color = [121, 214, 100]} // Temperare Seasonal Forest
        else if (temperature <  0.2 && pricipitation <  0.3) {color = [62, 171, 37]} // Temperare Rain Forest
        else if (temperature <  1   && pricipitation < -0.4) {color = [190, 133, 37]} // Subtropical desert
        else if (temperature <  1   && pricipitation < -0.3) {color = [198, 210, 6]} // Tropical seasonal forest / savanna
        else if (temperature <  1   && pricipitation < -0.2) {color = [188, 200, 6]} // Tropical seasonal forest / savanna
        else if (temperature <  1   && pricipitation < -0.1) {color = [178, 190, 6]} // Tropical seasonal forest / savanna
        else if (temperature <  1   && pricipitation <    0) {color = [168, 180, 6]} // Tropical seasonal forest / savanna
        else if (temperature <  1   && pricipitation <  0.1) {color = [158, 170, 6]} // Tropical seasonal forest / savanna
        else if (temperature <  1   && pricipitation <  0.2) {color = [148, 160, 6]} // Tropical seasonal forest / savanna
        else if (temperature <  1   && pricipitation <  0.3) {color = [138, 150, 6]} // Tropical seasonal forest / savanna
        else if (temperature <  1   && pricipitation <  0.4) {color = [0, 171, 96]} // Tropical rain forest
        else if (temperature <  1   && pricipitation <  0.5) {color = [0, 161, 86]} // Tropical rain forest
        else if (temperature <  1   && pricipitation <  0.6) {color = [0, 151, 76]} // Tropical rain forest
        else if (temperature <  1   && pricipitation <  0.7) {color = [0, 141, 66]} // Tropical rain forest
        else if (temperature <  1   && pricipitation <  0.8) {color = [0, 131, 56]} // Tropical rain forest
        else if (temperature <  1   && pricipitation <  0.9) {color = [0, 121, 46]} // Tropical rain forest
        else if (temperature <  1   && pricipitation <  1  ) {color = [0, 111, 36]} // Tropical rain forest
        else                                                 {color = [0, 111, 36]}

        this.pixels[index  ] = color[0]
        this.pixels[index+1] = color[1]
        this.pixels[index+2] = color[2]
        this.pixels[index+3] = 255
      }
    }

    this.context.putImageData(this.imageData, 0, 0)
  }
  renderArchipelago(settings) {
    let perlin_generator_1 = new PerlinNoise2D(settings.seed+3)
    let radial_gradient_generator = new RadialGradient(this.canvasW, this.canvasH, this.canvasW*settings.radialRadius)

    let frequency = settings.frequency
    let persistence = settings.persistence

    for (let i=0; i<this.canvasW; i++) {
      for (let j=0; j<this.canvasH; j++) {
        const index = (this.canvasW * j + i) * 4

        let altitude = perlin_generator_1.evaluateFBM(i/frequency, j/frequency, 1, 1, 5, persistence)
        
        if (settings.smoothEdge) {
          altitude = (altitude + radial_gradient_generator.evaluate(i, j)) / 2
        }

        let color = [0, 0, 0]
        if      (altitude < -0.7 ) {color = [32, 89, 169]} // Sea
        else if (altitude < -0.4 ) {color = [37, 99, 185]} // Sea 2
        else if (altitude < -0.1 ) {color = [44, 105, 190]} // Sea 3
        else if (altitude <  0.05) {color = [64, 126, 211]} // Sea 4
        else if (altitude <  0.2 ) {color = [133, 179, 242]} // Sea 5
        else if (altitude <  0.22) {color = [254, 243, 180]} // Beach
        else if (altitude <  0.25) {color = [249, 234, 151]} // Beach Darker
        else if (altitude <  0.35) {color = [56, 199, 92]} // Beach Forest
        else if (altitude <  0.55) {color = [35, 175, 70]} // Beach Forest
        else if (altitude <  0.75) {color = [27, 142, 56]} // Mountain Forest
        else if (altitude <  0.85) {color = [140, 140, 140]} // Mountain Forest
        else if (altitude <  0.95) {color = [100, 100, 100]} // Mountain Forest
        else                       {color = [255, 255, 255]} // Ice

        this.pixels[index  ] = color[0]
        this.pixels[index+1] = color[1]
        this.pixels[index+2] = color[2]
        this.pixels[index+3] = 255
      }
    }

    this.context.putImageData(this.imageData, 0, 0)
  }
  renderDesert(settings) {
    let perlin_generator_1 = new PerlinNoise2D(settings.seed)
    let perlin_generator_2 = new PerlinNoise2D(settings.seed+1)

    let frequency = settings.frequency
    let persistence = settings.persistence

    for (let i=0; i<this.canvasW; i++) {
      for (let j=0; j<this.canvasH; j++) {
        const index = (this.canvasW * j + i) * 4

        const altitude = perlin_generator_1.evaluateFBM(i/frequency, j/frequency, 1, 1, 5, persistence)
        const stone    = perlin_generator_2.evaluateFBM(i/frequency, j/frequency, 1, 1, 5, persistence)

        let color = [0, 0, 0]
        if      (altitude < -0.9                ) {color = [210, 185, 75]} // Sand
        else if (altitude < -0.8                ) {color = [215, 190, 80]} // Sand
        else if (altitude < -0.7                ) {color = [220, 195, 85]} // Sand
        else if (altitude < -0.6                ) {color = [225, 200, 90]} // Sand
        else if (altitude < -0.5                ) {color = [230, 205, 95]} // Sand
        else if (altitude < -0.4 && stone < -0.9) {color = [150, 150, 150]} // Stone
        else if (altitude < -0.4 && stone < -0.8) {color = [100, 100, 100]} // Stone
        else if (altitude < -0.4                ) {color = [235, 210, 100]} // Sand
        else if (altitude < -0.3                ) {color = [240, 215, 105]} // Sand
        else if (altitude < -0.2                ) {color = [245, 220, 110]} // Sand
        else if (altitude < -0.1                ) {color = [250, 225, 115]} // Sand
        else if (altitude <  0                  ) {color = [255, 230, 120]} // Sand
        else if (altitude <  0.1                ) {color = [255, 234, 126]} // Sand
        else if (altitude <  0.2                ) {color = [255, 244, 136]} // Sand
        else if (altitude <  0.7                ) {color = [255, 255, 146]} // Sand
        else if (altitude <  0.75               ) {color = [42, 177, 46]} // Oasis Tree
        else if (altitude <  0.8                ) {color = [98, 148, 229]} // Oasis Water
        else if (altitude <  0.85               ) {color = [54, 118, 221]} // Oasis Water
        else if (altitude <  0.9                ) {color = [255, 224, 116]} // Oasis Sand
        else if (altitude <  0.93               ) {color = [42, 177, 46]} // Oasis Tree
        else if (altitude <  2                  ) {color = [32, 167, 36]} // Oasis Tree

        this.pixels[index  ] = color[0]
        this.pixels[index+1] = color[1]
        this.pixels[index+2] = color[2]
        this.pixels[index+3] = 255
      }
    }

    this.context.putImageData(this.imageData, 0, 0)
  }
  renderPolar(settings) {
    let perlin_generator_1 = new PerlinNoise2D(settings.seed+5)
    let radial_gradient_generator = new RadialGradient(this.canvasW, this.canvasH, this.canvasW*settings.radialRadius)

    let frequency = settings.frequency
    let persistence = settings.persistence

    for (let i=0; i<this.canvasW; i++) {
      for (let j=0; j<this.canvasH; j++) {
        const index = (this.canvasW * j + i) * 4

        let altitude = perlin_generator_1.evaluateFBM(i/frequency, j/frequency, 1, 1, 5, persistence)
        
        if (settings.smoothEdge) {
          altitude = (altitude + radial_gradient_generator.evaluate(i, j)) / 2
        }

        let color = [0, 0, 0]
        if      (altitude < -0.7 ) {color = [32, 89, 169]} // Sea
        else if (altitude < -0.4 ) {color = [37, 99, 185]} // Sea 2
        else if (altitude < -0.1 ) {color = [44, 105, 190]} // Sea 3
        else if (altitude <  0.05) {color = [64, 126, 211]} // Sea 4
        else if (altitude <  0.2 ) {color = [133, 179, 242]} // Sea 5
        else                       {color = [255, 255, 255]} // Ice

        this.pixels[index  ] = color[0]
        this.pixels[index+1] = color[1]
        this.pixels[index+2] = color[2]
        this.pixels[index+3] = 255
      }
    }

    this.context.putImageData(this.imageData, 0, 0)
  }
}