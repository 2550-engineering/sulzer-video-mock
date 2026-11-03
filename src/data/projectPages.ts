import type { NavItem, ProjectAccess, ProjectActivityKind } from '../types'

/** Copy for "Add to project" and /my-projects. */
export const addToProjectDialog = {
  title: (count: number) => `Add ${count} ${count === 1 ? 'product' : 'products'} to a project`,
  close: 'Close',
  signIn: {
    title: 'Sign in to save to My projects',
    text: 'Projects keep your sized pumps, curves and documents together, and you can share them with your team.',
    action: 'Sign in',
  },
  choose: 'Choose a project',
  products: (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`,
  newProject: 'Create a new project',
  newProjectName: 'Project name',
  newProjectPlaceholder: 'e.g. Riverside intake – raw water pumps',
  /** Used when the name field is left empty. */
  newProjectDefault: 'New project',
  cancel: 'Cancel',
  save: 'Save',
  added: (count: number, project: string) =>
    `Added ${count} ${count === 1 ? 'product' : 'products'} to ${project}`,
  open: 'Open project',
}

export const myProjectsPage = {
  breadcrumb: [{ label: 'Products & services', to: '/products' }] satisfies NavItem[],
  title: 'My Projects',
  advanced: 'Advanced My Projects',
  list: {
    scope: 'Show',
    scopes: { active: 'Active projects', all: 'All projects' },
    newProject: 'New project',
    sort: 'Sort',
    sorts: { date: 'By date', name: 'By name' },
    search: 'Search project',
    products: (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`,
    empty: 'No projects match your search.',
  },
  toolbar: {
    print: 'Print project report',
    download: 'Download project package',
    edit: 'Edit project details',
    copy: 'Copy project',
    delete: 'Delete project',
    noProducts: 'Add products to the project first',
  },
  toasts: {
    copy: (name: string) => `A copy of ${name} will appear in your list`,
    delete: 'Only the project owner can delete a project',
    margins: 'Sale prices and margins are part of Advanced My Projects',
    shared: (name: string) => `Project shared with ${name}`,
    sharedDetail: (company: string) => `${company} can now follow it in mySulzer`,
    quotation: (id: string) => `Quotation ${id} created`,
    quotationDetail: (company: string) => `Draft for ${company}, on your letterhead`,
    client: (company: string) => `Client account set to ${company}`,
    columns: 'Column settings are part of Advanced My Projects',
    document: (name: string) => `Download started: ${name}`,
  },
  header: {
    rename: 'Rename project',
    nameLabel: 'Project name',
    status: 'Change status',
    client: 'Client',
    site: 'Site',
    deadline: 'Deadline',
    projectId: 'Project ID',
    notSet: 'Not set',
    share: 'Share',
    report: 'Project report',
    renamed: (name: string) => `Project renamed to ${name}`,
    statusChanged: (status: string) => `Status changed to ${status}`,
    alternativeChosen: (letter: string, name: string) => `Alternative ${letter} chosen: ${name}`,
    itemStatus: (position: number, status: string) => `Pos. ${position} set to ${status}`,
  },
  tabs: {
    products: 'Products',
    discussion: 'Discussion',
    documents: 'Documents',
  },
  actions: {
    addProduct: 'Add product',
    addProductTo: '/sizing',
    package: 'Download project package',
    margins: 'Sale price and profit margins',
    columns: 'Customize columns',
    share: 'Share with customer',
    shared: (name: string) => `Shared with ${name}`,
    quotation: 'Create quotation',
    forClient: (company: string) => `For ${company}`,
  },
  sizings: {
    title: 'Sizings',
    columns: {
      sizing: 'Sizing',
      dutyPoint: 'Duty point',
      application: 'Application',
      family: 'Product family',
      products: 'Products',
      date: 'Date',
      actions: 'Actions',
    },
    dutyPoint: (flow: string, head: string) => `Q ${flow} m³/h · H ${head} m`,
    open: 'Open sizing',
    noParams: 'Saved without its parameters, so it can’t be reopened',
    duplicate: 'Duplicate',
    delete: 'Delete',
    deleted: (name: string) => `Sizing ‘${name}’ deleted; its products stay in the project`,
    duplicated: (name: string) => `Sizing ‘${name}’ duplicated`,
    fromSizing: (name: string) => `From sizing ‘${name}’`,
    hits: (count: number) => `${count} hits`,
  },
  items: {
    title: 'Sulzer products',
    alternative: (letter: string) => `Alternative ${letter}`,
    tenderText: 'Tender text',
    tenderTextFor: (name: string) => `Tender text for ${name}`,
    files: 'Files',
    comments: (count: number) => (count ? `Comments (${count})` : 'Comment'),
    commentsFor: (name: string) => `Comments on ${name}`,
    status: 'Status',
    statusFor: (name: string) => `Status of ${name}`,
    alternatives: (tag: string, count: number) =>
      `${tag ? `${tag} · ` : ''}${count} alternatives from a comparison`,
    choose: 'Choose this alternative',
    chosen: (letter: string) => `Alternative ${letter} chosen`,
    notChosen: 'Not in the total',
    filesFor: (name: string) => `CAD, BIM, drawings and documents for ${name}`,
    preferred: 'Selected',
    selectAll: 'Select all products',
    select: (name: string) => `Select ${name}`,
    position: 'Position',
    yourPosition: 'Your position',
    yourPositionLabel: (position: number) => `Your position for position ${position}`,
    curve: 'Curve',
    product: 'Product',
    dutyPoint: (flow: string, head: string) => `${flow} m³/h · ${head} m`,
    onRequest: 'On request +',
    quantity: 'Qty',
    quantityLabel: (name: string) => `Quantity of ${name}`,
    price: 'Price',
    total: 'Total',
    empty: {
      title: 'No products in this project yet',
      text: 'Size a pump for your duty point, or find a product, and add it here.',
      size: 'Size a pump',
      find: 'Find a product',
    },
  },
  panel: {
    tabs: { details: 'Project details', members: 'Members', activity: 'Activity' },
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    saved: 'Project details saved',
    description: 'Description',
    noDescription: 'No description yet.',
    consultant: 'Consultant',
    consultantFirm: 'Consultant firm',
    budget: 'Budget',
    budgetLabel: 'Budget (EUR)',
    address: 'Address',
    requirements: 'Key requirements',
    noRequirements: 'No requirements yet.',
    addRequirement: 'Add requirement',
    requirementLabel: (n: number) => `Requirement ${n}`,
    removeRequirement: (n: number) => `Remove requirement ${n}`,
    requirementPlaceholder: 'e.g. 2 × 220 m³/h at 38 m',
    project: 'Project',
    refNo: 'Ref no.',
    projectId: 'Project ID',
    status: 'Status',
    deadline: 'Deadline',
    noDeadline: 'Not set',
    created: 'Created date',
    createdBy: 'Created by',
    lastModified: 'Last modified date',
    lastModifiedBy: 'Last modified by',
    client: 'Client data',
    clientAccount: 'Client account',
    chooseClient: 'Choose a customer',
    chooseClientHint: 'Pick the customer to share the project with and quote.',
    company: 'Company',
    contact: 'Contact',
    site: 'Site',
    email: 'Email',
    notSet: '–',
  },
  members: {
    invite: 'Invite member',
    invited: 'Invited',
    you: 'You',
    access: { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' } satisfies Record<
      ProjectAccess,
      string
    >,
    accessFor: (name: string) => `Role of ${name}`,
    accessChanged: (name: string, access: string) => `${name} is now ${access}`,
    ownerOnly: 'Only the project owner can change roles',
    dialog: {
      title: 'Invite a member',
      email: 'Email',
      emailPlaceholder: 'name@company.com',
      emailError: 'Enter a valid email address',
      role: 'Role',
      roles: {
        editor: 'Editor – can change products, documents and details',
        viewer: 'Viewer – can read and comment',
      },
      message: 'Message (optional)',
      messagePlaceholder: 'Hi, I’m adding you to the project so you can review the pump selection.',
      cancel: 'Cancel',
      send: 'Send invitation',
      close: 'Close',
      sent: (email: string) => `Invitation sent to ${email}`,
    },
  },
  discussion: {
    title: 'Discussion',
    filters: { all: 'All', project: 'Project' },
    filterLabel: 'Show comments about',
    position: (position: number) => `Pos. ${position}`,
    on: (label: string) => `on ${label}`,
    empty: 'No comments yet. Start the discussion, and @mention a member to notify them.',
    placeholder: 'Write a comment… Type @ to mention a member',
    about: 'About',
    aboutProject: 'The whole project',
    post: 'Post comment',
    reply: 'Reply',
    replyingTo: (name: string) => `Replying to ${name}`,
    cancelReply: 'Cancel reply',
    resolved: 'Resolved',
    resolve: 'Mark as resolved',
    reopen: 'Reopen',
    posted: 'Comment posted',
    mentioned: (names: string) => `${names} will be notified`,
    suggestions: 'Members',
  },
  activityMore: (count: number) => `Show all ${count}`,
  activityLess: 'Show fewer',
  /** One sentence per activity entry; the actor's first name goes in front. */
  activity: {
    title: 'Activity',
    empty: 'Nothing has happened in this project yet.',
    sentence: (
      kind: ProjectActivityKind,
      detail: Record<string, string>,
      project: string,
    ): string => {
      const count = Number(detail.count ?? 1)
      switch (kind) {
        case 'created':
          return `created ${project}`
        case 'sizing':
          return `saved the sizing ${detail.name ?? ''}`
        case 'items':
          return detail.product
            ? `added ${detail.product}${count > 1 ? ` and ${count - 1} more` : ''} to ${project}`
            : `added ${count} products to ${project}`
        case 'status':
          return `changed the status to ${detail.status}`
        case 'member':
          return `invited ${detail.name}`
        case 'access':
          return `made ${detail.name} ${detail.access}`
        case 'comment':
          return detail.position ? `commented on Pos. ${detail.position}` : 'commented'
        case 'tender':
          return 'created tender texts'
        case 'cad':
          return `generated ${detail.file}`
        case 'upload':
          return `uploaded ${detail.file}`
        case 'report':
          return `created the project report`
        case 'details':
          return 'updated the project details'
        case 'renamed':
          return `renamed the project to ${detail.name}`
        case 'alternative':
          return `chose alternative ${detail.alternative}, ${detail.product}`
        case 'itemStatus':
          return `set Pos. ${detail.position} to ${detail.status}`
        case 'share':
          return detail.client === 'yes'
            ? 'shared the project read-only with the client'
            : 'changed who the project is shared with'
      }
    },
  },
  share: {
    title: 'Share project',
    link: 'Project link',
    copy: 'Copy link',
    copied: 'Link copied to the clipboard',
    who: 'Who can open it',
    project: 'Anyone in the project',
    projectHint: (count: number) => `${count} ${count === 1 ? 'member' : 'members'}`,
    specific: 'Specific people',
    specificHint: 'Choose members below',
    client: 'Share read-only with client',
    clientHint: (contact: string, email: string) =>
      contact ? `${contact} can view products, documents and the report, but not edit` : email,
    cancel: 'Cancel',
    save: 'Done',
    close: 'Close',
    saved: 'Sharing settings saved',
  },
  /** "Order project items" dialog. */
  order: {
    action: 'Order project items',
    title: 'Order project items',
    intro:
      'Standard pumps go straight to the cart. Pumps configured to your duty point need a quotation first. Alternatives that were not chosen are left out.',
    position: (position: number) => `Pos. ${position}`,
    quantity: (count: number) => `Qty ${count}`,
    needsQuote: 'Needs quotation',
    needsQuoteDetail: (positions: string) => `Needs quotation: ${positions}`,
    quoteNote:
      'Request a quotation for these from the link; Sulzer replies within one working day.',
    summary: (count: number, total: string) =>
      `${count} ${count === 1 ? 'product' : 'products'} to the cart · ${total}`,
    addToCart: 'Add to cart',
    cancel: 'Cancel',
    close: 'Close',
  },
  newProject: {
    title: 'New project',
    name: 'Project name',
    namePlaceholder: 'e.g. Northern reservoir pump station',
    company: 'Client',
    companyPlaceholder: 'e.g. Älvstad Vatten AB',
    site: 'Site or location',
    sitePlaceholder: 'e.g. Northern reservoir, Älvstad',
    cancel: 'Cancel',
    create: 'Create project',
    close: 'Close',
    created: (name: string) => `Project ${name} created`,
    defaultName: 'New project',
  },
  report: {
    back: 'Back to the project',
    print: 'Print or save as PDF',
    includeTender: 'Include tender texts',
    title: 'Project report',
    preparedBy: (firm: string) => `Prepared by ${firm}`,
    savedTitle: (name: string) => `Project report – ${name}.pdf`,
    information: 'Project information',
    products: 'Products and alternatives',
    alternativesOf: (tag: string) => `Alternatives${tag ? ` for ${tag}` : ''}`,
    chosen: 'Chosen',
    position: (position: number, tag: string) => `Pos. ${position}${tag ? ` · ${tag}` : ''}`,
    quantity: (count: number) => `Qty ${count}`,
    productNumber: (number: string | null) =>
      number ? `Product no. ${number}` : 'Product no. on request',
    dutyPoint: (flow: string, head: string) => `Duty point ${flow} m³/h at ${head} m`,
    tenderTexts: 'Tender texts',
    members: 'Project members',
    footer:
      'Generated with mySulzer. Performance data are calculated for the duty point shown and are subject to confirmation by Sulzer.',
  },
  /** The project's Documents section: uploads and files generated by mySulzer. */
  documents: {
    title: 'Documents',
    upload: 'Upload file',
    uploaded: (name: string) => `Uploaded ${name} to the project`,
    columns: { name: 'Name', size: 'Size', by: 'Uploaded by', date: 'Date', actions: 'Actions' },
    position: (position: number) => `Pos. ${position}`,
    generatedBy: 'mySulzer',
    generated: 'Generated',
    download: (name: string) => `Download ${name}`,
    empty:
      'No documents yet. Upload drawings, P&IDs or reports to share them with the project team.',
    dataSheet: (name: string) => `Data sheet – ${name}.pdf`,
    curves: (sizing: string) => `Performance curves – ${sizing}.pdf`,
    projectSummary: 'Project summary.pdf',
    lccReport: 'Life cycle cost report.xlsx',
    /** Pre-formatted date of the generated files: they are rebuilt on every change. */
    generatedAt: 'Today',
  },
  /** "Files" drawer of a project product. */
  files: {
    title: (name: string) => `Files – ${name}`,
    subtitle: (position: number, tag: string, productNumber: string | null) =>
      [`Pos. ${position}`, tag, productNumber].filter(Boolean).join(' · '),
    close: 'Close',
    sections: { cad: 'CAD & BIM', drawings: 'Drawings', documents: 'Documents' },
    cadIntro:
      'Generate the file in the format your design tool uses. It is also saved to the project documents.',
    generate: 'Generate file',
    generating: (progress: number) => `Generating file… ${progress} %`,
    ready: 'Your file is ready',
    download: 'Download',
    downloadStarted: (name: string) => `Download started: ${name}`,
    savedToProject: 'Also saved to the project documents',
    preview: 'Preview',
    previewing: 'Previewing',
    revision: (rev: string) => `Rev. ${rev}`,
  },
  /** "Download project package" dialog. */
  package: {
    title: 'Download project package',
    intro: (count: number) =>
      `One ZIP with the files you choose for the ${count} ${count === 1 ? 'product' : 'products'} in the project. Alternatives that were not chosen are left out.`,
    include: 'Include',
    options: {
      tender: 'Tender texts',
      tenderHint: 'One .docx, numbered by position',
      datasheets: 'Data sheets',
      curves: 'Performance curves',
      cad: 'CAD',
      bim: 'BIM',
      documents: 'Documents',
      documentsHint: 'Manuals, declarations of conformity and drawings',
      projectFiles: (count: number) => `Project files (${count})`,
      projectFilesHint: 'Uploaded by the project team',
    },
    format: 'Format',
    summary: (files: number, size: string) => `${files} files · about ${size}`,
    fileDetail: (files: number, size: string) => `${files} files · ${size}`,
    cancel: 'Cancel',
    create: 'Create package',
    building: 'Creating your package…',
    projectParts: { tender: 'Tender texts', 'project-files': 'Project files' } as Record<
      string,
      string
    >,
    partFiles: (count: number, size: string) =>
      `${count} ${count === 1 ? 'file' : 'files'} · ${size}`,
    ready: 'Your package is ready',
    download: 'Download',
    downloadStarted: (name: string) => `Download started: ${name}`,
    savedToProject: 'Saved to the project documents',
    close: 'Close',
    nothing: 'Choose at least one kind of file',
  },
  notFound: 'This project does not exist, or it was removed.',
}
