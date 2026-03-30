import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'

export type SelectOption = { value: string; label: string }

type SelectFieldProps = {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  id?: string
  ariaLabel?: string
  disabled?: boolean
  className?: string
  /** Max height of dropdown list (px) */
  menuMaxHeight?: number
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={'select-field__chevron' + (open ? ' select-field__chevron--open' : '')}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SelectField({
  value,
  onChange,
  options,
  id: idProp,
  ariaLabel,
  disabled,
  className = '',
  menuMaxHeight = 280,
}: SelectFieldProps) {
  const genId = useId()
  const listId = `${genId}-list`
  const btnId = idProp ?? `${genId}-btn`

  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  )
  const label = selected?.label ?? value

  const safeHighlight = useMemo(() => {
    if (options.length === 0) return 0
    const idx = options.findIndex((o) => o.value === value)
    return idx >= 0 ? idx : 0
  }, [options, value])

  const close = useCallback(() => {
    setOpen(false)
    requestAnimationFrame(() => btnRef.current?.focus())
  }, [])

  const pick = useCallback(
    (v: string) => {
      onChange(v)
      close()
    },
    [close, onChange],
  )

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync keyboard row when dropdown opens
    setHighlight(safeHighlight)
  }, [open, safeHighlight])

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => listRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${highlight}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlight, open])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: Event) => {
      if (rootRef.current?.contains(e.target as Node)) return
      close()
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('touchstart', onDoc, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('touchstart', onDoc)
    }
  }, [close, open])

  const onBtnKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || options.length === 0) return
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        setOpen((o) => !o)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!open) {
          setOpen(true)
        } else {
          setHighlight((h) => Math.min(h + 1, options.length - 1))
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) {
          setOpen(true)
        } else {
          setHighlight((h) => Math.max(h - 1, 0))
        }
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
      default:
        break
    }
  }

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (!open) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlight((h) => Math.min(h + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlight((h) => Math.max(h - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (options[highlight]) pick(options[highlight].value)
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
      default:
        break
    }
  }

  const onOptionClick = (e: MouseEvent, v: string) => {
    e.preventDefault()
    e.stopPropagation()
    pick(v)
  }

  return (
    <div
      ref={rootRef}
      className={
        'select-field' +
        (open ? ' select-field--open' : '') +
        (disabled ? ' select-field--disabled' : '') +
        (className ? ` ${className}` : '')
      }
    >
      <button
        ref={btnRef}
        type="button"
        id={btnId}
        className="select-field__btn"
        disabled={disabled || options.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => !disabled && options.length > 0 && setOpen((o) => !o)}
        onKeyDown={onBtnKeyDown}
      >
        <span className="select-field__value">{label}</span>
        <ChevronIcon open={open} />
      </button>
      {open && options.length > 0 && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={0}
          className="select-field__menu"
          style={{ maxHeight: menuMaxHeight }}
          onKeyDown={onListKeyDown}
        >
          {options.map((opt, i) => (
            <li key={opt.value} role="presentation">
              <button
                type="button"
                role="option"
                data-index={i}
                tabIndex={-1}
                className={
                  'select-field__option' +
                  (opt.value === value ? ' select-field__option--selected' : '') +
                  (i === highlight ? ' select-field__option--highlight' : '')
                }
                aria-selected={opt.value === value}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => onOptionClick(e, opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
