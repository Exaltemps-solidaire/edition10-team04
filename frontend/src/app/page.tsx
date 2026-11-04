"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  seances as seancesInitiales,
  LIBELLE_STATUT,
  traiterDemandeDeReport,
  type DecisionReport,
  type Seance,
  type StatutSeance,
} from "@/data/seances";

type Ecran = "dashboard" | "reporter" | "validation" | "mail";

const CLASSE_BADGE: Record<StatutSeance, string> = {
  confirmee: styles.badgeConfirmee,
  a_confirmer: styles.badgeAConfirmer,
  realisee: styles.badgeRealisee,
  reportee: styles.badgeReportee,
};

function formaterDate(date: string, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }): string {
  return new Date(date).toLocaleDateString("fr-FR", options);
}

export default function Home() {
  const [seances, setSeances] = useState<Seance[]>(seancesInitiales);
  const [ecran, setEcran] = useState<Ecran>("dashboard");
  const [idSelectionne, setIdSelectionne] = useState<string | null>(null);
  const [nouvelleDate, setNouvelleDate] = useState("2027-01-23");
  const [motif, setMotif] = useState("Sortie scolaire imprévue (natation…)");
  const [precisions, setPrecisions] = useState(
    "L'enseignant a signalé une sortie natation en direct.",
  );

  const seanceSelectionnee = seances.find((s) => s.id === idSelectionne) ?? null;

  function ouvrirEcran(id: string, cible: Ecran) {
    setIdSelectionne(id);
    setEcran(cible);
  }

  function soumettreReport(e: React.FormEvent) {
    e.preventDefault();
    setEcran("validation");
  }

  function traiter(decision: DecisionReport) {
    if (idSelectionne) {
      setSeances((liste) =>
        traiterDemandeDeReport(liste, idSelectionne, decision, decision === "validee" ? nouvelleDate : undefined),
      );
    }
    setEcran("dashboard");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {ecran !== "dashboard" && (
          <div className={styles.topbar}>
            <button className={styles.topbarBack} onClick={() => setEcran("dashboard")} aria-label="Retour">
              ←
            </button>
            <div className={styles.topbarTitre}>
              {ecran === "reporter" && "Reporter une séance"}
              {ecran === "validation" && "Demande de report"}
              {ecran === "mail" && (
                <>
                  Médi<span>Plan</span> · Rappel
                </>
              )}
            </div>
          </div>
        )}

        {ecran === "dashboard" && (
          <>
            <div className={styles.topbar}>
              <div className={styles.topbarTitre}>
                Médi<span>Plan</span>
              </div>
              <div className={styles.topbarUtilisateur}>
                Claire Lefèvre
                <br />
                Coordinatrice de projet
              </div>
            </div>

            <div className={styles.sectionTitre}>Tableau de bord des séances</div>
            <div className={styles.carte}>
              {seances.map((seance) => (
                <div key={seance.id} className={styles.ligneSeance}>
                  <div className={styles.ligneHaut}>
                    <div>
                      <div className={styles.titre}>{seance.projet}</div>
                      <div className={styles.detail}>
                        {formaterDate(seance.date)} · {seance.ecole} · {seance.enseignant}
                      </div>
                    </div>
                    <span className={`${styles.badge} ${CLASSE_BADGE[seance.statut]}`}>
                      {LIBELLE_STATUT[seance.statut]}
                    </span>
                  </div>
                  {seance.demandeDeReportEnAttente && (
                    <div className={styles.ligneReport}>
                      <span className={styles.tagReport}>⚠ Demande de report en attente</span>
                      <button className={styles.lienVoir} onClick={() => ouvrirEcran(seance.id, "validation")}>
                        Voir →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.sectionTitre}>Démo du parcours</div>
            <div className={styles.carte}>
              <button className={styles.lienAction} onClick={() => ouvrirEcran("2", "reporter")}>
                📅 Reporter une séance
              </button>
              <button className={styles.lienAction} onClick={() => setEcran("mail")}>
                ✉️ Aperçu du mail de rappel
              </button>
            </div>
          </>
        )}

        {ecran === "reporter" && seanceSelectionnee && (
          <div className={styles.ecran}>
            <div className={styles.sectionTitre}>Séance concernée</div>
            <div className={styles.carte} style={{ padding: 14 }}>
              <div className={styles.titre}>
                {seanceSelectionnee.projet} — {seanceSelectionnee.enseignant}
              </div>
              <div className={styles.detail}>{seanceSelectionnee.ecole}</div>
              <div className={styles.detail} style={{ marginTop: 8, fontWeight: 700, color: "#c2410c" }}>
                Date actuelle : {formaterDate(seanceSelectionnee.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>

            <div className={styles.sectionTitre}>Nouvelle date proposée</div>
            <form className={styles.carte} onSubmit={soumettreReport}>
              <label className={styles.formLabel}>Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={nouvelleDate}
                onChange={(e) => setNouvelleDate(e.target.value)}
              />

              <label className={styles.formLabel}>Motif du report</label>
              <select className={styles.formInput} value={motif} onChange={(e) => setMotif(e.target.value)}>
                <option>Enseignant absent</option>
                <option>Sortie scolaire imprévue (natation…)</option>
                <option>Activité sportive</option>
                <option>Autre</option>
              </select>

              <label className={styles.formLabel}>Précisions (facultatif)</label>
              <textarea
                className={styles.formTextarea}
                value={precisions}
                onChange={(e) => setPrecisions(e.target.value)}
              />

              <button type="submit" className={styles.btnPrimary}>
                Envoyer la demande à la coordinatrice
              </button>
            </form>
          </div>
        )}

        {ecran === "validation" && seanceSelectionnee && (
          <div className={styles.ecran}>
            <div className={styles.sectionTitre}>Séance concernée</div>
            <div className={styles.carte} style={{ padding: 14 }}>
              <div className={styles.titre}>
                {seanceSelectionnee.projet} — {seanceSelectionnee.enseignant}
              </div>
              <div className={styles.detail}>{seanceSelectionnee.ecole}</div>
            </div>

            <div className={styles.sectionTitre}>Changement de date</div>
            <div className={styles.diffBand}>
              <div>
                <div className={styles.diffLabel}>Ancienne date</div>
                <div className={styles.diffVal}>{formaterDate(seanceSelectionnee.date)}</div>
              </div>
              <div className={styles.diffArrow}>→</div>
              <div>
                <div className={styles.diffLabel}>Nouvelle date</div>
                <div className={styles.diffVal}>{formaterDate(nouvelleDate)}</div>
              </div>
            </div>
            <div className={styles.carte} style={{ padding: 14 }}>
              <div className={styles.detail} style={{ fontWeight: 700 }}>Motif</div>
              <div className={styles.titre}>{motif}</div>
              <div className={styles.detail}>« {precisions} »</div>
            </div>

            <div className={styles.sectionTitre}>Si vous validez, automatiquement :</div>
            <div className={styles.carte}>
              <div className={styles.notifRow}>
                <span>✔ Agenda Outlook mis à jour</span>
                <span className={`${styles.badge} ${styles.badgeConfirmee}`}>Auto</span>
              </div>
              <div className={styles.notifRow}>
                <span>✔ Fichier Excel du projet mis à jour</span>
                <span className={`${styles.badge} ${styles.badgeConfirmee}`}>Auto</span>
              </div>
              <div className={styles.notifRow}>
                <span>✔ Historique du report enregistré</span>
                <span className={`${styles.badge} ${styles.badgeConfirmee}`}>Auto</span>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.btnPrimaryVert} onClick={() => traiter("validee")}>
                ✔ Valider le report
              </button>
              <button className={styles.btnAlerte} onClick={() => traiter("refusee")}>
                ✕ Refuser
              </button>
            </div>
          </div>
        )}

        {ecran === "mail" && (
          <div className={styles.ecran}>
            <div className={styles.mailWrap}>
              <div className={styles.mailHeaderBand}>
                <div className={styles.detail}>Objet</div>
                <div className={styles.titre}>Rappel — Animation Méditerranée 2000 dans 7 jours</div>
              </div>
              <div className={styles.mailBody}>
                <p>Bonjour Monsieur Durant,</p>
                <p>
                  Nous vous rappelons qu&apos;une animation de l&apos;association <strong>Méditerranée 2000</strong> est
                  prévue dans votre classe dans <strong>7 jours</strong>.
                </p>
                <div className={styles.mailRecap}>
                  <div className={styles.notifRow}><span>Programme</span><span>Abeilles et biodiversité</span></div>
                  <div className={styles.notifRow}><span>Classe</span><span>CE2 — École Carnot, Cannes</span></div>
                  <div className={styles.notifRow}><span>Date</span><span>Mardi 14 janvier 2027</span></div>
                  <div className={styles.notifRow}><span>Horaire</span><span>09h00 – 11h00</span></div>
                </div>
                <p>Si cette date ne vous convient plus, vous pouvez demander une reprogrammation.</p>
              </div>
            </div>
            <div style={{ padding: "0 16px 16px" }}>
              <button className={styles.btnAlerte} onClick={() => ouvrirEcran("2", "reporter")}>
                ⟳ Demander une reprogrammation
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
