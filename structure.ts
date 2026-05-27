import {StructureBuilder} from 'sanity/structure'

const supportedLanguages = [
  {id: 'uk', title: '🇺🇦 Українська'},
  {id: 'en', title: '🇬🇧 English'},
]

const translatedTypes = ['post']

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Контент')
    .items([
      ...translatedTypes.map((typeName) =>
        S.listItem()
          .title(typeName.charAt(0).toUpperCase() + typeName.slice(1))
          .child(
            S.list()
              .title(typeName)
              .items(
                supportedLanguages.map((lang) =>
                  S.listItem()
                    .title(lang.title)
                    .child(
                      S.documentList()
                        .title(lang.title)
                        .filter('_type == $type && language == $lang')
                        .params({type: typeName, lang: lang.id}),
                    ),
                ),
              ),
          ),
      ),
      S.divider(),
      S.documentTypeListItem('author').title('Author'),
      S.documentTypeListItem('category').title('Category'),
    ])
