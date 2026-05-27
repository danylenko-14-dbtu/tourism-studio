import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: "Ім'я",
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
        source: (doc: any) => doc.name?.en ?? '',
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Біографія',
      type: 'object',
      fields: [
        {name: 'uk', type: 'text', title: '🇺🇦 Українська'},
        {name: 'en', type: 'text', title: '🇬🇧 English'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name.uk',
      media: 'image',
    },
  },
})
