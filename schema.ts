// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  json
} from '@keystone-6/core/fields'

import { document } from '@keystone-6/fields-document'

import { type Lists } from '.keystone/types'

export const lists = {
  User: list({
    access: { operation: () => true },
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      posts: relationship({ ref: 'Post.author', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      magicLinkToken: text({ isIndexed: 'unique', db: { isNullable: true } }),
      magicLinkTokenExpiry: timestamp({ db: { isNullable: true } }),
    },
  }),

  Post: list({
    access: { operation: () => true },
    fields: {
      title: text({ validation: { isRequired: true } }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      author: relationship({
        ref: 'User.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineConnect: true,
        },

        many: false,
      }),

      tags: relationship({
        ref: 'Tag.posts',
       ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),
    },
  }),

  Tag: list({
    access: { operation: () => true },
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),
     Session: list({
    fields: {
      itemId: text(),
      listKey: text(),
      data: json(),
      expiresAt: timestamp(),
    },
    ui: { isHidden: true },
    access: { operation: () => true }, // allow access if needed
  }),

} as Lists
