class Pokemon {
  constructor(obj) {
    this.section = document.querySelector(obj.section);
    this.form = document.querySelector(obj.form);
    this.pcSection = document.querySelector(obj.pcSection);
    this.vs = document.querySelector(obj.vs);
    this.result = document.querySelector(obj.result);
    this.form.addEventListener("submit", (e) => this.fetchPokemon(e));
  }

  async fetchPokemon(e) {
    e.preventDefault();
    const input = this.form.querySelector(".input");
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input.value}`);
    input.value = "";
    if (!res.ok) {
      alert("Pokemon not found (((");
      return;
    }
    const obj = await res.json(),
      name = obj.name,
      img = obj.sprites.front_default,
      attack = obj.stats[2].base_stat;
    this.section.innerHTML = `
      <div class="pokemon" >
        <h2 class="pokemon-title">${name}</h2>
        <img class="pokemon-img" src="${img}" />
        <p class="pokemon-attack">Attack: ${attack}</p>
      </div>
    `;
    this.vs.classList.add("active");
    const randomIndex = Math.floor(Math.random() * 1016);
    const pcres = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${randomIndex}`
      ),
      pcobj = await pcres.json();
    const randomIndex2 = Math.floor(Math.random() * pcobj.results.length);
    const randomPokemon = pcobj.results[randomIndex2].name;
    const pcres2 = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomPokemon}`
    );
    const pcobj2 = await pcres2.json();
    const pcname = pcobj2.name;
    const pcimg = pcobj2.sprites.front_default;
    const pcattack = pcobj2.stats[2].base_stat;
    this.pcSection.innerHTML = `
      <div class="pokemon" >
        <h2 class="pokemon-title">${pcname}</h2>
        <img class="pokemon-img" src="${pcimg}" />
        <p class="pokemon-attack">Attack: ${pcattack}</p>
      </div>
    `;
    this.checkResult(attack, pcattack, name, pcname);
  }

  checkResult(attack, pcattack, name, pcname) {
    if (attack > pcattack) {
      this.result.innerHTML = `You picked "${name}" and AI picked "${pcname}". <span class="result-span">You win!<span>`;
      const span = this.result.querySelector(".result-span");
      span.style.color = "blue";
    } else if (attack === pcattack) {
      this.result.innerHTML = `You picked "${name}" and PC picked "${pcname}". <span class="result-span">That's a draw!<span>`;
      const span = this.result.querySelector(".result-span");
      span.style.color = "gray";
    } else {
      this.result.innerHTML = `You picked "${name}" and PC picked "${pcname}". <span class="result-span">You lose!<span>`;
      const span = this.result.querySelector(".result-span");
      span.style.color = "red";
    }
  }
}

const pokemon = new Pokemon({
  section: ".pokemon-section",
  form: ".form",
  pcSection: ".pc-section",
  vs: ".vs",
  result: ".result",
});
