import console from '../index'

describe('@intendant/console', () => {
    test('verbose', () => {
        expect(console.verbose("jest-object","jest-message")).toBe(true)
    })
    test('warning', () => {
        expect(console.warning("jest-object","jest-message")).toBe(true)
    })
    test('error', () => {
        expect(console.error("jest-object","jest-message")).toBe(true)
    })
    test('throw error - verbose', () => {
        expect(console.verbose("jest-object")).toBe(false)
    })
    test('throw error - warning', () => {
        expect(console.warning("jest-object")).toBe(false)
    })
    test('throw error - error', () => {
        expect(console.error("jest-object")).toBe(false)
    })
    test('throw error - verbose', () => {
        expect(console.verbose(null,"jest-message")).toBe(false)
    })
    test('throw error - warning', () => {
        expect(console.warning(null,"jest-message")).toBe(false)
    })
    test('throw error - error', () => {
        expect(console.error(null,"jest-message")).toBe(false)
    })
})