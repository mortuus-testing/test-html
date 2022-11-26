// Show specific settings for a specific map style
const mapStyleButtons = document.querySelectorAll('.map-style')
mapStyleButtons.forEach(button => {
  button.addEventListener('click', e => {
    showSettings(e.currentTarget.id)
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

function generate() {
  const seed  = getSeed()
  const mapStyle = document.querySelector('.map-style:checked') ? document.querySelector('.map-style:checked').id : null

  switch (mapStyle) {
    case 'biomes':
      console.log('Generating biomes with seed ' + seed)
      // Get settings
      let frequency = document.getElementById('biomes-scale-range').value
      let persistence = document.getElementById('biomes-details-range').value

      // Rescale settings value
      frequency = 3 + (frequency*0.5)
      persistence = 0.45 + (persistence*0.01)

      mapFactory.render({
        seed: seed,
        style: mapStyle,
        frequency: frequency,
        persistence: persistence
      })
      break
    case 'archipelago':
      console.log('Generating archipelago with seed ' + seed)
      break
    case 'dune':
      console.log('Generating dune with seed ' + seed)
      break
    case 'polar':
      console.log('Generating polar with seed ' + seed)
      break
  }
}

// Generate map on button click
document.getElementById('generate-button').onclick = generate

// Generate initial state
generate()