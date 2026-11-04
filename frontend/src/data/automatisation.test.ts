import { describe, expect, it } from "vitest";
import { avancerEtape, toutesTerminees, type StatutEtape } from "./automatisation";

describe("avancerEtape", () => {
  it("marque uniquement l'étape visée comme terminée, sans toucher les autres", () => {
    const depart: StatutEtape[] = ["en_attente", "en_attente", "en_attente"];
    const resultat = avancerEtape(depart, 1);
    expect(resultat).toEqual(["en_attente", "terminee", "en_attente"]);
  });
});

describe("toutesTerminees", () => {
  it("renvoie faux tant qu'une étape est en attente", () => {
    expect(toutesTerminees(["terminee", "en_attente"])).toBe(false);
  });

  it("renvoie vrai quand toutes les étapes sont terminées", () => {
    expect(toutesTerminees(["terminee", "terminee"])).toBe(true);
  });
});
