/**
 * Normalize clay entities
 * @function normalize
 * @param {ClayEntity[]} collection - Collection to normalize
 * @param {Object} [options={}] - Optional settings
 * @returns {ClayNormalized}
 */
'use strict'

const clayId = require('clay-id')
const clayResourceName = require('clay-resource-name')
const { isEntity } = require('clay-entity')
const { refTo, parse: parseRef } = require('clay-resource-ref')

const idOfEntity = (entity) => String(clayId(entity.id))
const resourceNameOfEntity = (entity) => String(clayResourceName(entity.$$as))
const refOfEntity = (entity) => refTo(resourceNameOfEntity(entity), idOfEntity(entity))
const addPointed = (hash, entity) => {
  let resourceName = resourceNameOfEntity(entity)
  let id = idOfEntity(entity)
  hash[ resourceName ] = hash[ resourceName ] || {}
  hash[ resourceName ][ id ] = entity
}
const addRelation = (hash, from, to, { as } = {}) => {
  hash[ from ] = hash[ from ] || {}
  hash[ from ][ as ] = to
}

/** @lends normalize */
function normalize (entities, options = {}) {
  let { pointed = {}, relations = {} } = options
  let pointers = []
  for (let entity of entities) {
    let pointer = refOfEntity(entity)
    addPointed(pointed, entity)
    for (let name of Object.keys(entity)) {
      let value = entity[ name ]
      if (Array.isArray(value)) {
        // TODO Handle array values
      }
      if (isEntity(value)) {
        let { pointers: sugPointers } = normalize([ value ], { pointed, relations })
        addRelation(relations, pointer, sugPointers[ 0 ], { as: name })
      }
      if (value && value.$ref) {
        let { resource: refResource, id: refId } = parseRef(value.$ref)
        addRelation(relations, pointer, refTo(refResource, refId), { as: name })
      }
    }
    pointers.push(pointer)
  }
  return { pointers, pointed, relations }
}

module.exports = normalize

/**
 * Normalized object
 * @typedef {Object} ClayNormalized
 * @property {string[]} pointers - Pointer strings
 * @property {Object<string, ClayEntity>} pointed - Actual entities
 * @property {Object<string, Object.<string, string>>} relations - Pointer refs
 */
