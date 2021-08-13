const tracing = require('../')

describe('@intendant/tracing', () => {
    test('verbose', () => {
        expect(tracing.verbose("jest-object","jest-message")).toBe(true)
    })
    test('warning', () => {
        expect(tracing.warning("jest-object","jest-message")).toBe(true)
    })
    test('error', () => {
        expect(tracing.error("jest-object","jest-message")).toBe(true)
    })
})


