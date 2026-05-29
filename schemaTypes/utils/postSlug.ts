import type {SanityDocument, SlugIsUniqueValidator, SlugSourceFn, SlugValue} from 'sanity'

const POST_SLUG_API_VERSION = '2026-05-02'
const SLUG_FORMAT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const getStringValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const getCurrentSlugValue = (document: SanityDocument) => {
  const slug = document.slug

  if (!slug || typeof slug !== 'object' || Array.isArray(slug)) return ''

  return getStringValue((slug as {current?: unknown}).current)
}

export const getPostSlugSource: SlugSourceFn = (document) => {
  return getCurrentSlugValue(document) || getStringValue(document.title)
}

export const isUniquePostSlugByLanguage: SlugIsUniqueValidator = (slug, context) => {
  const {document, getClient} = context
  const language = document?.language

  if (!document?._id || typeof language !== 'string') return true

  const id = document._id.replace(/^drafts\./, '')
  const client = getClient({apiVersion: POST_SLUG_API_VERSION})

  return client.fetch(
    `!defined(*[
      _type == "post" &&
      slug.current == $slug &&
      language == $language &&
      _id != $id &&
      _id != $draftId
    ][0]._id)`,
    {
      slug,
      language,
      id,
      draftId: `drafts.${id}`,
    },
  )
}

export const validatePostSlugFormat = (value: SlugValue | undefined) => {
  const slug = getStringValue(value?.current)

  if (!slug || SLUG_FORMAT_PATTERN.test(slug)) return true

  return 'Slug має містити тільки lowercase латинку, цифри та дефіси між словами, наприклад: kharkiv-travel-guide'
}
