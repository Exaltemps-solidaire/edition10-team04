import { describe, expect, it } from "vitest";
import {
  compterParStatut,
  filtrerSeances,
  seancesAvecReportEnAttente,
  traiterDemandeDeReport,
  type Seance,
} from "./seances";

const baseSeance: Seance = {
  id: "x",
  projet: "Projet test",
  ecole: "École test",
  classe: "CE2",
  enseignant: "Enseignant test",
  animateur: "Animateur test",
  financeur: "Financeur test",
  date: "2027-01-01",
  heure: "09:00",
  statut: "confirmee",
  demandeDeReportEnAttente: false,
};

describe("seancesAvecReportEnAttente", () => {
  it("ne garde que les séances avec une demande de report en attente", () => {
    const liste: Seance[] = [
      { ...baseSeance, id: "1", demandeDeReportEnAttente: false },
      { ...baseSeance, id: "2", demandeDeReportEnAttente: true },
      { ...baseSeance, id: "3", demandeDeReportEnAttente: true },
    ];

    const resultat = seancesAvecReportEnAttente(liste);

    expect(resultat.map((s) => s.id)).toEqual(["2", "3"]);
  });

  it("renvoie une liste vide quand aucune séance n'est en attente", () => {
    const liste: Seance[] = [{ ...baseSeance, demandeDeReportEnAttente: false }];

    expect(seancesAvecReportEnAttente(liste)).toEqual([]);
  });
});

describe("traiterDemandeDeReport", () => {
  it("valide une demande : statut reportée, nouvelle date, demande levée", () => {
    const liste: Seance[] = [{ ...baseSeance, demandeDeReportEnAttente: true }];

    const resultat = traiterDemandeDeReport(liste, "x", "validee", "2027-02-01");

    expect(resultat[0]).toMatchObject({
      statut: "reportee",
      date: "2027-02-01",
      demandeDeReportEnAttente: false,
    });
  });

  it("refuse une demande : le statut et la date ne changent pas, la demande est levée", () => {
    const liste: Seance[] = [{ ...baseSeance, demandeDeReportEnAttente: true }];

    const resultat = traiterDemandeDeReport(liste, "x", "refusee");

    expect(resultat[0]).toMatchObject({
      statut: "confirmee",
      date: "2027-01-01",
      demandeDeReportEnAttente: false,
    });
  });
});

describe("compterParStatut", () => {
  it("compte les séances par statut, y compris les statuts absents (0)", () => {
    const liste: Seance[] = [
      { ...baseSeance, id: "1", statut: "confirmee" },
      { ...baseSeance, id: "2", statut: "confirmee" },
      { ...baseSeance, id: "3", statut: "a_confirmer" },
    ];

    expect(compterParStatut(liste)).toEqual({
      a_confirmer: 1,
      confirmee: 2,
      realisee: 0,
      reportee: 0,
    });
  });
});

describe("filtrerSeances", () => {
  const liste: Seance[] = [
    { ...baseSeance, id: "1", projet: "A", animateur: "Lucia M.", statut: "confirmee", date: "2027-01-10" },
    { ...baseSeance, id: "2", projet: "B", animateur: "P. Renaud", statut: "a_confirmer", date: "2027-01-20" },
    { ...baseSeance, id: "3", projet: "A", animateur: "P. Renaud", statut: "confirmee", date: "2027-02-05" },
  ];

  it("combine les filtres projet, animateur, statut et mois", () => {
    expect(filtrerSeances(liste, { projet: "A" }).map((s) => s.id)).toEqual(["1", "3"]);
    expect(filtrerSeances(liste, { animateur: "P. Renaud" }).map((s) => s.id)).toEqual(["2", "3"]);
    expect(filtrerSeances(liste, { statut: "confirmee" }).map((s) => s.id)).toEqual(["1", "3"]);
    expect(filtrerSeances(liste, { mois: "2027-01" }).map((s) => s.id)).toEqual(["1", "2"]);
    expect(filtrerSeances(liste, { projet: "A", mois: "2027-02" }).map((s) => s.id)).toEqual(["3"]);
  });

  it("renvoie la liste complète sans filtre", () => {
    expect(filtrerSeances(liste, {})).toEqual(liste);
  });
});
