import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  status: 'idle',
  hookIndex: 0,
  setStatus: vi.fn(),
  submit: vi.fn(),
  track: vi.fn(),
}))

vi.mock('react', () => ({
  useEffect: () => undefined,
  useRef: (value: unknown) => ({ current: value }),
  useState: (initial: unknown) => state.hookIndex++ === 0
    ? [state.status, state.setStatus]
    : [initial, vi.fn()],
}))
vi.mock('@/lib/analytics', () => ({ trackEvent: state.track }))
vi.mock('@/lib/inquiry-request', () => ({
  submitInquiry: state.submit,
  InquiryTimeoutError: class extends Error {},
}))

import { AudienceInquiryForm } from './audience-inquiry-form'

beforeEach(() => {
  vi.clearAllMocks()
  state.hookIndex = 0
  state.status = 'idle'
  state.submit.mockResolvedValue(undefined)
  state.track.mockImplementation(() => undefined)
})

function form() {
  return AudienceInquiryForm({ audience: 'athlete', locale: 'en', cta: 'Request assessment', note: 'Inquiry only' })
}

function descendants(node: unknown): ReactElement<Record<string, unknown>>[] {
  if (!node || typeof node !== 'object' || !('props' in node)) return []
  const element = node as ReactElement<Record<string, unknown>>
  const children = element.props.children
  return [element, ...(Array.isArray(children) ? children : [children]).flatMap(descendants)]
}

async function submitTwice() {
  const NativeFormData = globalThis.FormData
  const data = new NativeFormData()
  data.set('context', 'Basketball')
  data.set('email', 'test@example.com')
  const constructor = vi.fn(function () { return data })
  vi.stubGlobal('FormData', constructor)
  try {
    const node = form()
    const event = { preventDefault: vi.fn(), currentTarget: {} }
    const first = node.props.onSubmit(event)
    const second = node.props.onSubmit(event)
    await Promise.all([first, second])
  } finally {
    vi.unstubAllGlobals()
  }
}

describe('assessment inquiry interaction', () => {
  it('prevents synchronous duplicate sends', async () => {
    await submitTwice()
    expect(state.submit).toHaveBeenCalledTimes(1)
    expect(state.setStatus).toHaveBeenLastCalledWith('success')
  })

  it('does not show a retryable failure when analytics throws after confirmed delivery', async () => {
    state.track.mockImplementation(() => { throw new Error('analytics unavailable') })
    await submitTwice()
    expect(state.setStatus).not.toHaveBeenCalledWith('error')
    expect(state.setStatus).toHaveBeenLastCalledWith('success')
  })

  it('shows no success or conversion event when storage is not confirmed', async () => {
    state.submit.mockRejectedValue(new Error('confirmation_unavailable'))
    await submitTwice()
    expect(state.submit).toHaveBeenCalledTimes(1)
    expect(state.setStatus).not.toHaveBeenCalledWith('success')
    expect(state.setStatus).toHaveBeenLastCalledWith('error')
    expect(state.track).not.toHaveBeenCalled()
  })

  it('protects user fields and the submit button while pending', () => {
    state.status = 'submitting'
    const elements = descendants(form())
    const fields = elements.filter((element) => ['context', 'email', 'message'].includes(String(element.props.name)))
    expect(fields).toHaveLength(3)
    expect(fields.every((field) => field.props.readOnly === true)).toBe(true)
    expect(elements.find((element) => element.props.type === 'submit')?.props.disabled).toBe(true)
  })

  it('reuses its key on retry and allocates a new key when the form payload changes', async () => {
    const NativeFormData = globalThis.FormData
    const data = new NativeFormData()
    data.set('context', 'Basketball')
    data.set('email', 'test@example.com')
    vi.stubGlobal('FormData', vi.fn(function () { return data }))
    state.submit.mockRejectedValueOnce(new Error('response lost'))
      .mockRejectedValueOnce(new Error('response lost'))
      .mockRejectedValueOnce(new Error('response lost'))
      .mockResolvedValueOnce(undefined)
    try {
      const node = form()
      const event = { preventDefault: vi.fn(), currentTarget: {} }
      await node.props.onSubmit(event)
      await node.props.onSubmit(event)
      data.set('context', 'Football')
      await node.props.onSubmit(event)
      data.set('context', 'Basketball')
      await node.props.onSubmit(event)

      const [first, retry, edited, restored] = state.submit.mock.calls.map(([payload]) => payload)
      expect(first.idempotencyKey).toMatch(/^[a-f0-9-]{36}$/)
      expect(retry.idempotencyKey).toBe(first.idempotencyKey)
      expect(edited.idempotencyKey).not.toBe(first.idempotencyKey)
      expect(edited.context).toBe('Football')
      expect(restored.idempotencyKey).toBe(first.idempotencyKey)
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('uses cryptographically generated UUID v4 when randomUUID is unavailable', async () => {
    const NativeFormData = globalThis.FormData
    const data = new NativeFormData()
    data.set('context', 'Basketball')
    data.set('email', 'test@example.com')
    vi.stubGlobal('FormData', vi.fn(function () { return data }))
    const getRandomValues = vi.fn((bytes: Uint8Array) => {
      bytes.forEach((_, index) => { bytes[index] = index })
      return bytes
    })
    vi.stubGlobal('crypto', { getRandomValues })
    try {
      const node = form()
      await node.props.onSubmit({ preventDefault: vi.fn(), currentTarget: {} })
      expect(getRandomValues).toHaveBeenCalledOnce()
      expect(state.submit.mock.calls[0][0].idempotencyKey).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f')
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
