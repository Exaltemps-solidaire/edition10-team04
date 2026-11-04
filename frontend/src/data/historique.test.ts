import { describe, expect, it } from "vitest";
import { trierChronologiquement, type EvenementHistorique } from "./historique";

const brouillon: EvenementHistorique[] = [
  { id: "x", type: "rappel", titre: "Rappel", date: "2027-01-16", heure: "08:00", acteurNom: "Système", acteurRole: "Auto", canal: "email" },
  { id: "y", type: "creation", titre: "Création", date: "2026-10-01", heure: "09:30", acteurNom: "A", acteurRole: "Coordinatrice", canal: "app" },
  { id: "z", type: "report", titre: "Report", date: "2026-10-20", heure: "08:45", acteurNom: "B", acteurRole: "Animateur", canal: "mobile" },
];

describe("trierChronologiquement", () => {
  it("trie les événements du plus ancien au plus récent", () => {
    const resultat = trierChronologiquement(brouillon);
    expect(resultat.map((e) => e.id)).toEqual(["y", "z", "x"]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const copie = [...brouillon];
    trierChronologiquement(brouillon);
    expect(brouillon).toEqual(copie);
  });
});
