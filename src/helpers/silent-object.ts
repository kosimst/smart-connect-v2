/**
 * Dummy object that cannot cause any access errors or not function errors
 */
const silentObject: any = () =>
  new Proxy(Function(), {
    get: (target, key) => {
      if (key === 'prototype') {
        return target.prototype
      }

      return silentObject()
    },
  })

export default silentObject
