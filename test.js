// fetch("https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Watching%20Me/hawk?api_key=RGAPI-12ba0f3e-5eb0-46c5-9528-64deadd653f7")
//   .then(async (res) => {
//     console.log(await res.json());
//   })
//   .catch((err) => {
//     console.log(err);
//   });

async function getPlayerPUUID(gameName, tagLine){

  const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=RGAPI-12ba0f3e-5eb0-46c5-9528-64deadd653f7`)
  const jsonResponse = await response.json()
  // console.log(jsonResponse)
  return jsonResponse["puuid"]
};




// puuid = (async () => console.log(await getPlayerPUUID("drew diff","2112")))()

async function getMatchIDs(puuid){

  const response  = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=RGAPI-12ba0f3e-5eb0-46c5-9528-64deadd653f7`)
  const jsonResponse = await response.json()
  return jsonResponse

}

async function getRank(summonerID){
  const response  = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=RGAPI-12ba0f3e-5eb0-46c5-9528-64deadd653f7`)
  const jsonResponse = await response.json()
  const tier = jsonResponse["tier"]
  const rank = jsonResponse["rank"]

  return tier + " " + rank
}

async function getAverageRating(matchID){
  const response  = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=RGAPI-12ba0f3e-5eb0-46c5-9528-64deadd653f7`)
  const jsonResponse = await response.json()
  const participants = jsonResponse["info"]["participants"]

  const ranks = {
    "Iron IV": 1,
    "Iron III": 2,
    "Iron II": 3,
    "Iron I": 4,
    "Bronze IV": 5,
    "Bronze III": 6,
    "Bronze II": 7,
    "Bronze I": 8,
    "Silver IV": 9,
    "Silver III": 10,
    "Silver II": 11,
    "Silver I": 12,
    "Gold IV": 13,
    "Gold III": 14,
    "Gold II": 15,
    "Gold I": 16,
    "Platinum IV": 17,
    "Platinum III": 18,
    "Platinum II": 19,
    "Platinum I": 20,
    "Emerald IV": 21,
    "Emerald III": 22,
    "Emerald II": 23,
    "Emerald I": 24,
    "Diamond IV": 25,
    "Diamond III": 26,
    "Diamond II": 27,
    "Diamond I": 28,
    "Master I": 29,
    "Grandmaster I": 30,
    "Challenger I": 31
  }

  let count = 0
  let total = 0

  for (let i = 0; i < participants.length; i++){

    let curr = getRank(participants[i]["summonerId"])
    
    if (curr != 0){
      count++ 
    }

    total += total[curr]
  }
  
  return total / count
}

async function main(){

  const puuid = await getPlayerPUUID("drew diff", "2112")
  const matchIDs = await getMatchIDs(puuid)
  // console.log(matchIDs)

  total  = 0 
  for (let i = 0; i < matchIDs.length; i++){
    total += getAverageRating(matchIDs[i])
  }

  rating = total / matchIDs.length

  ranks = {
    1: "Iron IV",
    2: "Iron III",
    3: "Iron II",
    4: "Iron I",
    5: "Bronze IV",
    6: "Bronze III",
    7: "Bronze II",
    8: "Bronze I",
    9: "Silver IV",
    10: "Silver III",
    11: "Silver II",
    12: "Silver I",
    13: "Gold IV",
    14: "Gold III",
    15: "Gold II",
    16: "Gold I",
    17: "Platinum IV",
    18: "Platinum III",
    19: "Platinum II",
    20: "Platinum I",
    21: "Emerald IV",
    22: "Emerald III",
    23: "Emerald II",
    24: "Emerald I",
    25: "Diamond IV",
    26: "Diamond III",
    27: "Diamond II",
    28: "Diamond I",
    29: "Master",
    30: "Grandmaster",
    31: "Challenger"
  }

  console.log(ranks[Math.floor(rating)])

};

main()