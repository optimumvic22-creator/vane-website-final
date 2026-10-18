'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
  type FocusEvent,
  type RefObject,
} from 'react'
import type { Locale } from '@/lib/locale'
import { coachSetupCopy } from '@/lib/coach-setup'
import profile from '@/docs/design/your-setup/round-2/at-a-glance/cmj-profile.json'
import { useCoachReducedMotion } from './coach-primitives'
import type { FigureHandle } from './setup/illustrations'
import './coach-setup.css'

type Copy = (typeof coachSetupCopy)[Locale]
type LabMode = 'mocap-overhead' | 'lab-cameras'
const cmjPath = 'M' + profile.points.map((point) => point.join(',')).join('L')

function Drawing({
  name,
  description,
  still = false,
  reduced,
}: {
  name: string
  description: string
  still?: boolean
  reduced: boolean
}) {
  const stage = useRef<HTMLDivElement>(null)
  const handle = useRef<FigureHandle | null>(null)
  useEffect(() => {
    let cancelled = false
    let mounted: FigureHandle | undefined
    // Each drawing owns its clock and listeners; the engine loads only on the client.
    import('./setup/illustrations').then(({ mountFigure }) => {
      if (cancelled || !stage.current) return
      mounted = mountFigure(stage.current, name, still, reduced)
      handle.current = mounted
      if (!still && stage.current === document.activeElement)
        mounted.setActive(true)
    })
    return () => {
      cancelled = true
      mounted?.destroy()
      handle.current = null
    }
  }, [name, still, reduced])
  return (
    <div
      ref={stage}
      data-hairline={name}
      data-static={still || undefined}
      role="img"
      aria-label={description}
      tabIndex={still ? undefined : 0}
      onFocus={still ? undefined : () => handle.current?.setActive(true)}
      onBlur={still ? undefined : () => handle.current?.setActive(false)}
    />
  )
}

function ForceGraphic({
  estimated,
  spatial,
  copy,
}: {
  estimated: boolean
  spatial: boolean
  copy: Copy
}) {
  return (
    <svg
      viewBox="0 0 168 86"
      role="img"
      aria-label={spatial ? copy.curve3d : copy.curve}
    >
      {spatial ? (
        <g className="force-components">
          <path className="faint" d="M29 4v73M29 18h135M29 41h135M29 74h135" />
          <text x="3" y="20">
            Fx
          </text>
          <text x="3" y="43">
            Fy
          </text>
          <text x="3" y="67">
            Fz
          </text>
          <path
            className="force-component component-x"
            data-axis="x"
            d="M31 18L52 18Q60 18 66 15T78 18Q84 22 90 18L110 18Q115 11 121 18T137 18L163 18"
          />
          <path
            className="force-component component-y"
            data-axis="y"
            d="M31 41L52 41Q60 41 66 45T80 38Q85 36 92 41L110 41Q115 48 121 40T139 41L163 41"
          />
          <g transform="translate(22 54) scale(.85 .30)">
            <path
              className="plot-curve component-z"
              data-axis="z"
              d={cmjPath}
            />
          </g>
        </g>
      ) : (
        <>
          <path className="muted" d="M9 10v57h151" />
          <path className="faint" d="M10 54h148" strokeDasharray="2 4" />
          <path className="faint" d="M70 68v4M94 68v4" />
          <path
            className={`plot-curve ${estimated ? 'estimate-curve' : ''}`}
            d={cmjPath}
          />
        </>
      )}
    </svg>
  )
}

function Signals({
  count,
  spatial = false,
  estimated = false,
  copy,
  reduced,
}: {
  count: number
  spatial?: boolean
  estimated?: boolean
  copy: Copy
  reduced: boolean
}) {
  return (
    <div className="after-selector">
      <div className="signal-pair">
        <div className="signal-item">
          <div className="mechanics-stage">
            <Drawing
              name={spatial ? 'spatial' : `mechanics-${count}`}
              description={
                spatial
                  ? copy.skeleton
                  : count === 3
                    ? copy.staticThree
                    : copy.staticView
              }
              still
              reduced={reduced}
            />
          </div>
          <span>
            {spatial
              ? copy.spatial
              : count > 1
                ? copy.multiple
                : copy.mechanics}
          </span>
        </div>
        <div className="signal-item">
          <div className="force-signal">
            <ForceGraphic estimated={estimated} spatial={spatial} copy={copy} />
          </div>
          <span>
            {estimated
              ? copy.estimated
              : spatial
                ? copy.measured3d
                : copy.measured}
          </span>
        </div>
      </div>
    </div>
  )
}

function Phones({
  count,
  onChange,
  legend,
  visibleLegend = false,
}: {
  count: number
  onChange: (count: number) => void
  legend: string
  visibleLegend?: boolean
}) {
  const name = useId()
  return (
    <fieldset className="phone-choices">
      <legend className={visibleLegend ? undefined : 'sr-only'}>
        {legend}
      </legend>
      <div className="glass-segments">
        {[1, 2, 3].map((value) => (
          <label className="glass-choice" key={value}>
            <input
              type="radio"
              name={name}
              value={value}
              checked={count === value}
              onChange={() => onChange(value)}
            />
            <span>{`${value} ${value === 1 ? 'iPhone' : 'iPhones'}`}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function useHardwareHelp(ref: RefObject<HTMLDivElement | null>) {
  const pinned = useRef(''),
    hovering = useRef(false),
    dismissed = useRef(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const outside = (event: globalThis.PointerEvent) => {
      if (
        event.target instanceof Node &&
        !ref.current?.contains(event.target)
      ) {
        pinned.current = ''
        dismissed.current = false
        setOpen(false)
      }
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        pinned.current = ''
        dismissed.current = true
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [ref])
  return {
    open,
    enter: (event: PointerEvent) => {
      if (event.pointerType !== 'touch') {
        hovering.current = true
        dismissed.current = false
        setOpen(true)
      }
    },
    leave: () => {
      hovering.current = false
      if (!pinned.current && !ref.current?.contains(document.activeElement))
        setOpen(false)
    },
    focus: () => {
      if (!dismissed.current) setOpen(true)
    },
    blur: (event: FocusEvent) => {
      if (!ref.current?.contains(event.relatedTarget)) {
        dismissed.current = false
        if (!hovering.current && !pinned.current) setOpen(false)
      }
    },
    toggle: (key: string) => {
      pinned.current = pinned.current === key ? '' : key
      dismissed.current = !pinned.current
      setOpen(Boolean(pinned.current))
    },
  }
}

export function CoachSetup({ locale }: { locale: Locale }) {
  const copy = coachSetupCopy[locale],
    reduced = useCoachReducedMotion(),
    id = useId()
  const [phone, setPhone] = useState(1),
    [force, setForce] = useState(2)
  const [lab, setLab] = useState<LabMode>('mocap-overhead')
  const apiRef = useRef<HTMLDivElement>(null),
    labRef = useRef<HTMLDivElement>(null)
  const api = useHardwareHelp(apiRef),
    labHelp = useHardwareHelp(labRef)
  const apiId = `${id}-plates`,
    labId = `${id}-lab`,
    headingId = `${id}-heading`
  const title = (index: number) => (
    <div className="column-title">
      <h3 id={`${id}-title-${index}`}>{copy.titles[index]}</h3>
      <p>{copy.subtitles[index]}</p>
    </div>
  )
  return (
    <section
      id="benefits"
      className="coach-setup"
      data-theme="dark"
      aria-labelledby={headingId}
    >
      <div className="setup-container">
        <div className="section-heading">
          <h2 id={headingId} aria-label={copy.title.join(' ')}>
            {copy.title[0]}
            <br />
            {copy.title[1]}
          </h2>
          <p className="intro">
            <strong>{copy.lead}</strong>
            {copy.intro}
          </p>
        </div>
        <div className="comparison-grid">
          <article
            className="setup-column"
            data-setup-column="phone"
            aria-labelledby={`${id}-title-0`}
          >
            {title(0)}
            <div className="compare-scene">
              <Drawing
                name={`phone-${phone}`}
                description={`${phone} ${phone === 1 ? 'iPhone' : 'iPhones'}. ${copy.jump}`}
                reduced={reduced}
              />
            </div>
            <div className="capture-controls">
              <Phones
                count={phone}
                onChange={setPhone}
                legend={copy.cameras}
                visibleLegend
              />
            </div>
            <Signals count={phone} estimated copy={copy} reduced={reduced} />
          </article>
          <article
            className="setup-column"
            data-setup-column="force"
            aria-labelledby={`${id}-title-1`}
          >
            {title(1)}
            <div className="compare-scene">
              <Drawing
                name={`force-${force}`}
                description={`${force} ${force === 1 ? 'iPhone' : 'iPhones'} ${copy.plates}. ${copy.jump}`}
                reduced={reduced}
              />
            </div>
            <div className="capture-controls">
              <div
                className="api-disclosure"
                ref={apiRef}
                onPointerEnter={api.enter}
                onPointerLeave={api.leave}
                onFocusCapture={api.focus}
                onBlurCapture={api.blur}
              >
                <button
                  className="api-button"
                  type="button"
                  aria-expanded={api.open}
                  aria-controls={apiId}
                  onClick={() => api.toggle('api')}
                >
                  <svg viewBox="0 0 22 22" aria-hidden="true">
                    <path d="M9 13l4-4M8 15l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M14 7l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" />
                  </svg>
                  <span>{copy.api}</span>
                  <span className="info-dot" aria-hidden="true">
                    i
                  </span>
                </button>
                <div id={apiId} className="api-popover" hidden={!api.open}>
                  <div className="api-popover-inner">
                    <p>{copy.supported}</p>
                    <ul>
                      <li>
                        <span>Hawkin Dynamics</span>
                        <small>API</small>
                      </li>
                      <li>
                        <span>
                          PlateMate <em>CC Athletics</em>
                        </span>
                        <small>API</small>
                      </li>
                      <li>
                        <span>VALD</span>
                        <small>API</small>
                      </li>
                      <li>
                        <span>Bertec</span>
                        <small>{copy.direct}</small>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <Phones
                count={force}
                onChange={setForce}
                legend={copy.forceCameras}
              />
            </div>
            <Signals count={force} copy={copy} reduced={reduced} />
          </article>
          <article
            className="setup-column"
            data-setup-column="lab"
            aria-labelledby={`${id}-title-2`}
          >
            {title(2)}
            <div className="compare-scene">
              <Drawing
                name={lab}
                description={`${lab === 'mocap-overhead' ? `${copy.motion} ${copy.plates3d}` : `${copy.camerasHigh} ${copy.plates}`}. ${copy.jump}`}
                reduced={reduced}
              />
            </div>
            <div
              className="lab-disclosure"
              ref={labRef}
              onPointerLeave={labHelp.leave}
              onFocusCapture={labHelp.focus}
              onBlurCapture={labHelp.blur}
            >
              <div className="capture-controls">
                <fieldset className="lab-choices">
                  <legend className="sr-only">{copy.labSetup}</legend>
                  <div className="lab-segments">
                    {(['mocap-overhead', 'lab-cameras'] as const).map(
                      (mode) => (
                        <label
                          key={mode}
                          className="glass-choice lab-choice"
                          onPointerEnter={labHelp.enter}
                          onClick={(event) => {
                            if (!(event.target instanceof HTMLInputElement))
                              labHelp.toggle(mode)
                          }}
                        >
                          <input
                            type="radio"
                            name={`${id}-lab-mode`}
                            value={mode}
                            checked={lab === mode}
                            aria-describedby={labHelp.open ? labId : undefined}
                            onChange={() => setLab(mode)}
                          />
                          <span>
                            <b>
                              {mode === 'mocap-overhead'
                                ? copy.motion
                                : copy.camerasHigh}
                              <em>
                                {mode === 'mocap-overhead'
                                  ? copy.plates3d
                                  : copy.plates}
                              </em>
                            </b>
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </fieldset>
              </div>
              <div
                id={labId}
                className="lab-explanation"
                role="tooltip"
                hidden={!labHelp.open}
              >
                <strong>{copy.labTitle}</strong>
                <p>{copy.labBody}</p>
                <small>{copy.labNote}</small>
              </div>
            </div>
            <Signals
              count={2}
              spatial={lab === 'mocap-overhead'}
              copy={copy}
              reduced={reduced}
            />
          </article>
        </div>
        <footer className="validation-footer">
          <details className="validation-disclosure">
            <summary>
              <span>{copy.validation}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10" />
                <path className="disclosure-plus" d="M8 3v10" />
              </svg>
            </summary>
            <div className="validation-copy">
              <p>{copy.confidence}</p>
              <p>
                {copy.labBefore}
                <strong>{copy.labName}</strong>
                {copy.labCapture}
                <strong>{copy.optitrack}</strong>
                {copy.and}
                <strong>{copy.forcePlates}</strong>
                {copy.comparison}
              </p>
              <p>{copy.refinement}</p>
            </div>
          </details>
        </footer>
      </div>
    </section>
  )
}
