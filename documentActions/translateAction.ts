import {useState} from 'react'
import type {DocumentActionComponent, DocumentActionProps} from 'sanity'

// SANITY_STUDIO_ префікс — обов'язковий, щоб змінна потрапила в браузер
// const NEXT_URL = process.env.SANITY_STUDIO_NEXT_URL ?? ''
// const SECRET = process.env.SANITY_STUDIO_TRANSLATE_SECRET ?? ''

const {SANITY_STUDIO_NEXT_URL: NEXT_URL, SANITY_STUDIO_TRANSLATE_SECRET: SECRET} = import.meta.env

export const TranslateAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {type, published, draft} = props
  const [isTranslating, setIsTranslating] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Показуємо кнопку тільки для постів українською
  const doc = draft ?? published
  if (type !== 'post' || (doc as any)?.language !== 'uk') return null

  // Кнопка неактивна якщо пост ще не опублікований
  const isDisabled = isTranslating || !published

  return {
    label: isDone ? '✓ EN готова' : isTranslating ? 'Перекладаємо...' : '🌐 Перекласти AI',
    disabled: isDisabled,
    title: !published
      ? 'Спочатку опублікуй пост українською'
      : 'Створити або оновити EN-версію через AI',

    onHandle: async () => {
      if (!published) return

      setIsTranslating(true)
      setIsDone(false)
      setError(null)

      try {
        const res = await fetch(`${NEXT_URL}/api/translate`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            documentId: published._id,
            slug: (published as any).slug?.current,
            secret: SECRET,
          }),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error ?? `HTTP ${res.status}`)
        }

        setIsDone(true)
        // Скидаємо стан "Готово" через 4 секунди
        setTimeout(() => setIsDone(false), 4000)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsTranslating(false)
      }
    },

    // Якщо є помилка — показуємо діалог
    dialog: error
      ? {
          type: 'dialog',
          onClose: () => setError(null),
          header: 'Помилка перекладу',
          content: error,
        }
      : undefined,
  }
}
