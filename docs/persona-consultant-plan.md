# Persona — Consultant

Plan only. No code has been written for this persona yet. Verification is `npm run build` and
`npm run lint` only: no tests, screenshots or videos.

## References

| What                   | Reference                                                              | Used for                                                                                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Deck slide (main spec) | `_reference/deck/consultant.png`                                       | The persona, the key features (Sizing, Tender texts, CAD & BIM files and documents, My projects) and the sizing scenario: Products & services → mega menu → "Size your product" card → "Start sizing". |
| Earlier plans          | `docs/phase2-module3-plan.md`, `docs/persona-service-provider-plan.md` | Sizing, results, Save as project and My Projects as built; the variant and model pages, BIM/CAD and Documentation tabs.                                                                                |

The slide shows a Grundfos mega menu. We use it for layout only: the Sulzer mega menu already
has its own "Size your product" card (photo, text, **Start sizing**). No Grundfos wording or
images.

## What exists

- **Entry:** the mega menu "Products & services" has the "Size your product" card with "Start
  sizing", linking to `/sizing`.
- **Sizing** (module 3): the dense "Select parameters" form, the range chart, and
  `/sizing/results` with filters.
  - The results have a toolbar: compare, curves, bookmark, Add to project.
  - There is a selection bar, **Save as project** / **Update project**, and the
    `SizingResultPanel` drawer. Its "compare" mode overlays up to 3 curves with a small key
    figures table.
- **Projects** (`ProjectsContext`, `localStorage`):
  - Projects have members `{ name, role }`, client, items (sized variants with a duty point)
    and sizing records.
  - Statuses are Draft / In progress / Quoted.
- **My Projects page:**
  - Project list on the left.
  - The main area has a header with icon buttons, the "Sizings" section and the "Sulzer
    products" table.
  - The right panel has tabs: Project details, Members (read-only list), Documents (data
    sheets and curves, download toasts).
- **CAD and documents:**
  - The product BIM/CAD tab: pick model and format, a 2 s "generating" step, then download
    (`useFileGeneration`, `cad.ts`).
  - The Documentation tab: type chips, language, preview, ZIP of the selection.
- **Shared UI:** `Modal`, `Drawer`, toast with action, `SegmentedToggle`, `SelectField`,
  `ChipGroup`, `TabBar`/`useHashTab`, `Avatar`, `SizingCurveChart` (several curves),
  `KeyFigures`, `downloadText` (real file download), `NumberedStep`.
- **Sign-in:** one demo user (Emma Lindqvist, Nordvatten Utilities, maintenance manager). The
  presenter panel (Shift+D) only has "Sign in as demo user".

## Demo path

Sign in as the consultant before recording (Shift+D → **Sign in as consultant**).

| #   | Step                 | Route                                | What the viewer sees                                                                                                                                                                                  |
| --- | -------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Products & services  | any page                             | Header shows the consultant's name and avatar. Click **Products & services**: the mega menu with the "Size your product" card on the right.                                                           |
| 2   | Start sizing         | `/sizing?product=ahlstar`            | Size Product panel and the dense form, prefilled with the consultant's demo duty (`consultantDemo`: e.g. 180 m³/h @ 42 m, "Raw water intake"). Range chart lights up.                                 |
| 3   | Results              | `/sizing/results?…`                  | "18 best matches". Presenter ticks 3 rows → selection bar "3 selected · **Compare** · Add to project · Save as project".                                                                              |
| 4   | Compare alternatives | `/sizing/compare?…&ids=a,b,c`        | Full-width compare page: 3 columns side by side, overlaid curves on top, key figures with the best value per row marked, differences highlighted, life cycle cost bars. **Choose** on one column.     |
| 5   | Save as project      | dialog                               | Save dialog (exists) with the chosen alternative ticked and "Include tender texts" and "Include CAD/BIM" options. Save → toast "Project saved" → **Open project**.                                    |
| 6   | My project: products | `/my-projects/lakeside-wtp#products` | New project at the top of the list; sizings and products as today; status chip "Draft".                                                                                                               |
| 7   | Tender texts         | `…#tender`                           | Generated tender text per product (structured sections), language and detail level, **Copy**, **Download (.docx/.txt)**, "Add to documents". Typing effect only on first generation (600 ms).         |
| 8   | CAD & BIM            | `…#cad`                              | One row per product with format chips (Revit, IFC, STEP, DWG, DXF, PDF); **Download all for project** → 2 s progress → ZIP toast; files appear in Documents.                                          |
| 9   | Documents            | `…#documents`                        | Every project document grouped (data sheets, curves, tender texts, CAD/BIM packages, uploads), preview, select and download as ZIP, fake upload.                                                      |
| 10  | Members and comments | `…#discussion` + right panel         | Invite a colleague (dialog: email, role, access) → pending member; comment thread with an @mention; activity feed records every step. Status → "For review". **Project report** opens the print view. |

---

## 1. Consultant persona

A second demo user, switched in the presenter panel. The current user stays the default, so
nothing changes for the earlier recordings.

```ts
// src/config/demo.ts
export const personas = {
  maintenance: demoUser, // Emma Lindqvist, Nordvatten Utilities AB (unchanged)
  consultant: {
    firstName: 'Alex',
    name: 'Alex Berger',
    initials: 'AB',
    company: 'Kustlinje Engineering AB', // fictional consultancy
    role: 'Senior process consultant, water',
    email: 'alex.berger@kustlinje.example',
  },
} satisfies Record<PersonaId, User & { email: string }>

export const consultantDemo = {
  productId: 'ahlstar',
  applicationId: 'surface-water-intake',
  flow: 180,
  head: 42,
  projectName: 'Lakeside WTP – raw water intake pumps',
  client: 'Nordvatten Utilities AB',
} as const
```

- **Auth:** `AuthContext` stores `{ signedIn, persona }` (still only flags in
  `localStorage`). `signIn(persona = 'maintenance')`; `user` is
  `personas[persona]`. **Shift+D** gets "Sign in as consultant" next to "Sign in as demo
  user".
- **Every "demo user" reference becomes the current user:** the account menu, project
  ownership, "Created by", the quotation and checkout prefill, the order confirmation email.
  `ProjectsProvider` and `CartProvider` read it from `useAuth`.
- **Projects per persona:** storage keys `sz-demo-projects-v3-<persona>` and seed sets
  `projectsSeed[persona]`.
  - The consultant gets two seed projects so the list isn't empty: "Harbour district
    booster station" (Quoted) and "Mill Creek pump station study" (In progress, with
    members and comments).
  - The maintenance seed is unchanged.
- **Sizing defaults:** `/sizing` without parameters uses `consultantDemo` when the consultant is
  signed in, else `sizingDemo`.

## 2. Compare view

The drawer's compare mode stays for a quick look. The consultant needs a real side-by-side
page:

- **Route:** `/sizing/compare?<all sizing params>&ids=<variantId>,<variantId>[,<variantId>]`
  (2–3). All sizing params are kept, so Back returns to the same results.
  - **Opened from:** the selection bar's new **Compare (n)** button, and the toolbar's
    existing compare icon (both move here).
  - **Out-of-range selections:** with 1 or more than 3 selected, the button explains why it
    can't open.
- **Layout:**
  - A sticky header row with one column per alternative: rank badge, image, name, product
    number or "On request", price (signed in), ✕ to remove. A "+ Add alternative" slot shows
    when there are 2.
  - **Curves:** one `SizingCurveChart` with all 2–3 curves overlaid (existing multi-series
    mode, series colours match the column headers), duty point and operating points.
  - **Key figures:** `keyFigureRows` for each column in a table. For each row the best value
    gets a green check and "Best"; values that differ from the first column are tinted.
    "Show only differences" toggle.
  - **Life cycle cost:** stacked horizontal bars per alternative (purchase, energy,
    maintenance), same scale; hand-made SVG like the other charts.
  - **Configuration:** material, seal, coupling, poles and motor side by side, differences
    tinted.
  - **Per column:** **Choose** (marks it as the preferred alternative, the other columns get
    "Alternative 2/3") and **View curve** (opens the existing detail drawer).
- **Footer bar:**
  - **Save as project** opens the existing `SaveSizingDialog` with all compared alternatives
    ticked and the chosen one marked "Preferred".
  - **Download comparison (PDF)** shows a toast.
- **Copy:** `sizingComparePage` in `src/data/sizingPages.ts`.

## 3. Tender texts

A tender text is the specification paragraph a consultant pastes into the tender documents.
It is generated from data the project already has, so it is deterministic.

- **`src/lib/tenderText.ts`:** `tenderText(item, project, options): TenderText`, built from
  the item's `PumpVariant`, its `evaluateVariant` result, the duty point and the project's
  liquid. It returns ordered sections:
  1. **Scope:** "Supply of 1 (one) horizontal end-suction centrifugal pump, back pull-out
     design, …"
  2. **Duty point:** Q, H, liquid, temperature, NPSHa note.
  3. **Pump:** type, size, impeller Ø, speed, efficiency at duty, connections DN.
  4. **Materials:** casing, impeller, shaft, wear rings.
  5. **Shaft seal.**
  6. **Motor:** power, poles, IE class, voltage, frequency, enclosure.
  7. **Baseplate and coupling.**
  8. **Testing and documentation:** performance test to ISO 9906 grade 2B, documentation list.
  9. **Reference product:** "Sulzer AHLSTAR … or equivalent", product number.
- **Options:**
  - Detail: _Short_ (sections 1–3 and 9) or _Full_.
  - Wording: _Brand-specific_ (names Sulzer) or _Neutral_ ("or equivalent" spec, brand only in
    section 9).
  - Language: _English_ only for the demo; the select is shown with English and Swedish, and
    Swedish is marked "coming soon". Open question.
- **Wording:** every sentence template lives in `src/data/tenderTexts.ts`, never in the
  generator.
- **UI:** the **Tender texts** tab in the project.
  - **Left:** list of products with a check per product.
  - **Right:** the formatted text, with section headings and the duty values in bold.
  - **Generate tender texts** first shows the text appearing section by section (one 600 ms
    reveal, then instant).
  - **Actions:**
    - **Copy text:** clipboard plus toast.
    - **Download .docx:** a real Word-readable file, built as HTML with a Word MIME type
      through `downloadText`. No library needed.
    - **Download .txt:** a real file.
    - **Add to documents:** adds a project document of kind "tender".
- **From the results page:** a "Tender text" icon in `SizingResultPanel` opens the same text for
  one result in a drawer section (no project needed).

## 4. Project-level CAD/BIM and documents

- **CAD & BIM tab** in the project:
  - One row per product item, with format chips: Revit, IFC (BIM object), STEP (3D), DWG, DXF,
    PDF (2D). LOD select for BIM (LOD 200 / 300).
  - **Generate** per row, or **Download all for project** (one ZIP: "<ref no>_CAD-BIM.zip").
    It runs the existing 2 s generation progress (`useFileGeneration`) and gives a toast with
    file count and size.
  - Generated packages are added to Documents as kind "cad"/"bim", deterministic sizes.
  - The data comes from `cad.ts` file specs per format, mapped from a sized variant to its
    hydraulic's catalogue model. Where there is no CAD for a size, the row says "On request"
    with a "Request CAD" button (toast).
- **Documents tab** (replaces the small Documents list in the right panel):
  - Grouped: Data sheets, Performance curves, Tender texts, CAD & BIM, Reports, Uploaded.
  - Each row: file-type icon, title, format, size, "Added by <member> · <date>", preview
    (reuses `DocumentPreview` / `DocumentCover`) and download.
  - Select and **Download selected (ZIP)**, as on the product Documentation tab.
  - **Upload:** a drop zone and button. Picked files are listed with name and size only (never
    read or stored as content); they're kept in the project as metadata.
  - Data sheets and curves come from the items and sizings as today; the rest from
    `project.documents`.

## 5. Collaboration in My projects

The right column becomes **Project details · Members · Activity**. The main area gets tabs:
**Products · Tender texts · CAD & BIM · Documents · Discussion**, in the URL hash.

- **Status:**
  - The status chip in the header becomes a menu: Draft → In progress → For review →
    Quoted → Ordered → Closed. New statuses are added to `ProjectStatus` and its chip colours.
  - Changing it logs an activity, and "For review" asks for reviewers (members with access ≥
    Editor) in a small dialog.
- **Members:**
  - Avatar, name, company, role, access (Owner / Editor / Viewer), status (Active /
    Invited).
  - **Invite** dialog: email, role, access, message. It adds a member with status "Invited"
    and initials avatar, plus a toast "Invitation sent to …". "Resend" and "Remove" are in a
    row menu.
  - A fixed suggestion list of colleagues is offered as you type.
- **Comments (Discussion tab):**
  - A thread per project. Each comment can be tied to a product ("on AHLSTAR 125-100-315").
  - **@mentions:** typing @ shows the members; mentions render as chips.
  - Posting adds the comment instantly, as the current user, "Just now". The seed project has
    3 comments from other members.
  - Reply (one level), resolve.
- **Activity:** an append-only list, newest first, icon per kind:
  - created, sizing saved, products added, status changed, member invited, comment, tender
    text generated, CAD package generated, document uploaded, report created.
  - Every action above writes one entry through `ProjectsContext`. Shown in the right panel
    (last 8) and in full on the Discussion tab.
- **Project report:** `/my-projects/:projectId/report`, a print view without site header or
  footer, like the variant print page.
  - **Content:** cover (project, client, consultant, date), members, duty points, the
    preferred product and alternatives with curves (`SizingCurveChart`), key figures, tender
    texts, the document list.
  - "Print or save as PDF" opens the browser print dialog. Creating the report adds a
    "report" document and an activity entry.
- **Deterministic times:** times are labels, not clocks. Seed entries have fixed dates; new
  ones are "Just now", and older "Just now" entries become "Today" when the page reloads.

## 6. Data and types (`src/types.ts`)

```ts
export type PersonaId = 'maintenance' | 'consultant'

export type ProjectStatus = 'Draft' | 'In progress' | 'For review' | 'Quoted' | 'Ordered' | 'Closed'
export type ProjectAccess = 'owner' | 'editor' | 'viewer'

export type ProjectMember = {
  id: string
  name: string
  initials: string
  email: string
  company: string
  role: string
  access: ProjectAccess
  status: 'active' | 'invited'
}

export type ProjectComment = {
  id: string
  authorId: string // ProjectMember id
  at: string // display label, e.g. "Yesterday 14:20", "Just now"
  text: string // plain text; mentions as @[member-id]
  itemId?: string // product the comment is about
  parentId?: string // one reply level
  resolved?: boolean
}

export type ProjectActivityKind =
  | 'created'
  | 'sizing'
  | 'items'
  | 'status'
  | 'member'
  | 'comment'
  | 'tender'
  | 'cad'
  | 'upload'
  | 'report'

export type ProjectActivity = {
  id: string
  kind: ProjectActivityKind
  actorId: string
  at: string
  /** Rendered with copy from src/data/projectPages.ts, e.g. { status: 'For review' }. */
  detail: Record<string, string>
}

export type ProjectDocumentKind =
  'datasheet' | 'curves' | 'tender' | 'cad' | 'bim' | 'report' | 'upload'

export type ProjectDocument = {
  id: string
  kind: ProjectDocumentKind
  title: string
  format: string // PDF, DOCX, ZIP, …
  size: string
  addedBy: string // member id
  at: string
  itemId?: string
}

export type TenderSection = { id: string; title: string; paragraphs: string[] }
export type TenderText = {
  itemId: string
  language: 'en' | 'sv'
  detail: 'short' | 'full'
  neutral: boolean
  sections: TenderSection[]
}

// Project gains:
//   members: ProjectMember[]  (replaces { name, role })
//   comments: ProjectComment[]
//   activity: ProjectActivity[]
//   documents: ProjectDocument[]
//   preferredItemId?: string   (set from the compare view's "Choose")
//   tenderOptions?: Pick<TenderText, 'language' | 'detail' | 'neutral'>
```

- **`ProjectsContext` new actions:**
  - `setStatus`, `inviteMember`, `removeMember`
  - `addComment`, `resolveComment`
  - `addDocument`, `uploadDocuments`
  - `setPreferred`, `setTenderOptions`
  - Each one also appends an activity entry.
- **Migration:** the storage key goes to v3, and old v2 data is dropped (seeds reload), as when
  sizings were added.
- **Data files:**
  - `src/data/projects.ts` gets per-persona seeds with members, comments, activity and
    documents.
  - New: `src/data/colleagues.ts` (invite suggestions), `src/data/tenderTexts.ts` (sentence
    templates).
  - Copy additions in `src/data/projectPages.ts` and `src/data/sizingPages.ts`.
- **Content to confirm:** every name, company, comment, tender wording and file size goes into
  `docs/content-to-confirm.md` under "Consultant".

## 7. Components

### New

| Folder                 | Component             | Purpose                                                                                |
| ---------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| `components/sizing/`   | `CompareView`         | The compare page body: columns, chart, key figure table, LCC bars, configuration.      |
|                        | `CompareColumnHeader` | Rank, image, name, number, price, remove, Choose.                                      |
|                        | `CompareTable`        | Rows × alternatives, best value marked, differences tinted, "only differences" filter. |
|                        | `LifeCycleCostBars`   | Stacked SVG bars per alternative.                                                      |
| `components/tender/`   | `TenderTextView`      | Formatted sections with bold values.                                                   |
|                        | `TenderTextTab`       | Product checklist, options, Generate, Copy/Download/Add to documents.                  |
| `components/projects/` | `ProjectTabs`         | The project's main tabs (hash).                                                        |
|                        | `ProjectCadTab`       | Rows per product with format chips, Generate / Download all.                           |
|                        | `ProjectDocumentsTab` | Grouped documents, preview, select/ZIP, upload drop zone.                              |
|                        | `DiscussionTab`       | Comment composer and thread, plus the full activity list.                              |
|                        | `CommentComposer`     | Textarea with @mention picker and "about product" select.                              |
|                        | `CommentThread`       | Comments with replies, resolve.                                                        |
|                        | `ActivityFeed`        | Activity entries with icons; compact (right panel) and full.                           |
|                        | `MembersPanel`        | Members with access and status, row menu.                                              |
|                        | `InviteMemberDialog`  | Email (with suggestions), role, access, message.                                       |
|                        | `StatusMenu`          | Status chip as a menu; review dialog for "For review".                                 |
| `pages/`               | `SizingComparePage`   | `/sizing/compare`.                                                                     |
|                        | `ProjectReportPage`   | `/my-projects/:projectId/report`, print view.                                          |

### Reused

- **Sizing:** `SizingCurveChart` (overlay), `KeyFigures`/`keyFigureRows`, `SaveSizingDialog`,
  `SelectionBar`, `evaluateVariant`, `sizingQuery`.
- **Projects:** `ProjectItemsTable`, `ProjectSizings`, `ProjectList`, `ProjectStatusChip`
  (more colours), `ProjectDetailsPanel` (details tab).
- **Documents and CAD:** `DocumentPreview`, `DocumentCover`, `DocumentRow` patterns,
  `FileTypeIcon`, `CadFormatCard`, `useFileGeneration`, `downloadText`.
- **Shared UI:** `Modal`, `Drawer`, `TabBar`/`useHashTab`, `SegmentedToggle`, `SelectField`,
  `ChipGroup`, `Avatar`, `IconButton`, the toast, `PageHeaderBand`, `SulzerLogo` (report).
- **Print view:** the `VariantPrintPage` layout pattern for the report.

## 8. Routes

| Route                              | Page                | Notes                                                                       |
| ---------------------------------- | ------------------- | --------------------------------------------------------------------------- |
| `/sizing`                          | `SizingPage`        | Consultant defaults when that persona is signed in.                         |
| `/sizing/results`                  | `SizingResultsPage` | Selection bar gains **Compare (n)**; the compare icon goes to the page.     |
| `/sizing/compare?…&ids=a,b,c`      | `SizingComparePage` | 2–3 ids; all sizing params kept for Back and Save as project.               |
| `/my-projects/:projectId#products` | `MyProjectsPage`    | Tabs `#products` (default), `#tender`, `#cad`, `#documents`, `#discussion`. |
| `/my-projects/:projectId/report`   | `ProjectReportPage` | Outside the site layout, like the print views.                              |

`scripts/qa-screenshots.mjs` gets the new routes (not run in this persona).

## Open questions

1. **Persona details:** name, company and role of the consultant, and whether the client
   should be Nordvatten (shared with the other persona) or a different municipality.
2. **Tender text language:** English only, or English and Swedish? The structure supports
   more languages; the wording would need translating.
3. **Tender text wording:** should it follow a Sulzer template? We will write our own neutral
   specification style unless Sulzer has one.
4. **Real files:** are real .docx/.txt downloads wanted for tender texts? The plan says yes,
   as the BOM CSV is real. CAD/BIM and ZIPs stay simulated (toast only).
5. **Statuses:** is "Ordered" / "Closed" right for a consultant's project, or should it end at
   "Tender issued"?
6. **Compare:** is a separate page right, or should compare stay in the drawer but larger?
   The plan recommends the page: it is easier to show on camera and it can be shared.

## Build order (once approved)

1. **Persona:** types, `demo.ts`, `AuthContext` persona, Shift+D, "current user"
   replacements, projects per persona (v3 storage, seeds).
2. **Compare page:** route, selection bar entry, view, Save as project from compare.
3. **Project page tabs:** `ProjectTabs`, status menu with new statuses, activity plumbing in
   `ProjectsContext`.
4. **Tender texts:** generator, copy, tab, real downloads, add to documents.
5. **CAD & BIM tab** and the **Documents tab** with upload.
6. **Collaboration:** members and invites, comments with @mentions, Discussion tab, activity
   feed.
7. **Project report** print view.
8. `content-to-confirm.md`, QA route list. Build and lint after each step.
