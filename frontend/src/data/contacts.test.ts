import { describe, expect, it } from "vitest";
import { ajouterContact, initiales, type Contact } from "./contacts";

describe("initiales", () => {
  it("prend la première lettre du prénom et du nom, en majuscules", () => {
    expect(initiales("sophie", "lefèvre")).toBe("SL");
  });
});

describe("ajouterContact", () => {
  it("ajoute un contact avec 0 séance et un identifiant généré, sans modifier la liste d'origine", () => {
    const depart: Contact[] = [];
    const resultat = ajouterContact(depart, {
      typeContact: "enseignant",
      prenom: "Marie",
      nom: "Dupont",
      email: "m.dupont@ac-nice.fr",
      organisation: "École Test",
      detail: "CP",
    });
    expect(depart).toHaveLength(0);
    expect(resultat).toHaveLength(1);
    expect(resultat[0].nbSeances).toBe(0);
    expect(resultat[0].id).toBeTruthy();
  });
});
