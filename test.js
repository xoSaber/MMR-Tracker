const API_KEY = "RGAPI-94c41157-381f-40ce-8e70-f2a65efcf55b";

const RANK_TO_VALUE = {
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

const VALUE_TO_RANK = {
  1: "IRON IV",
  2: "IRON III",
  3: "IRON II",
  4: "IRON I",
  5: "BRONZE IV",
  6: "BRONZE III",
  7: "BRONZE II",
  8: "BRONZE I",
  9: "SILVER IV",
  10: "SILVER III",
  11: "SILVER II",
  12: "SILVER I",
  13: "GOLD IV",
  14: "GOLD III",
  15: "GOLD II",
  16: "GOLD I",
  17: "PLATINUM IV",
  18: "PLATINUM III",
  19: "PLATINUM II",
  20: "PLATINUM I",
  21: "EMERALD IV",
  22: "EMERALD III",
  23: "EMERALD II",
  24: "EMERALD I",
  25: "DIAMOND IV",
  26: "DIAMOND III",
  27: "DIAMOND II",
  28: "DIAMOND I",
  29: "MASTER",
  30: "GRANDMASTER",
  31: "CHALLENGER",
};

async function getPlayerPUUID(gameName, tagLine) {
  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`
    );
    const jsonResponse = await response.json();
    return jsonResponse["puuid"];
  } catch (e) {
    console.log("Error:", e);
  }
}

async function getMatchIDs(puuid) {
  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1&api_key=${API_KEY}`
    );
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (e) {
    console.log("Error:", e);
  }
}

async function getRank(summonerID) {
  try {
    const response = await fetch(
      `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${API_KEY}`
    );
    const jsonResponse = await response.json();
    if (jsonResponse.length) {
      const tier = jsonResponse[0]["tier"];
      const rank = jsonResponse[0]["rank"];
      console.log(tier, rank);

      if (!tier || !rank) {
        return "";
      }

      return tier + " " + rank;
    }
  } catch (e) {
    console.log("Error:", e);
  }

  return "";
}

async function getAverageRating(matchID) {
  try {
    const response = await fetch(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`
    );
    const jsonResponse = await response.json();
    const participants = jsonResponse["info"]["participants"];

    let count = 0;
    let total = 0;

    for (let i = 0; i < participants.length; i++) {
      let rank = await getRank(participants[i]["summonerId"]);

      if (rank) {
        count++;
        total += RANK_TO_VALUE[rank];
      }
    }

    return total / count;
  } catch (e) {
    console.log("Error:", e);
  }
  return 0;
}

async function main(user, tag) {
  const puuid = await getPlayerPUUID(user, tag);
  const matchIDs = await getMatchIDs(puuid);

  let total = 0;
  for (let i = 0; i < matchIDs.length; i++) {
    total += await getAverageRating(matchIDs[i]);
  }

  rating = total / matchIDs.length;

  return VALUE_TO_RANK[Math.floor(rating)];
}

module.exports = { main };
