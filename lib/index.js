/**
 * Normalizer for clay-collection
 * @module clay-normalizer
 */

'use strict'

let d = (module) => module && module.default || module

module.exports = {
  get denormalize () { return d(require('./denormalize')) },
  get normalize () { return d(require('./normalize')) }
}
