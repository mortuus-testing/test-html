// Show specific settings for a specific map style
const mapStyleButtons = document.querySelectorAll('.map-style')
mapStyleButtons.forEach(button => {
  button.addEventListener('click', e => {
    showSettings(e.currentTarget.id)
    generate()
  })
})
function showSettings(style) {
  const settings = document.querySelectorAll('.style-settings')
  settings.forEach(setting => {
    if (setting.getAttribute('data-map-style') !== style) {
      setting.style.display = 'none'
    } else {
      setting.style.display = 'flex'
    }
  })
}

// Enable seed locking
const lockButton = document.getElementById('seed-lock')
let isLocked = lockButton.classList.contains('seed--locked')
lockButton.onclick = () => {
  lockButton.classList.toggle('seed--locked')
  isLocked = !isLocked
}


// A function to get seed based on state
function getSeed() {
  const seedEl = document.getElementById('seed-input')
  if (isLocked) {
    return parseInt( seedEl.value )
  } else {
    let seed = Math.floor( Math.random() * 10e6 )
    seedEl.value = seed
    return seed
  }
} 



/****************************************************************
 * 
 * The Start of Map Generation Logic
 * 
 ****************************************************************/


const canvas     = document.getElementById('map')
const mapFactory = new MapFactory(canvas)

function download() {
  const image = canvas.toDataURL("image/png", 1) 
  const link  = document.createElement('a')

  link.href     = image
  link.download = "map.png"
  link.click()
}

function generate() {
  const seed  = getSeed()
  const mapStyle = document.querySelector('.map-style:checked') ? document.querySelector('.map-style:checked').id : null

  switch (mapStyle) {

    case 'biomes':
      console.log('Generating biomes with seed ' + seed)

      document.getElementById('map-container').style.backgroundColor = '#3964ef'

      mapFactory.render({
        seed: seed,
        style: mapStyle,
        frequency: 3 + ( document.getElementById('biomes-scale-range').value *0.5),
        persistence: 0.45 + (document.getElementById('biomes-details-range').value *0.01)
      })
      break

    case 'archipelago':
      console.log('Generating archipelago with seed ' + seed)

      document.getElementById('map-container').style.backgroundColor = '#5077f7'

      mapFactory.render({
        seed: seed,
        style: mapStyle,
        frequency: 3 + ( document.getElementById('archipelago-scale-range').value *0.5),
        persistence: 0.45 + ( document.getElementById('archipelago-details-range').value *0.01),
        smoothEdge: document.getElementById('archipelago-smooth-edge-checkbox').checked,
        radialRadius: (10-document.getElementById('archipelago-smooth-edge-range').value) / 10
      })
      break

    case 'desert':
      console.log('Generating dune with seed ' + seed)

      document.getElementById('map-container').style.backgroundColor = '#e8d892'

      mapFactory.render({
        seed: seed,
        style: mapStyle,
        frequency: 3 + ( document.getElementById('desert-scale-range').value *0.5),
        persistence: 0.45 + ( document.getElementById('desert-details-range').value *0.01)
      })
      break

    case 'polar':
      console.log('Generating polar with seed ' + seed)

      document.getElementById('map-container').style.backgroundColor = '#adc5f8'

      mapFactory.render({
        seed: seed,
        style: mapStyle,
        frequency: 3 + ( document.getElementById('polar-scale-range').value *0.5),
        persistence: 0.45 + ( document.getElementById('polar-details-range').value *0.01),
        smoothEdge: document.getElementById('polar-smooth-edge-checkbox').checked,
        radialRadius: (10-document.getElementById('polar-smooth-edge-range').value) / 10
      })
      break
  }
}

// Generate map on button click
document.getElementById('generate-button').onclick = generate

// Donwload map on button click
document.getElementById('download-button').onclick = download

// Generate initial state
generate()