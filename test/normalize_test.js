/**
 * Test case for normalize.
 * Runs with mocha.
 */
'use strict'

const normalize = require('../lib/normalize.js')
const clayEntity = require('clay-entity')
const { equal, deepEqual } = require('assert')
const co = require('co')

describe('normalize', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Normalize', () => co(function * () {
    let org01 = clayEntity({ name: 'org01', $$as: 'Org' })
    let user01 = clayEntity({ name: 'user01', org: org01, $$as: 'User' })
    let user02 = clayEntity({ name: 'user02', org: org01, $$as: 'User' })
    let { pointers, pointed, relations } = normalize([ user01, user02 ])
    deepEqual(pointers, [ `User#${String(user01.id)}`, `User#${String(user02.id)}` ])
    equal(pointed.User[ String(user01.id) ].name, 'user01')
    equal(pointed.User[ String(user02.id) ].name, 'user02')
    equal(relations[ `User#${String(user01.id)}` ].org, `Org#${String(org01.id)}`)
  }))
})

/* global describe, before, after, it */
