import {
  getPublishedId,
  SlugInput,
  type SanityDocument,
  type SlugInputProps,
  useEditState,
  useFormValue,
} from 'sanity'

type PostDocument = Partial<SanityDocument> & {
  language?: unknown
}

const isDraftId = (id: string) => id.startsWith('drafts.')

export const PostSlugInput = (props: SlugInputProps) => {
  const document = useFormValue([]) as PostDocument | undefined
  const documentId = document?._id ?? ''
  const documentType = document?._type ?? 'post'
  const editState = useEditState(getPublishedId(documentId), documentType)

  const isEnglishVersion = document?.language === 'en'
  const hasPublishedVersion = Boolean(editState?.published) || Boolean(documentId && !isDraftId(documentId))
  const readOnly = props.readOnly || isEnglishVersion || hasPublishedVersion

  return <SlugInput {...props} readOnly={readOnly} />
}
