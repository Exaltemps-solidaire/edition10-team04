"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  seances as seancesInitiales,
  seancesAvecReportEnAttente,
  compterParStatut,
  filtrerSeances,
  changerStatut,
  LIBELLE_STATUT,
  traiterDemandeDeReport,
  type DecisionReport,
  type Seance,
  type StatutSeance,
} from "@/data/seances";
import {
  notifications,
  compterParDestinataire,
  ICONE_DESTINATAIRE,
  LIBELLE_DESTINATAIRE,
  type TypeDestinataire,
} from "@/data/notifications";
import {
  evenementsHistorique,
  trierChronologiquement,
  seanceHistoriqueId,
  ICONE_EVENEMENT,
  LIBELLE_CANAL,
  type TypeEvenement,
} from "@/data/historique";
import {
  etapesAutomatisation,
  avancerEtape,
  toutesTerminees,
  DELAI_ETAPE_MS,
  type StatutEtape,
  type ClasseCouleurEtape,
} from "@/data/automatisation";
import {
  contacts as contactsInitiaux,
  initiales,
  ajouterContact,
  LIBELLE_TYPE_CONTACT,
  ICONE_TYPE_CONTACT,
  LABELS_CHAMPS_CONTACT,
  TYPES_FINANCEUR,
  type Contact,
  type TypeContact,
} from "@/data/contacts";

type Ecran =
  | "dashboard"
  | "seances"
  | "reporter"
  | "validation"
  | "notifications"
  | "historique"
  | "parties-prenantes"
  | "mail"
  | "automatisation";

const CLASSE_BADGE: Record<StatutSeance, string> = {
  confirmee: styles.badgeConfirmee,
  a_confirmer: styles.badgeAConfirmer,
  realisee: styles.badgeRealisee,
  reportee: styles.badgeReportee,
};

const CLASSE_ICONE_EVENEMENT: Record<TypeEvenement, string> = {
  creation: styles.timelineIconCreation,
  confirmation: styles.timelineIconConfirmation,
  report: styles.timelineIconReport,
  validation: styles.timelineIconValidation,
  rappel: styles.timelineIconRappel,
  a_venir: styles.timelineIconAVenir,
};

const CLASSE_ICONE_ETAPE: Record<ClasseCouleurEtape, string> = {
  bleu: styles.autoStepIconBleu,
  vert: styles.autoStepIconVert,
  orange: styles.autoStepIconOrange,
  violet: styles.autoStepIconViolet,
  indigo: styles.autoStepIconIndigo,
};

const CLASSE_AVATAR_CONTACT: Record<TypeContact, string> = {
  enseignant: styles.avatarEnseignant,
  financeur: styles.avatarFinanceur,
  elu: styles.avatarElu,
};

const CONTACT_VIDE = {
  typeContact: "enseignant" as TypeContact,
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  organisation: "",
  detail: "",
};

const NAV = [
  { ecran: "dashboard" as const, icone: "📊", libelle: "Tableau de bord" },
  { ecran: "seances" as const, icone: "📋", libelle: "Séances" },
  { ecran: "reporter" as const, icone: "📅", libelle: "Reporter une séance" },
  { ecran: "validation" as const, icone: "✅", libelle: "Validations" },
  { ecran: "notifications" as const, icone: "🔔", libelle: "Notifications" },
  { ecran: "historique" as const, icone: "🕒", libelle: "Historique" },
  { ecran: "parties-prenantes" as const, icone: "👥", libelle: "Parties prenantes" },
  { ecran: "mail" as const, icone: "✉️", libelle: "Rappels" },
  { ecran: "automatisation" as const, icone: "⚙️", libelle: "Automatisation" },
];

const TITRE_ECRAN: Record<Ecran, string> = {
  dashboard: "Tableau de bord",
  seances: "Séances",
  reporter: "Reporter une séance",
  validation: "Demande de report",
  notifications: "Notifications",
  historique: "Historique",
  "parties-prenantes": "Parties prenantes",
  mail: "Rappel automatique",
  automatisation: "Automatisation",
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
  const [filtreProjet, setFiltreProjet] = useState("");
  const [filtreAnimateur, setFiltreAnimateur] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<StatutSeance | "">("");
  const [filtreMois, setFiltreMois] = useState("");
  const [seanceDetail, setSeanceDetail] = useState<string | null>(null);
  const [statutsEtapes, setStatutsEtapes] = useState<StatutEtape[]>(
    etapesAutomatisation.map(() => "en_attente"),
  );
  const [demoLancee, setDemoLancee] = useState(false);
  const [contactsList, setContactsList] = useState<Contact[]>(contactsInitiaux);
  const [ongletContact, setOngletContact] = useState<TypeContact>("enseignant");
  const [modalContactOuvert, setModalContactOuvert] = useState(false);
  const [nouveauContact, setNouveauContact] = useState(CONTACT_VIDE);

  const seanceSelectionnee = seances.find((s) => s.id === idSelectionne) ?? null;
  const seanceEnDetail = seances.find((s) => s.id === seanceDetail) ?? null;
  const enAttente = seancesAvecReportEnAttente(seances);
  const compte = compterParStatut(seances);
  const projets = [...new Set(seances.map((s) => s.projet))];
  const animateurs = [...new Set(seances.map((s) => s.animateur))];
  const seancesFiltrees = filtrerSeances(seances, {
    projet: filtreProjet || undefined,
    animateur: filtreAnimateur || undefined,
    statut: filtreStatut || undefined,
    mois: filtreMois || undefined,
  });
  const statsDestinataires = compterParDestinataire(notifications);
  const seanceHistorique = seances.find((s) => s.id === seanceHistoriqueId) ?? null;
  const evenementsTries = trierChronologiquement(evenementsHistorique);
  const contactsOnglet = contactsList.filter((c) => c.typeContact === ongletContact);

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

  function appliquerStatut(id: string, statut: StatutSeance) {
    setSeances((liste) => changerStatut(liste, id, statut));
    setSeanceDetail(null);
  }

  function lancerDemoAutomatisation() {
    setDemoLancee(true);
    setStatutsEtapes(etapesAutomatisation.map(() => "en_attente"));
    etapesAutomatisation.forEach((_, index) => {
      setTimeout(() => {
        setStatutsEtapes((liste) => avancerEtape(liste, index));
      }, DELAI_ETAPE_MS * (index + 1));
    });
  }

  function ouvrirModalContact() {
    setNouveauContact({ ...CONTACT_VIDE, typeContact: ongletContact });
    setModalContactOuvert(true);
  }

  function soumettreContact(e: React.FormEvent) {
    e.preventDefault();
    setContactsList((liste) =>
      ajouterContact(liste, {
        typeContact: nouveauContact.typeContact,
        prenom: nouveauContact.prenom,
        nom: nouveauContact.nom,
        email: nouveauContact.email,
        telephone: nouveauContact.telephone || undefined,
        organisation: nouveauContact.organisation,
        detail: nouveauContact.detail || undefined,
      }),
    );
    setModalContactOuvert(false);
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

          {ecran === "seances" && (
            <>
              <div className={styles.tableToolbar}>
                <div className={styles.filterBar}>
                  <select className={styles.formInput} value={filtreProjet} onChange={(e) => setFiltreProjet(e.target.value)}>
                    <option value="">Tous les projets</option>
                    {projets.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <select className={styles.formInput} value={filtreAnimateur} onChange={(e) => setFiltreAnimateur(e.target.value)}>
                    <option value="">Tous les animateurs</option>
                    {animateurs.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <select
                    className={styles.formInput}
                    value={filtreStatut}
                    onChange={(e) => setFiltreStatut(e.target.value as StatutSeance | "")}
                  >
                    <option value="">Tous les statuts</option>
                    {Object.entries(LIBELLE_STATUT).map(([valeur, libelle]) => (
                      <option key={valeur} value={valeur}>{libelle}</option>
                    ))}
                  </select>
                  <input
                    type="month"
                    className={styles.formInput}
                    value={filtreMois}
                    onChange={(e) => setFiltreMois(e.target.value)}
                  />
                </div>
                <div className={styles.toolbarActions}>
                  <button className={styles.btnPrimarySm}>+ Nouvelle séance</button>
                  <button className={styles.btnExportVert} title="Export non disponible dans cette démo">📗 Exporter Excel</button>
                  <button className={styles.btnExportRouge} title="Export non disponible dans cette démo">📕 Exporter PDF</button>
                </div>
              </div>

              <div className={styles.panel} style={{ padding: 0 }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Projet</th>
                      <th>École</th>
                      <th>Enseignant</th>
                      <th>Animateur</th>
                      <th>Date + heure</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seancesFiltrees.map((seance) => (
                      <tr key={seance.id} className={styles.tableRow} onClick={() => setSeanceDetail(seance.id)}>
                        <td>{seance.projet}</td>
                        <td>{seance.ecole}</td>
                        <td>{seance.enseignant}</td>
                        <td>{seance.animateur}</td>
                        <td>{formaterDate(seance.date)} · {seance.heure}</td>
                        <td>
                          <span className={`${styles.badgePill} ${CLASSE_BADGE[seance.statut]}`}>
                            {LIBELLE_STATUT[seance.statut]}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {seancesFiltrees.length === 0 && (
                      <tr>
                        <td colSpan={6} className={styles.sessionMeta} style={{ padding: 16 }}>
                          Aucune séance ne correspond à ces filtres.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {ecran === "notifications" && (
            <>
              <div className={styles.kpiGrid}>
                {(Object.keys(LIBELLE_DESTINATAIRE) as TypeDestinataire[]).map((type) => (
                  <div key={type} className={styles.kpiCard}>
                    <div className={`${styles.kpiIcon} ${styles.kpiIconBlue}`}>{ICONE_DESTINATAIRE[type]}</div>
                    <div className={styles.kpiValue}>{statsDestinataires[type].total}</div>
                    <div className={styles.kpiLabel}>{LIBELLE_DESTINATAIRE[type]}</div>
                    <div className={styles.kpiWarning} style={{ color: "#16a34a" }}>
                      {statsDestinataires[type].tauxLecture}% de lecture
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.panel} style={{ padding: 0, marginTop: 24 }}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={styles.notifListRow}
                    style={{ borderLeftColor: notif.lu ? "#16a34a" : "#f59e0b" }}
                  >
                    <span className={styles.notifListIcone}>{ICONE_DESTINATAIRE[notif.typeDestinataire]}</span>
                    <div className={styles.notifListInfo}>
                      <div className={styles.sessionProjet}>{notif.destinataireNom}</div>
                      <div className={styles.sessionMeta}>{notif.destinataireRole}</div>
                    </div>
                    <div className={styles.notifListInfo}>
                      <div className={styles.sessionMeta}>{notif.objet}</div>
                    </div>
                    <div className={styles.sessionMeta}>{formaterDate(notif.dateEnvoi)}</div>
                    <span className={`${styles.badgePill} ${notif.lu ? styles.badgeConfirmee : styles.badgeAConfirmer}`}>
                      {notif.lu ? "✓✓ Lu" : "🕒 En attente"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {ecran === "historique" && seanceHistorique && (
            <>
              <div className={styles.panel} style={{ maxWidth: 640 }}>
                <div className={styles.panelTitle}>{seanceHistorique.projet}</div>
                <div className={styles.sessionMeta}>{seanceHistorique.ecole}</div>
                <button className={styles.lienVoir} onClick={() => setSeanceDetail(seanceHistorique.id)}>
                  Voir la fiche →
                </button>
              </div>

              <div className={styles.panel} style={{ maxWidth: 640 }}>
                {evenementsTries.map((ev, i) => (
                  <div key={ev.id} className={styles.timelineItem}>
                    <div className={styles.timelineIconCol}>
                      <div className={`${styles.timelineIcon} ${CLASSE_ICONE_EVENEMENT[ev.type]}`}>
                        {ICONE_EVENEMENT[ev.type]}
                      </div>
                      {i < evenementsTries.length - 1 && <div className={styles.timelineLine} />}
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitre}>{ev.titre}</div>
                      <div className={styles.timelineMeta}>
                        {formaterDate(ev.date, { day: "numeric", month: "long", year: "numeric" })} · {ev.heure}
                      </div>

                      {ev.type === "report" && (
                        <div className={styles.diffBand} style={{ marginTop: 8 }}>
                          <div>
                            <div className={styles.diffLabel}>Ancienne date</div>
                            <div className={styles.diffVal}>{formaterDate(ev.ancienneDate!)}</div>
                          </div>
                          <div className={styles.diffArrow}>→</div>
                          <div>
                            <div className={styles.diffLabel}>Nouvelle date</div>
                            <div className={styles.diffVal}>{formaterDate(ev.nouvelleDate!)}</div>
                          </div>
                        </div>
                      )}
                      {ev.type === "report" && (
                        <div className={styles.sessionMeta} style={{ marginTop: 6 }}>
                          Motif : <strong>{ev.motif}</strong>
                        </div>
                      )}

                      {ev.type === "validation" && ev.actionsAuto && (
                        <div className={styles.mailRecap}>
                          {ev.actionsAuto.map((action) => (
                            <div key={action} className={styles.notifRow}>
                              <span>{action}</span>
                              <span className={`${styles.badgePill} ${styles.badgeConfirmee}`}>Auto</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className={styles.timelineActeur}>
                        {ev.acteurNom} · {ev.acteurRole} · {LIBELLE_CANAL[ev.canal]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {ecran === "parties-prenantes" && (
            <>
              <div className={styles.pageHeaderRow}>
                <div>
                  <div className={styles.panelTitle} style={{ marginBottom: 2 }}>Parties prenantes</div>
                  <div className={styles.sessionMeta}>
                    Contacts externes — reçoivent les communications par e-mail uniquement
                  </div>
                </div>
                <button className={styles.btnPrimarySm} onClick={ouvrirModalContact}>
                  + Ajouter un contact
                </button>
              </div>

              <div className={styles.tabsRow}>
                {(Object.keys(LIBELLE_TYPE_CONTACT) as TypeContact[]).map((type) => (
                  <button
                    key={type}
                    className={`${styles.tabBtn} ${ongletContact === type ? styles.tabBtnActive : ""}`}
                    onClick={() => setOngletContact(type)}
                  >
                    {ICONE_TYPE_CONTACT[type]} {LIBELLE_TYPE_CONTACT[type]}
                  </button>
                ))}
              </div>

              <div className={styles.contactGrid}>
                {contactsOnglet.map((contact) => (
                  <div key={contact.id} className={styles.contactCard}>
                    <button
                      className={styles.contactEditBtn}
                      title="Modification non disponible dans cette démo"
                    >
                      ✏️
                    </button>
                    <div className={`${styles.avatar} ${CLASSE_AVATAR_CONTACT[contact.typeContact]}`}>
                      {initiales(contact.prenom, contact.nom)}
                    </div>
                    <div className={styles.contactNom}>{contact.prenom} {contact.nom}</div>
                    <div className={styles.contactOrg}>{contact.organisation}</div>
                    <div className={styles.contactLigne}>
                      ✉️ <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </div>
                    {contact.telephone && (
                      <div className={styles.contactLigne}>📞 {contact.telephone}</div>
                    )}
                    <span className={`${styles.badgePill} ${styles.badgeConfirmee}`} style={{ marginTop: 8 }}>
                      {contact.nbSeances} séance{contact.nbSeances > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
                {contactsOnglet.length === 0 && (
                  <div className={styles.sessionMeta}>Aucun contact dans cette catégorie.</div>
                )}
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

          {ecran === "automatisation" && (
            <div style={{ maxWidth: 640 }}>
              <div className={styles.autoTrigger}>
                <span className={styles.autoTriggerCheck}>✔</span>
                <div>
                  <div className={styles.sessionProjet}>Sophie a validé le report</div>
                  <div className={styles.sessionMeta}>Déclenche automatiquement les actions ci-dessous.</div>
                </div>
              </div>

              <div className={styles.autoStepGrid}>
                {etapesAutomatisation.map((etape, index) => {
                  const termine = statutsEtapes[index] === "terminee";
                  return (
                    <div key={etape.id} className={`${styles.autoStepCard} ${termine ? styles.autoStepCardDone : ""}`}>
                      <div className={`${styles.autoStepIcon} ${CLASSE_ICONE_ETAPE[etape.classeCouleur]}`}>
                        {etape.icone}
                      </div>
                      <div className={styles.autoStepInfo}>
                        <div className={styles.autoStepTitre}>{etape.titre}</div>
                        <div className={styles.sessionMeta}>{etape.description}</div>
                      </div>
                      <div className={styles.autoStepStatus}>{termine ? "✅" : "🕒"}</div>
                    </div>
                  );
                })}
              </div>

              <button className={styles.btnPrimary} onClick={lancerDemoAutomatisation}>
                ▶ Lancer la démo
              </button>

              {demoLancee && toutesTerminees(statutsEtapes) && (
                <div className={styles.autoSuccessBand}>
                  <div className={styles.autoStepTitre}>🎉 Tout est à jour ! 5 actions réalisées en moins de 3 secondes</div>
                  <div className={styles.autoSuccessTiles}>
                    <div className={styles.autoSuccessTile}>📅 Outlook</div>
                    <div className={styles.autoSuccessTile}>📊 Excel</div>
                    <div className={styles.autoSuccessTile}>🍎 Enseignant</div>
                    <div className={styles.autoSuccessTile}>👔 Financeur</div>
                    <div className={styles.autoSuccessTile}>📋 Historique</div>
                  </div>
                  <div className={styles.sessionMeta} style={{ marginTop: 10 }}>
                    Rappel J-7 planifié : e-mail automatique à Mme Leclerc dans 7 jours.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {seanceEnDetail && (
        <div className={styles.modalOverlay} onClick={() => setSeanceDetail(null)}>
          <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelTitle}>{seanceEnDetail.projet}</div>
            <div className={styles.notifRow}><span>École</span><span>{seanceEnDetail.ecole}</span></div>
            <div className={styles.notifRow}><span>Classe</span><span>{seanceEnDetail.classe}</span></div>
            <div className={styles.notifRow}><span>Enseignant</span><span>{seanceEnDetail.enseignant}</span></div>
            <div className={styles.notifRow}><span>Animateur</span><span>{seanceEnDetail.animateur}</span></div>
            <div className={styles.notifRow}><span>Financeur</span><span>{seanceEnDetail.financeur}</span></div>
            <div className={styles.notifRow}>
              <span>Date</span>
              <span>{formaterDate(seanceEnDetail.date, { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <div className={styles.notifRow}><span>Heure</span><span>{seanceEnDetail.heure}</span></div>

            <div className={styles.btnRow} style={{ marginTop: 16 }}>
              <button className={styles.btnPrimaryVert} onClick={() => appliquerStatut(seanceEnDetail.id, "confirmee")}>
                Confirmer
              </button>
              <button
                className={styles.btnGris}
                onClick={() => {
                  setSeanceDetail(null);
                  ouvrirEcran(seanceEnDetail.id, "reporter");
                }}
              >
                Reporter
              </button>
              <button className={styles.btnPrimary} style={{ marginTop: 0 }} onClick={() => appliquerStatut(seanceEnDetail.id, "realisee")}>
                Marquer réalisée
              </button>
            </div>
          </div>
        </div>
      )}

      {modalContactOuvert && (
        <div className={styles.modalOverlay} onClick={() => setModalContactOuvert(false)}>
          <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelTitle}>Ajouter un contact</div>

            <form onSubmit={soumettreContact}>
              <label className={styles.formLabel}>Type de contact</label>
              <select
                className={styles.formInput}
                value={nouveauContact.typeContact}
                onChange={(e) =>
                  setNouveauContact((c) => ({ ...c, typeContact: e.target.value as TypeContact, organisation: "", detail: "" }))
                }
              >
                {(Object.keys(LIBELLE_TYPE_CONTACT) as TypeContact[]).map((type) => (
                  <option key={type} value={type}>{LIBELLE_TYPE_CONTACT[type]}</option>
                ))}
              </select>

              <label className={styles.formLabel}>Prénom</label>
              <input
                className={styles.formInput}
                value={nouveauContact.prenom}
                onChange={(e) => setNouveauContact((c) => ({ ...c, prenom: e.target.value }))}
                required
              />

              <label className={styles.formLabel}>Nom</label>
              <input
                className={styles.formInput}
                value={nouveauContact.nom}
                onChange={(e) => setNouveauContact((c) => ({ ...c, nom: e.target.value }))}
                required
              />

              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                className={styles.formInput}
                value={nouveauContact.email}
                onChange={(e) => setNouveauContact((c) => ({ ...c, email: e.target.value }))}
                required
              />

              <label className={styles.formLabel}>Téléphone (facultatif)</label>
              <input
                className={styles.formInput}
                value={nouveauContact.telephone}
                onChange={(e) => setNouveauContact((c) => ({ ...c, telephone: e.target.value }))}
              />

              <label className={styles.formLabel}>{LABELS_CHAMPS_CONTACT[nouveauContact.typeContact].organisation}</label>
              <input
                className={styles.formInput}
                value={nouveauContact.organisation}
                onChange={(e) => setNouveauContact((c) => ({ ...c, organisation: e.target.value }))}
                required
              />

              <label className={styles.formLabel}>{LABELS_CHAMPS_CONTACT[nouveauContact.typeContact].detail}</label>
              {nouveauContact.typeContact === "financeur" ? (
                <select
                  className={styles.formInput}
                  value={nouveauContact.detail}
                  onChange={(e) => setNouveauContact((c) => ({ ...c, detail: e.target.value }))}
                >
                  <option value="">—</option>
                  {TYPES_FINANCEUR.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              ) : (
                <input
                  className={styles.formInput}
                  value={nouveauContact.detail}
                  onChange={(e) => setNouveauContact((c) => ({ ...c, detail: e.target.value }))}
                />
              )}

              <div className={styles.contactInfoNote}>
                ℹ️ Ce contact ne recevra jamais de mot de passe. Il reçoit uniquement les e-mails de confirmation,
                report et rappel générés automatiquement par MediPlan.
              </div>

              <div className={styles.btnRow}>
                <button type="submit" className={styles.btnPrimaryVert}>
                  Enregistrer le contact
                </button>
                <button type="button" className={styles.btnGris} onClick={() => setModalContactOuvert(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
