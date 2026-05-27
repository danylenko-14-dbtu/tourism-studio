import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schema} from './schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization'
import {structure} from './structure'
import {ukUALocale} from '@sanity/locale-uk-ua'
import {TranslateAction} from './documentActions/translateAction'

export default defineConfig({
  name: 'default',
  title: 'tourism-deparment-blog',

  projectId: 'g8pjyr9z',
  dataset: import.meta.env.SANITY_STUDIO_DATASET,

  document: {
    actions: (prev, context) => {
      return [...prev, TranslateAction]
    },
  },

  plugins: [
    structureTool({structure}),
    visionTool(),
    ukUALocale(),

    documentInternationalization({
      supportedLanguages: [
        {id: 'uk', title: 'Ukrainian'},
        {id: 'en', title: 'English'},
      ],

      schemaTypes: ['post'],
    }),
  ],

  schema,
})
