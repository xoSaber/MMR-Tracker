fetch("https://pokeapi.co/api/v2/pokemon/ditto")
  .then(async (res) => {
    console.log(await res.json());
  })
  .catch((err) => {
    console.log(err);
  });
