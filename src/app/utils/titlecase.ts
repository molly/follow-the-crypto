export function titlecase(str: string): string {
  return str.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

export function titlecaseCompany(str: string): string {
  let titlecased = str.replace(/([^\W_]{3,}[^\s-]*) */g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
  const uppercased = ["LLC", "DRW"];
  for (const word of uppercased) {
    titlecased = titlecased.replace(
      new RegExp(`\\b${word}\\b`, "gi"),
      word.toUpperCase(),
    );
  }
  return titlecased;
}

export function titlecaseIndividualName(str: string): string {
  return str
    .split(" ")
    .map((x) => {
      let cased = titlecase(x);
      if (cased.startsWith("Mc")) {
        cased = `Mc${titlecase(cased.slice(2))}`;
      }
      return cased;
    })
    .join(" ");
}

export function titlecaseSuffix(str: string): string {
  if (str.match(/^[IVX]+$/)) {
    return str;
  } else {
    return titlecase(str);
  }
}

export function titlecaseOccupation(str: string): string {
  if (str.match(/^C[A-Z]{2}$/)) {
    return str;
  } else {
    return titlecase(str);
  }
}
