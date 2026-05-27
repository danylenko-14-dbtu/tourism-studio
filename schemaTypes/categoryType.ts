import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Назва',
      type: 'object',
      fields: [
        {name: 'uk', type: 'string', title: '🇺🇦 Українська'},
        {name: 'en', type: 'string', title: 'en English'},
      ],
    }),
    defineField({
      name: 'slug',
      type: 'slug',

      options: {
        source: (doc: any) => doc.title?.en ?? '',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title.uk',
    },
  },
})
