import { describe, expect, it } from "vitest";
import { compterParDestinataire, type Notification } from "./notifications";

const jeu: Notification[] = [
  { id: "a", typeDestinataire: "enseignant", destinataireNom: "A", destinataireRole: "x", objet: "o", dateEnvoi: "2026-01-01", lu: true },
  { id: "b", typeDestinataire: "enseignant", destinataireNom: "B", destinataireRole: "x", objet: "o", dateEnvoi: "2026-01-01", lu: false },
  { id: "c", typeDestinataire: "financeur", destinataireNom: "C", destinataireRole: "x", objet: "o", dateEnvoi: "2026-01-01", lu: true },
];

describe("compterParDestinataire", () => {
  it("calcule le total, les lus et le taux de lecture par type", () => {
    const stats = compterParDestinataire(jeu);
    expect(stats.enseignant).toEqual({ total: 2, lus: 1, tauxLecture: 50 });
    expect(stats.financeur).toEqual({ total: 1, lus: 1, tauxLecture: 100 });
  });

  it("renvoie un taux de lecture à 0 pour un type sans notification", () => {
    const stats = compterParDestinataire(jeu);
    expect(stats.responsable).toEqual({ total: 0, lus: 0, tauxLecture: 0 });
  });
});
