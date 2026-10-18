'use client'

import { Fragment, useId, useRef, useState } from 'react'
import type { Locale } from '@/lib/locale'
import { median, peers, percentile, position, team } from '@/lib/coach-normvault'
import { normvaultIllustrations, normvaultIllustrationsDe } from './normvault-illustrations'
import './coach-normvault.css'

const copy = {
  en: {
    overline: 'NormVault · A shared reference for better coaching',
    title: 'Good in your team.', world: 'Where in the world?',
    intro: 'Your tests tell you what happened.', reference: 'NormVault gives you the reference to understand it.',
    contribute: 'Access and help build a growing movement quality database.',
    compare: 'Compare to MQS database', sj: 'Squat jump height', dj: 'Drop jump height',
    software: 'Software lets you work.', perspective: 'Data gives you perspective.',
    peers: 'Access the MQS database from day one for broader comparisons, richer context, and greater confidence in your decisions.',
    owner: 'YOUR COACHING · OUTSIDE MQS', demo: 'Illustrative demo · Fictional athletes and reference data',
    help: 'Mint points are your athletes; grey points are anonymous peers. Hover, focus or select an athlete. Comparison expands the axes and updates medians and percentiles while preserving measurements. P indicates percentile, not a statistical p-value.',
    team: 'in your team', wider: 'in the demo reference',
    steps: [
      ['Assess', 'Capture the movement.', 'Assess your athlete with force plates, video, or both.'],
      ['Compare', 'See the whole picture.', 'Review kinetics, kinematics, and your MQS profile. Compare results with NormVault.'],
      ['Interpret', 'Find the training priorities.', 'Run AI-powered interpretation to turn the findings into clear training needs.'],
      ['Coach', 'Clear needs. Faster programming.', "MQS delivers the needs analysis. You choose exercises and build your athlete's program with less guesswork."],
    ],
    art: ['Coach observing an athlete on force plates, with a machine-vision camera between them and a phone on the far side.', 'Kinetics, a gait skeleton in double stance, NormVault comparison and an MQS radar profile.', 'Assessment results feed AI interpretation to identify training priorities.', 'MQS training needs handed to the coach for exercise selection and programme creation outside MQS, illustrated with Relay.'],
  },
  de: {
    overline: 'NormVault · Eine gemeinsame Referenz für besseres Coaching',
    title: 'Gut in deinem Team.', world: 'Wo stehst du weltweit?',
    intro: 'Deine Tests zeigen dir, was passiert ist.', reference: 'NormVault liefert die Referenz, um es einzuordnen.',
    contribute: 'Nutze eine wachsende Datenbank für Bewegungsqualität und baue sie mit auf.',
    compare: 'Mit der MQS-Datenbank vergleichen', sj: 'Squat-Jump-Höhe', dj: 'Drop-Jump-Höhe',
    software: 'Software ermöglicht deine Arbeit.', perspective: 'Daten geben dir Perspektive.',
    peers: 'Nutze die MQS-Datenbank vom ersten Tag an für breitere Vergleiche, mehr Kontext und mehr Sicherheit bei deinen Entscheidungen.',
    owner: 'DEIN COACHING · AUSSERHALB VON MQS', demo: 'Beispieldemo · Fiktive Athleten und Referenzdaten',
    help: 'Mintfarbene Punkte zeigen dein Team, graue Punkte anonyme Vergleichsathleten. Wähle einen Athleten per Maus, Tastatur oder Touch aus. Der Vergleich erweitert die Achsen und aktualisiert Mediane und Perzentile. Die Messwerte bleiben gleich. P steht für Perzentil, nicht für einen statistischen p-Wert.',
    team: 'in deinem Team', wider: 'in der Demo-Referenz',
    steps: [
      ['Erfassen', 'Bewegung erfassen.', 'Teste deine Athleten mit Kraftmessplatten, Video oder beidem.'],
      ['Vergleichen', 'Das Gesamtbild sehen.', 'Analysiere Kinetik, Kinematik und dein MQS-Profil. Vergleiche Ergebnisse mit NormVault.'],
      ['Interpretieren', 'Trainingsprioritäten erkennen.', 'Nutze KI-gestützte Interpretation, um aus den Ergebnissen klare Trainingsbedürfnisse abzuleiten.'],
      ['Coachen', 'Klare Bedürfnisse. Schneller planen.', 'MQS liefert die Bedarfsanalyse. Du wählst Übungen aus und erstellst den Trainingsplan deines Athleten mit weniger Rätselraten.'],
    ],
    art: ['Coach beobachtet einen Athleten auf Kraftmessplatten. Dazwischen filmt eine Industriekamera, auf der anderen Seite ein Smartphone.', 'Kinetik, ein Gangskelett in der Doppelstützphase, NormVault-Vergleich und MQS-Radarprofil.', 'Die KI-Interpretation leitet Trainingsprioritäten aus den Ergebnissen ab.', 'MQS übergibt Trainingsbedürfnisse an den Coach. Übungsauswahl und Trainingsplanung erfolgen außerhalb von MQS, hier mit Relay dargestellt.'],
  },
} as const

export function CoachNormvault({ locale }: { locale: Locale }) {
  const c = copy[locale]
  const illustrations = locale === 'de' ? normvaultIllustrationsDe : normvaultIllustrations
  const [compared, setCompared] = useState(false)
  const [selected, setSelected] = useState(0)
  const [tip, setTip] = useState<number | null>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()
  const reference = compared ? [...team, ...peers] : team
  const max = compared ? 65 : 45
  const athlete = team[selected]
  const rank = percentile(reference, 'dj', athlete.dj)
  const teamRank = percentile(team, 'dj', athlete.dj)
  const coordinates = (a: { sj: number; dj: number }, ceiling = max) => ({ left: `${position(a.dj, ceiling)}%`, top: `${100 - position(a.sj, ceiling)}%` })
  const ticks = Array.from({ length: Math.floor(max / 10) }, (_, i) => (i + 1) * 10)

  return (
    <section id="how-it-works" aria-labelledby={`${id}-title`} className={`coach-normvault${compared ? ' compare-on' : ''}`}>
      <div className="normvault-inner" id="normvault">
        <header className="hero">
          <p className="overline">{c.overline}</p>
          <h2 id={`${id}-title`}>{c.title} <em>{c.world}</em></h2>
          <p className="subtitle">{c.intro} <strong>{c.reference}</strong> {c.contribute}</p>
        </header>
        <div className="comparison-stage">
          <div className="demo-toolbar"><label className="compare-control"><input type="checkbox" checked={compared} onChange={event => { setCompared(event.target.checked); setTip(null) }} />{c.compare}</label></div>
          <div className="chart">
            <div className="chart-body">
              <p className="axis-heading">↑ {c.sj} (cm)</p>
              <div className="plot-shell">
                <div className="plot" role="group" aria-label={`${c.sj} / ${c.dj}`} aria-describedby={`${id}-help`} onKeyDown={event => { if (event.key === 'Escape') setTip(null) }}>
                  <div aria-hidden="true">{ticks.map(value => <Fragment key={value}>
                    <i className="grid-line h" style={{ top: `${100 - position(value, max)}%` }} /><i className="grid-line v" style={{ left: `${position(value, max)}%` }} />
                    <span className="tick y" style={{ top: `${100 - position(value, max)}%` }}>{value}</span><span className="tick x" style={{ left: `${position(value, max)}%` }}>{value}</span>
                  </Fragment>)}</div>
                  <i className="median-line vertical" aria-hidden="true" style={{ left: `${position(median(reference, 'dj'), max)}%` }} />
                  <i className="median-line horizontal" aria-hidden="true" style={{ top: `${100 - position(median(reference, 'sj'), max)}%` }} />
                  <div aria-hidden="true">{peers.map((peer, index) => <i key={index} className="peer-dot" style={coordinates(peer, 65)} />)}</div>
                  <div className="team-points">{team.map((person, index) => <button key={person.name} type="button"
                    ref={element => { buttons.current[index] = element }}
                    className={`athlete-dot${index === selected ? ' selected' : ''}`} style={coordinates(person)}
                    aria-label={`${person.name}, ${c.sj} ${person.sj} cm, ${c.dj} ${person.dj} cm`}
                    aria-pressed={selected === index} aria-describedby={tip === index ? `${id}-tip` : undefined}
                    onPointerEnter={event => { if (event.pointerType !== 'touch') setTip(index) }} onPointerLeave={() => setTip(null)}
                    onFocus={() => setTip(index)} onBlur={() => setTip(null)} onClick={() => { setSelected(index); setTip(index) }}
                    onKeyDown={event => { if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) { event.preventDefault(); const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1; buttons.current[(index + delta + team.length) % team.length]?.focus() } }}
                  />)}</div>
                  <span className="selected-label" aria-hidden="true" style={coordinates(athlete)}>{athlete.name.split(' ')[0]}</span>
                  {tip !== null && <div id={`${id}-tip`} className="plot-tip" role="tooltip"><b>{team[tip].name}</b><span>{c.sj} · {team[tip].sj.toFixed(1)} cm</span><span>{c.dj} · {team[tip].dj.toFixed(1)} cm</span><span>DJ · P{percentile(reference, 'dj', team[tip].dj)} {compared ? c.wider : c.team}</span></div>}
                </div>
              </div>
              <p className="axis-x">{c.dj} (cm) →</p>
            </div>
            <p id={`${id}-help`} className="sr-only">{c.help}</p>
            <p className="sr-only" role="status" aria-live="polite">{athlete.name}: {c.dj} {athlete.dj} cm, P{rank} {compared ? c.wider : c.team}.</p>
          </div>
          <figure className="rank-visual" role="img" aria-label={`${athlete.name}: ${c.dj}, P${rank} ${compared ? c.wider : c.team}`}>
            <div className="ruler-frame" aria-hidden="true"><div className="ruler-line" />
              {Array.from({ length: 21 }, (_, i) => <i key={i} className={`ruler-tick${i % 5 === 0 ? ' major' : ''}`} style={{ bottom: `${i * 5}%` }} />)}
              <span className="ruler-number" style={{ bottom: '100%' }}>100</span><span className="ruler-number" style={{ bottom: 0 }}>0</span>
              <i className="rank-ghost" style={{ bottom: `${teamRank}%` }} /><div className="rank-marker" style={{ bottom: `${rank}%` }}><span className="rank-number">P{rank}</span></div>
            </div>
          </figure>
        </div>
        <p className="demo-note">{c.demo}</p>
        <section className="workflow four-step-workflow" aria-labelledby={`${id}-workflow`}>
          <header className="workflow-heading"><h3 id={`${id}-workflow`}>{c.software} <span>{c.perspective}</span></h3><p>{c.peers}</p></header>
          <ol className="coaching-process">{c.steps.map(([title, lead, description], i) => <li key={title} className={`process-step${i === 3 ? ' coach-handoff' : ''}`}>
            <div className={`process-visual${i === 0 ? ' assessment-art' : ''}`} role="img" aria-label={c.art[i]}>
              <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: illustrations[i] }} />
            </div>
            <div className="process-copy"><span className="step-index">0{i + 1}<span className="step-owner">{i === 3 ? c.owner : 'MQS'}</span></span><h4>{title}</h4><p className="step-lead">{lead}</p><p className="step-description">{description}</p></div>
          </li>)}</ol>
        </section>
      </div>
    </section>
  )
}
