const userForm = document.getElementById("form");
const rankElem = document.getElementById("rank");
userForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formInfo = new FormData(userForm);
  const user = formInfo.get("user");
  const tag = formInfo.get("tag");
  const rank = await fetch(`http://localhost:8080/tshirt`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(rank);
  const jsonResponse = await rank.json();
  //   rankElem.textContent = rank
  console.log(jsonResponse);
});
