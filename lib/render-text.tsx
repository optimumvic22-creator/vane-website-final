import React from 'react'

/**
 * Renders a Sanity text field with support for:
 * - Line breaks: \n → <br />
 * - Bold: **text** → <strong>text</strong>
 */
export function renderText(text: string): React.ReactNode {
  const lines = text.split('\n')
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*.*?\*\*)/g)
    const rendered = parts.map((part, pi) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${li}-${pi}`}>{part.slice(2, -2)}</strong>
      }
      return part
    })
    return (
      <React.Fragment key={li}>
        {rendered}
        {li < lines.length - 1 && <br />}
      </React.Fragment>
    )
  })
}
