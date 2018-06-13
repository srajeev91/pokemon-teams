const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const trainersMain = document.querySelector('main')
let trainerCards;

document.addEventListener("DOMContentLoaded", function() {
  function index() {
    return fetch(TRAINERS_URL).then(response => response.json()).then(renderTrainers)
  }

  function renderTrainers(trainersObj) {
    trainersObj.forEach(trainerObj => renderTrainer(trainerObj))
  }

  function renderTrainer(trainerObj) {
    const pokemonsHTML = trainerObj.pokemons.map(p => `<li>${p.nickname} (${p.species}) <button class="release" data-pokemon-id="${p.id}">Release</button></li>`).join('')
    const trainerHTML = `<div class="card" data-id="${trainerObj.id}"><p>${trainerObj.name}</p>
    <button data-trainer-id="${trainerObj.id}">Add Pokemon</button>
    <ul>
      ${pokemonsHTML}
    </ul>
  </div>`

    trainersMain.innerHTML += trainerHTML
    trainerCards = Array.from(document.getElementsByClassName('card'))


    addPokemon()
    releasePokemon()
  }

  function addPokemon() {
    let ul;
    trainerCards.forEach(card =>
      card.addEventListener("click", function(e) {
        if (e.target.tagName === "BUTTON" && e.target.innerText ==="Add Pokemon") {
          let ul = e.target.parentElement.querySelector('ul')
          debugger
          let configBody = {'trainer_id': e.target.dataset.trainerId}

          let config = {
            method: 'POST',
            body: JSON.stringify(configBody),
            headers: {
              'Content-type':'application/json'
            }
          }

          if (ul.getElementsByTagName('li').length == 6) {
            alert('Can\'t have more than 6 pokemon')
          } else {
            return fetch(POKEMONS_URL, config).then(response => response.json())
            .then(p => ul.innerHTML += `<li>${p.nickname} (${p.species}) <button class="release" data-pokemon-id="${p.id}">Release</button></li>`)
          }

        }
      })
    )
  }

  function releasePokemon() {
    let ul;
    trainerCards.forEach(card =>
      card.addEventListener("click", function(e) {

        if (e.target.tagName === "BUTTON" && e.target.innerText ==="Release") {
          let li = e.target.parentElement
          let id = e.target.dataset.pokemonId
          let config = {
            method: 'DELETE'
          }

          return fetch(`${POKEMONS_URL}/${id}`, config).then(response => response.json())
          .then(li.remove())
        }
      })
    )
  }



  index()

})
