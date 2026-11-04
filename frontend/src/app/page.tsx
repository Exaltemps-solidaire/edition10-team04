"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  seances as seancesInitiales,
  seancesAvecReportEnAttente,
  compterParStatut,
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

const NAV = [
  { ecran: "dashboard" as const, icone: "📊", libelle: "Tableau de bord" },
  { ecran: "reporter" as const, icone: "📅", libelle: "Reporter une séance" },
  { ecran: "validation" as const, icone: "✅", libelle: "Validations" },
  { ecran: "mail" as const, icone: "✉️", libelle: "Rappels" },
];

const TITRE_ECRAN: Record<Ecran, string> = {
  dashboard: "Tableau de bord",
  reporter: "Reporter une séance",
  validation: "Demande de report",
  mail: "Rappel automatique",
};

function formaterDate(date: string, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }): string {
  return new Date(date).toLocaleDateString("fr-FR", options);
}

function jourMois(date: string): { jour: string; mois: string } {
  const d = new Date(date);
  return {
    jour: d.toLocaleDateString("fr-FR", { day: "2-digit" }),
    mois: d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
  };
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
  const enAttente = seancesAvecReportEnAttente(seances);
  const compte = compterParStatut(seances);

  function ouvrirEcran(id: string, cible: Ecran) {
    setIdSelectionne(id);
    setEcran(cible);
  }

  function allerReporter() {
    ouvrirEcran(enAttente[0]?.id ?? seances[0].id, "reporter");
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
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          📅 Médi<span>Plan</span>
        </div>
        <nav className={styles.sidebarNav}>
          {NAV.map((item) => (
            <button
              key={item.ecran}
              className={`${styles.navItem} ${ecran === item.ecran ? styles.navItemActive : ""}`}
              onClick={() => (item.ecran === "reporter" ? allerReporter() : setEcran(item.ecran))}
            >
              <span>{item.icone}</span>
              {item.libelle}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarUser}>
          <div className={styles.avatar}>SL</div>
          <div>
            <div className={styles.sidebarUserNom}>Sophie Lefèvre</div>
            <div className={styles.sidebarUserRole}>Coordinatrice</div>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>{TITRE_ECRAN[ecran]}</div>
          <div className={styles.searchBar}>🔍 Rechercher une séance, une école…</div>
          <div className={styles.headerActions}>
            <div className={styles.bellWrap}>
              🔔<span className={styles.bellDot} />
            </div>
            <div className={styles.avatar} style={{ background: "#dbeafe", color: "#1d4ed8" }}>
              SL
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {ecran === "dashboard" && (
            <>
              <div className={styles.greeting}>Bonjour Sophie 👋</div>
              <div className={styles.subtitle}>
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>

              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={`${styles.kpiIcon} ${styles.kpiIconBlue}`}>📘</div>
                  <div className={styles.kpiValue}>{compte.confirmee}</div>
                  <div className={styles.kpiLabel}>Séances planifiées</div>
                </div>
                <div className={styles.kpiCard}>
                  <div className={`${styles.kpiIcon} ${styles.kpiIconYellow}`}>⏳</div>
                  <div className={styles.kpiValue}>{compte.a_confirmer}</div>
                  <div className={styles.kpiLabel}>À confirmer</div>
                  {compte.a_confirmer > 0 && <div className={styles.kpiWarning}>⚠ nécessite une action</div>}
                </div>
                <div className={styles.kpiCard}>
                  <div className={`${styles.kpiIcon} ${styles.kpiIconRed}`}>↺</div>
                  <div className={styles.kpiValue}>{compte.reportee}</div>
                  <div className={styles.kpiLabel}>Séances reportées</div>
                </div>
                <div className={styles.kpiCard}>
                  <div className={`${styles.kpiIcon} ${styles.kpiIconGreen}`}>✔</div>
                  <div className={styles.kpiValue}>{compte.realisee}</div>
                  <div className={styles.kpiLabel}>Séances réalisées</div>
                </div>
              </div>

              <div className={styles.mainGrid}>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>Séances à venir</div>
                  {seances.slice(0, 4).map((seance) => {
                    const { jour, mois } = jourMois(seance.date);
                    return (
                      <div key={seance.id} className={styles.sessionRow}>
                        <div className={styles.sessionDate}>
                          <span className={styles.sessionDateNum}>{jour}</span>
                          <span className={styles.sessionDateMois}>{mois}</span>
                        </div>
                        <div className={styles.sessionInfo}>
                          <div className={styles.sessionProjet}>{seance.projet}</div>
                          <div className={styles.sessionMeta}>
                            {seance.ecole} · {seance.enseignant}
                          </div>
                        </div>
                        <span className={`${styles.badgePill} ${CLASSE_BADGE[seance.statut]}`}>
                          {LIBELLE_STATUT[seance.statut]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <div className={`${styles.panel} ${styles.panelOrange}`}>
                    <div className={styles.panelTitle}>⚠ Validations en attente</div>
                    {enAttente.length === 0 && <div className={styles.sessionMeta}>Aucune demande en attente.</div>}
                    {enAttente.map((seance) => (
                      <div key={seance.id} className={styles.validationItem}>
                        <div className={styles.validationProjet}>{seance.projet}</div>
                        <div className={styles.validationMeta}>
                          {seance.ecole} · demande de report
                        </div>
                        <button className={styles.lienVoir} onClick={() => ouvrirEcran(seance.id, "validation")}>
                          Voir →
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={styles.panel}>
                    <div className={styles.panelTitle}>🤖 Rappels automatiques</div>
                    <div className={styles.rappelRow}>
                      <span className={styles.rappelIcon}>🤖</span>
                      <span>J-7 envoyé à M. Durant (Alimentation durable)</span>
                    </div>
                    <div className={styles.rappelRow}>
                      <span className={styles.rappelIcon}>🤖</span>
                      <span>J-2 prévu pour N. Ferreira (Eau et milieu marin)</span>
                    </div>
                    <button className={styles.lienVoir} onClick={() => setEcran("mail")}>
                      Voir un exemple →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {ecran === "reporter" && seanceSelectionnee && (
            <div className={styles.panel} style={{ maxWidth: 520 }}>
              <div className={styles.panelTitle}>Séance concernée</div>
              <div className={styles.sessionProjet}>
                {seanceSelectionnee.projet} — {seanceSelectionnee.enseignant}
              </div>
              <div className={styles.sessionMeta}>{seanceSelectionnee.ecole}</div>
              <div className={styles.kpiWarning} style={{ marginTop: 10 }}>
                Date actuelle :{" "}
                {formaterDate(seanceSelectionnee.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>

              <form onSubmit={soumettreReport}>
                <label className={styles.formLabel}>Nouvelle date</label>
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
            <div style={{ maxWidth: 520 }}>
              <div className={styles.panel}>
                <div className={styles.panelTitle}>Séance concernée</div>
                <div className={styles.sessionProjet}>
                  {seanceSelectionnee.projet} — {seanceSelectionnee.enseignant}
                </div>
                <div className={styles.sessionMeta}>{seanceSelectionnee.ecole}</div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelTitle}>Changement de date</div>
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
                <div className={styles.sessionMeta} style={{ marginTop: 12 }}>
                  Motif : <strong>{motif}</strong> — « {precisions} »
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelTitle}>Si vous validez, automatiquement :</div>
                <div className={styles.notifRow}><span>✔ Agenda Outlook mis à jour</span><span className={`${styles.badgePill} ${styles.badgeConfirmee}`}>Auto</span></div>
                <div className={styles.notifRow}><span>✔ Fichier Excel du projet mis à jour</span><span className={`${styles.badgePill} ${styles.badgeConfirmee}`}>Auto</span></div>
                <div className={styles.notifRow}><span>✔ Historique du report enregistré</span><span className={`${styles.badgePill} ${styles.badgeConfirmee}`}>Auto</span></div>
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
            <div className={styles.panel} style={{ maxWidth: 520 }}>
              <div className={styles.mailHeaderBand}>
                <div className={styles.sessionMeta}>Objet</div>
                <div className={styles.sessionProjet}>Rappel — Animation Méditerranée 2000 dans 7 jours</div>
              </div>
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
              <button className={styles.btnAlerte} onClick={allerReporter}>
                ⟳ Demander une reprogrammation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
