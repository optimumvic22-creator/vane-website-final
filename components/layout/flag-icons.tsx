interface FlagProps {
  className?: string
}

export function FlagUK({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <clipPath id="uk-clip"><rect width="60" height="40" rx="4" /></clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0L60 40M60 0L0 40" stroke="white" strokeWidth="8" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3" />
        <path d="M30 0V40M0 20H60" stroke="white" strokeWidth="12" />
        <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

export function FlagDE({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <clipPath id="de-clip"><rect width="60" height="40" rx="4" /></clipPath>
      <g clipPath="url(#de-clip)">
        <rect y="0" width="60" height="13.33" fill="#000000" />
        <rect y="13.33" width="60" height="13.34" fill="#DD0000" />
        <rect y="26.67" width="60" height="13.33" fill="#FFCE00" />
      </g>
    </svg>
  )
}
