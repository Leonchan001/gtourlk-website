import { getTourDurations } from '../data/tours'
import { useLanguage } from '../i18n'
import { EXPERIENCE_COPY } from '../data/experienceCopy'

export function GuestInput({ value, onChange, id, error }) {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].pricing
  return (
    <div className="guest-field">
      <label htmlFor={id} className="field-label">
        {copy.guests}
      </label>
      <div className="guest-stepper">
        <button
          type="button"
          aria-label={lang === 'zh' ? '減少一位旅客' : 'Remove one guest'}
          disabled={Number(value) <= 1}
          onClick={() => onChange(Math.max(1, Number(value || 1) - 1))}
        >
          −
        </button>
        <input
          id={id}
          type="number"
          min="1"
          max="50"
          step="1"
          inputMode="numeric"
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) =>
            onChange(
              event.target.value === '' ? '' : Number(event.target.value),
            )
          }
        />
        <button
          type="button"
          aria-label={lang === 'zh' ? '增加一位旅客' : 'Add one guest'}
          disabled={Number(value) >= 50}
          onClick={() => onChange(Math.min(50, Number(value || 0) + 1))}
        >
          +
        </button>
      </div>
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
export function DurationInput({ value, onChange, name }) {
  const { lang } = useLanguage()
  return (
    <fieldset className="duration-field">
      <legend className="field-label">
        {EXPERIENCE_COPY[lang].pricing.duration}
      </legend>
      <div className="duration-options">
        {getTourDurations(lang).map((option) => (
          <label key={option.minutes}>
            <input
              type="radio"
              name={name}
              value={option.minutes}
              checked={value === option.minutes}
              onChange={() => onChange(option.minutes)}
            />
            <span>
              {option.minutes}
              <small>{lang === 'zh' ? ' 分鐘' : ' min'}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
