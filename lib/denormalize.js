/**
 * Restore from normalized
 * @function denormalize
 * @param {ClayNormalized} normalized - Normalized object
 * @param {Object} [options={}] - Optional settings
 * @returns {ClayEntity[]} Denormalized array
 */
'use strict'

const { parse: parseRef } = require('clay-resource-ref')
const clayEntity = require('clay-entity')

const fromPointed = (pointed, pointer) => {
  let { resource, id } = (parseRef(pointer))
  let found = (pointed[ String(resource) ] || {} )[ String(id) ]
  if (!found) {
    throw new Error(`[Clay-Normalizer] Invalid pointer: ${pointer}`)
  }
  return clayEntity(found)
}

/** @lends denormalize */
function denormalize (normalized, options = {}) {
  let {
    relatedPointersToSkip = []
  } = options
  let { pointers, pointed, relations } = normalized
  return pointers.map((pointer) => {
    let entity = fromPointed(pointed, pointer)
    let relation = relations[ pointer ]
    if (relation) {
      let relationNamesToResolve = Object.keys(relation)
        .filter((name) => !relatedPointersToSkip.indexOf(relation[ name ]))
      for (let name of relationNamesToResolve) {
        let relatedPointer = relation[ pointer ]
        let [ related ] = denormalize({
          pointers: [ relatedPointer ],
          pointed: pointed,
          relations
        }, {
          relatedPointersToSkip: [ pointer ] // Prevent circular relations
        })
        entity[ name ] = related
      }
    }
    return entity
  })
}

module.exports = denormalize
