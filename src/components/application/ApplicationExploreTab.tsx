import { applicationPage as copy } from '../../data/catalogPages'
import { knowledgeFor } from '../../lib/catalog'
import type { Application, ExploreIntro } from '../../types'
import { ExploreIntroBand } from '../ExploreIntroBand'
import { HelpSection } from '../HelpSection'
import { KnowledgeGrid } from '../KnowledgeGrid'

type ApplicationExploreTabProps = {
  application: Application
  intro: ExploreIntro
}

/** Explore tab: intro band, knowledge cards, then "How can we help you?". */
export function ApplicationExploreTab({ application, intro }: ApplicationExploreTabProps) {
  const knowledge = knowledgeFor(application.knowledgeItemIds ?? [])

  return (
    <>
      <ExploreIntroBand intro={intro} />
      {knowledge.length > 0 && (
        <KnowledgeGrid title={copy.knowledge.title} text={copy.knowledge.text} items={knowledge} />
      )}
      {application.helpCards && (
        <HelpSection title={copy.help.title} text={copy.help.text} cards={application.helpCards} />
      )}
    </>
  )
}
