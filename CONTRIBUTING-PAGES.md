# Écrire ou étoffer une page de Flood Cost by ZIP (us-flood-cost)

Notice pour qui écrit les pages. À lire en entier avant d'écrire, avec `~/Documents/GitHub/RECETTE-SITE.md`.

**Le site** : le coût réel de l'assurance inondation aux États-Unis par État, comté et code ZIP, et la hausse à venir
(plafond légal de 18 % par an, 25 % pour les résidences secondaires et quelques autres cas). **Anglais américain seul**,
sous `/en/`. Éditeur : la société **Radif Partners** (jamais un nom de personne). Ni « FEMA » ni « NFIP » dans le nom du
site ni dans le logo ; le site ne se présente jamais comme l'administration et n'est affilié à personne.

**La phrase de valeur ajoutée** (accueil, À propos, rapport SERP) : `VALUE` dans `src/content/home.ts`. Rapport SERP :
`~/Documents/GitHub/reports/us-flood-cost-serp-2026-10-19.md`.

## Interdits

- On ne vise pas « flood zone map » et on n'affiche aucune carte.
- Aucun lien vers un assureur, un agent, un site de devis ; aucun conseil personnalisé (« you should buy ») ; aucune
  promesse. Ne jamais lier ni copier homecostsbystate.com, taxratesbystate.com ni aucun site du portefeuille
  (`~/Documents/GitHub/_trame/domaines-ovh.txt`), pas de « nos autres sites ».
- **Un chiffre incertain ne se publie pas.** Tout chiffre vient du kit (`K.…`). Un fait propre à un État (loi, programme,
  agence) se vérifie sur une page officielle .gov et se lie avec `h.ext(url, texte)`. Tout chiffre 2027 annoncé après le
  2026-10-19 est « à venir », jamais présenté comme en vigueur.
- Ni tiret cadratin ni demi-cadratin, ni les tournures listées dans `tests/pages.test.ts` (BANNED).

## D'où viennent les chiffres

| Donnée | Source | Fichier |
|---|---|---|
| Médianes 2023 par État, comté, ZIP (payé, prix « risk-based », expositions, tranches) | FEMA, *Cost of Flood Insurance for Single-Family Homes*, Examples 1 à 4 (polices en vigueur au 2023-08-31, tarifs du 2023-02-01) | `src/data/national.json`, `states.json`, `counties.json`, `public/data/*.json` |
| Coût médian des polices en vigueur, prix plein médian, part encore plafonnée | OpenFEMA *NFIP Redacted Policies v3* (unifamilial, occupancyType 1 et 11), au `policiesDate` | idem, champs `policies`, `pol` |
| Sinistres payés 2016-2025, événements | OpenFEMA *NFIP Redacted Claims v3* | champs `claims`, `events` |
| Plafonds 18 / 25 %, frais (FPF 47 $, HFIAA 25 / 250 $, RFA 18 %), limites 250 000 / 100 000 $, franchises, attente de 30 jours, échéance du programme | 42 U.S.C. 4012a, 4013, 4014, 4015, 4015a ; 44 CFR 61 et 64 ; FEMA Flood Insurance Manual (oct. 2025) ; bulletin W-26001 ; Public Law 119-103 | `src/data/params-2026.json` |

Seuil de publication : une médiane de ZIP ou de comté sur moins de 10 polices ou sinistres n'est pas publiée (`MIN_N`).

## Reconstruire les données

Script rejouable, données brutes jamais versionnées (seuls les agrégats le sont) :

    python3 -m venv .venv && .venv/bin/pip install duckdb openpyxl pytz
    .venv/bin/python scripts/build-data.py --raw .cache/raw            # télécharge ce qui manque (environ 4 Go)
    .venv/bin/python scripts/build-data.py --raw .cache/raw --no-policies   # sans relire le fichier des polices

fema.gov répond 403 aux scripts pour ses pages et ses xlsx : le script prend la copie de la Wayback Machine des deux
classeurs FEMA ; les fichiers OpenFEMA (parquet) répondent à curl. Vérifier les totaux imprimés à la fin : contrôle de
méthode au 2023-08-31 contre les 3 149 679 polices et 786 $ de l'Example 2 de FEMA. Les jeux v2 (FimaNfip*) ont été gelés
au 2026-06-01 et retirés en octobre 2026 : utiliser v3.

## Conditions de réutilisation d'OpenFEMA (lues le 2026-10-19)

Page : https://www.fema.gov/about/openfema/terms-conditions (dernière mise à jour 22 janvier 2025). À respecter :

- citer le jeu de données et sa version (page du jeu ou URL de l'API) et la date de récupération ;
- afficher la mention exacte : « This product uses the Federal Emergency Management Agency's OpenFEMA API, but is not
  endorsed by FEMA. The Federal Government or FEMA cannot vouch for the data or analyses derived from these data after
  the data have been retrieved from the Agency's website(s). » (présente sur Méthode, À propos et dans llms.txt) ;
- ne pas utiliser les logos ou sceaux de FEMA ou du DHS ; ne pas modifier les données en les attribuant à FEMA ;
- usage statistique seulement, aucune tentative de réidentification, aucune décision sur les droits d'une personne ;
- FEMA peut retirer l'autorisation : supprimer les copies si elle le demande.

La page ne dit pas que les données sont dans le domaine public : ne pas l'écrire.

## Les fichiers d'une page (une page = un fichier)

| Page | Fichier | Route |
|---|---|---|
| Sujet + calculateur | `src/content/guides/<id>.ts` (`defineGuide`) | `/en/<slug>/` |
| État | `src/content/states/<slug>.ts` (`defineState`, slug = clé de `states.json`) | `/en/flood-insurance/<slug>/` |
| Accueil | `src/content/home.ts` | `/en/` |

Pages prévues : `src/lib/planned.ts`. Modèles (copier la structure, jamais les phrases) :
`src/content/guides/flood-insurance-by-state.ts` et `src/content/states/texas.ts`.

Le gabarit affiche seul : H1, `intro`, le calculateur (`tool`, réglé par `toolArg`), le chapeau replié (`resume`), le
corps (`body`), la FAQ, les pages liées, les sources. Sur un État : H1 fixé, recherche ZIP / comté réglée sur l'État,
tableaux générés (comtés, tranches de prix, événements) sous le corps.

### Champs

| Champ | Règle |
|---|---|
| `title` | 50 à 60 caractères rendus, terme-clé en tête, « 2026 », unique ; jamais en tête le pays, un mot d'outil, une rubrique, une question |
| `description` | 150 à 160 caractères rendus, « 2026 », unique |
| `resume` | un seul paragraphe de 120 mots ou plus : la réponse directe, chiffrée |
| `body` | guides 650 mots de prose au moins, États 300 ; au moins un `h.mini(kind, { t, p, d })`, un seul par type |
| `faqs` | 3 à 8 questions (États : 3), réponses de 40 à 90 mots, question unique sur tout le site |
| `related` | 3 ou 4 identifiants de pages |
| `sources` | clés de `params-2026.json > sources` (guides) |

Outils (`src/lib/tool-specs.ts`) : `glide`, `five`, `state`, `zone`, `claims`, `rank`, `waiting`, `coverage`, `private`,
`monthly`, et `lookup` (recherche ZIP / comté, outil de page seulement).

## Contrôler

    PAGE_FILES=<id>,state:<slug> npx vitest run tests/pages.test.ts
    npx vitest run tests/pages.test.ts >/dev/null; python3 scripts/sim-pages.py --only <id>    # 26 % au plus

Puis, une seule fois et jamais en parallèle : `npm run check` et les contrôles de la recette.
