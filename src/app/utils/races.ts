// Senate race first, then house races ordered by district
export const sortRaces = (a: string, b: string) => {
  const raceA = a.split("-");
  const raceB = b.split("-");
  if (raceA[1] === "S") {
    return -1;
  } else if (raceB[1] === "S") {
    return 1;
  } else {
    return raceA[2].localeCompare(raceB[2]);
  }
};
