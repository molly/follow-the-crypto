export function titlecase(str: string): string {
  let cased = str.replace(/\b[\w.']+\b/g, function (txt) {
    if (["AND", "OF", "THE", "FOR"].includes(txt)) {
      return txt.toLowerCase();
    }
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
  return cased.charAt(0).toUpperCase() + cased.substring(1);
}

export function titlecaseCompany(str: string): string {
  let titlecased = titlecase(str);
  titlecased = titlecased.replace(
    /\b([A-Z]|AH|TJ|GP|SV|LLC|DRW|DBA|CMT|RRE|USA|HBAR)\b/gi,
    function (txt) {
      return txt.toUpperCase();
    },
  );
  titlecased = titlecased.replace(
    /\b(Ma?c|[OD]')(\w+)\b/gi,
    function (_, m, rest) {
      return m + rest.charAt(0).toUpperCase() + rest.substring(1).toLowerCase();
    },
  );
  return titlecased;
}

export function titlecaseCommittee(str: string): string {
  if (str === "ACTBLUE") {
    return "ActBlue";
  }
  if (str === "WINRED") {
    return "WinRed";
  }
  if (str.includes(" DBA ")) {
    str = str.split(" DBA ")[0];
  }
  let titlecased = titlecase(str);
  titlecased = titlecased.replace(
    /\b(SMP|LCV|AF(C|P)|UDP|PAC|RSLC|NEA|I{1,3}|DNC|D(C|S)CC|NR(S|C)C|FF|HMP|SFA|SEIU|COPE|AB|ACLU)\b/gi,
    function (txt) {
      return txt.toUpperCase();
    },
  );
  return titlecased;
}

export function titlecaseIndividualName(str?: string | null): string {
  if (!str) {
    return "";
  }
  return str.replace(/\b[\w.']+\b/, function (x) {
    let cased = titlecase(x);
    cased = cased.replace(/\b(Ma?c|[OD]')(\w+)\b/gi, function (_, m, rest) {
      return m + rest.charAt(0).toUpperCase() + rest.substring(1).toLowerCase();
    });
    return cased;
  });
}

export function titlecaseSuffix(str: string): string {
  if (str.match(/^[IVX]+$/)) {
    return str;
  } else {
    return titlecase(str);
  }
}

export function titlecaseOccupation(str: string): string {
  return titlecase(str)
    .split(" ")
    .map((x) => {
      if (x.match(/^[^A-Z]*([VG]P|C[A-Z]{2}|US|SRE)[^A-Z]*$/i)) {
        return x.toUpperCase();
      }
      return x;
    })
    .join(" ");
}

export function titlecaseLastFirst(str: string): string {
  const parts = str.split(", ");
  const firstname = parts[1].split(" ")[0];
  return titlecaseIndividualName(`${firstname} ${parts[0]}`);
}
