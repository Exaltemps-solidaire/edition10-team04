import styles from "./page.module.css";
import { seances, LIBELLE_STATUT, type StatutSeance } from "@/data/seances";

const CLASSE_BADGE: Record<StatutSeance, string> = {
  confirmee: styles.badgeConfirmee,
  a_confirmer: styles.badgeAConfirmer,
  realisee: styles.badgeRealisee,
  reportee: styles.badgeReportee,
};

function formaterDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
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
                    {formaterDate(seance.date)} · {seance.ecole} ·{" "}
                    {seance.enseignant}
                  </div>
                </div>
                <span className={`${styles.badge} ${CLASSE_BADGE[seance.statut]}`}>
                  {LIBELLE_STATUT[seance.statut]}
                </span>
              </div>
              {seance.demandeDeReportEnAttente && (
                <span className={styles.tagReport}>
                  ⚠ Demande de report en attente
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
