/**
 * Test case for denormalize.
 * Runs with mocha.
 */
'use strict'

const denormalize = require('../lib/denormalize.js')
const normalize = require('../lib/normalize.js')
const clayEntity = require('clay-entity')
const { ok, equal } = require('assert')
const co = require('co')

describe('denormalize', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Denormalize', () => co(function * () {
    let org01 = clayEntity({ name: 'org01', $$as: 'Org' })
    let user01 = clayEntity({ name: 'user01', org: org01, $$as: 'User' })
    let user02 = clayEntity({ name: 'user02', org: org01, $$as: 'User' })
    let { pointers, pointed, relations } = normalize([ user01, user02 ])

    let denormalized = denormalize({ pointers, pointed, relations })
    ok(denormalized)
    equal(denormalized.length, 2)
    equal(denormalized[ 0 ].name, 'user01')
    equal(denormalized[ 0 ].org.name, 'org01')
    equal(denormalized[ 1 ].name, 'user02')
  }))
})

/* global describe, before, after, it */
