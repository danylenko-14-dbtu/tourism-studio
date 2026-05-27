import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description:
        'Унікальний ідентифікатор, використовується в URL. Генерується один раз з заголовка при створенні нового поста.',
      options: {
        source: 'title',
        isUnique: (slug, context) => {
          const {document, getClient} = context
          if (!document?.language) return true

          // keep the same slug for the same document (e.g. when editing), but ensure it's unique across all documents with the same language
          const id = document._id.replace(/^drafts\./, '')

          const client = getClient({apiVersion: '2026-05-02'})
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
              language: document.language,
              id,
              draftId: `drafts.${id}`,
            },
          )
        },
      },
    }),

    defineField({
      name: 'excerpt',
      title: 'Короткий опис',
      type: 'text',
      rows: 3,
      description:
        'Показується на картці поста і використовується як мета-description. 80–155 символів.',
      validation: (Rule) => Rule.required().min(80).max(155),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),

    defineField({
      name: 'mainImage',
      title: 'Головне зображення',
      type: 'image',
      description:
        'Рекомендований розмір 1200x630px. Відкрийте зображення для вибору "hotspot" для кращого кадрування',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Альтернативний текст',
          description: 'Важливо для SEO і доступності. Коротко опишіть що на фото.',
        }),
      ],
    }),

    defineField({
      name: 'categories',
      title: 'Категорії',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: {type: 'category'},
        }),
      ],
    }),

    defineField({
      name: 'body',
      type: 'blockContent',
    }),

    // Hidden technical fields
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      hidden: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'autoTranslated',
      type: 'boolean',
      title: 'Автопереклад (EN)',
      initialValue: false,
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name.uk',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
