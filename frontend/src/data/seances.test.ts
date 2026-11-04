import { describe, expect, it } from "vitest";
import { seancesAvecReportEnAttente, traiterDemandeDeReport, type Seance } from "./seances";

const baseSeance: Seance = {
  id: "x",
  projet: "Projet test",
  ecole: "École test",
  enseignant: "Enseignant test",
  date: "2027-01-01",
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
