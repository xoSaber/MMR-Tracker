const API_KEY = "RGAPI-5dd2854b-e18c-45fa-8ff0-ba6580a2bb29";

async function getPlayerPUUID(gameName, tagLine) {
  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`
    );
    const jsonResponse = await response.json();
    // console.log(jsonResponse)
    return jsonResponse["puuid"];
  } catch (e) {
    console.log(e);
  }
}

// puuid = (async () => console.log(await getPlayerPUUID("drew diff","2112")))()

async function getMatchIDs(puuid) {
  const response = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1&api_key=${API_KEY}`
  );
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function getRank(summonerID) {
  const response = await fetch(
    `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${API_KEY}`
  );
  const jsonResponse = await response.json();
  if (jsonResponse.length) {
    const tier = jsonResponse[0]["tier"];
    const rank = jsonResponse[0]["rank"];

    if (!tier || !rank) {
      return "";
    }

    return tier + " " + rank;
  }

  return "";
}

async function getAverageRating(matchID) {
  const response = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`
  );
  const jsonResponse = await response.json();
  const participants = jsonResponse["info"]["participants"];

  const ranks = {
    "IRON IV": 1,
    "IRON III": 2,
    "IRON II": 3,
    "IRON I": 4,
    "BRONZE IV": 5,
    "BRONZE III": 6,
    "BRONZE II": 7,
    "BRONZE I": 8,
    "SILVER IV": 9,
    "SILVER III": 10,
    "SILVER II": 11,
    "SILVER I": 12,
    "GOLD IV": 13,
    "GOLD III": 14,
    "GOLD II": 15,
    "GOLD I": 16,
    "PLATINUM IV": 17,
    "PLATINUM III": 18,
    "PLATINUM II": 19,
    "PLATINUM I": 20,
    "EMERALD IV": 21,
    "EMERALD III": 22,
    "EMERALD II": 23,
    "EMERALD I": 24,
    "DIAMOND IV": 25,
    "DIAMOND III": 26,
    "DIAMOND II": 27,
    "DIAMOND I": 28,
    "MASTER I": 29,
    "GRANDMASTER I": 30,
    "CHALLENGER I": 31,
  };

  let count = 0;
  let total = 0;

  for (let i = 0; i < participants.length; i++) {
    let rank = await getRank(participants[i]["summonerId"]);

    if (rank) {
      count++;
      total += ranks[rank];
    }
  }

  return total / count;
}

async function main() {
  const puuid = await getPlayerPUUID("drew diff", "2112");
  const matchIDs = await getMatchIDs(puuid);
  // console.log(matchIDs)

  let total = 0;
  for (let i = 0; i < matchIDs.length; i++) {
    total += await getAverageRating(matchIDs[i]);
  }

  rating = total / matchIDs.length;

  console.log(rating);
}

main();
