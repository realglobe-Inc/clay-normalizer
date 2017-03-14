'use strict'

const { clayEntity } = require('clay-entity')
const { normalize, denormalize } = require('clay-normalizer')

{
  let org01 = clayEntity({ id: 1, name: 'org01', $$as: 'Org' })
  let user01 = clayEntity({ id: 1, name: 'user01', org: org01, $$as: 'User' })
  let user02 = clayEntity({ id: 2, name: 'user02', org: org01, $$as: 'User' })

  let { pointers, pointed, relations } = normalize([ user01, user02 ])

  console.log(pointers) // -> [ 'User#1', 'User#2' ]
  console.log(pointed) // -> { User: { '1': { /* ... */ }, '2': { /* ... */ } }, Org: { '2': { /* ... */ } } }
  console.log(relations) // -> { 'User#1': { org: 'Org#30ac84120ec44c61a1b5f28320910b0b' }, 'User#2': { org: 'Org#1' } }

  let users = denormalize({ pointers, pointed, relations })
  console.log(users) // -> [ { /* ... */ }, { /* ... */ } ]
}
