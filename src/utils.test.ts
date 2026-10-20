import { describe, expect, it } from 'vitest'
import { beautify, formatOutput, minify, parseJson, resolveDocumentName, safeFilename, toggleCompareId } from './utils'

describe('JSON utilities', () => {
  it('beautifies valid JSON without mutating invalid input', () => {
    expect(beautify('{"hello":"world"}', 2)).toBe('{\n  "hello": "world"\n}')
    expect(beautify('{oops}', 2)).toBeNull()
  })
  it('minifies valid JSON', () => { expect(minify('{\n  "a": 1\n}')).toBe('{"a":1}') })
  it('formats output modes without changing the input', () => {
    const input = '{"a": {"b": 1}}'
    expect(formatOutput(input, 'beautify', 2)).toBe('{\n  "a": {\n    "b": 1\n  }\n}')
    expect(formatOutput(input, 'minify', 2)).toBe('{"a":{"b":1}}')
    expect(input).toBe('{"a": {"b": 1}}')
  })
  it('returns useful validation details', () => { const result = parseJson('{\n "a": }'); expect(result.valid).toBe(false); expect(result.error).toBeTruthy() })
  it('diagnoses common JSON syntax errors', () => {
    expect(parseJson('{"a": 1 "b": 2}').diagnostic?.type).toBe('Missing comma')
    expect(parseJson('{"a": 1,}').diagnostic?.type).toBe('Trailing comma')
    expect(parseJson('{foo: 1}').diagnostic?.type).toBe('Missing quotes')
    expect(parseJson('{"a": 1').diagnostic?.type).toBe('Unclosed object')
    expect(parseJson('{"a": @}').diagnostic?.type).toContain('Unexpected token')
  })
  it('sanitizes download filenames', () => { expect(safeFilename('orders / today?')).toBe('orders---today-.json') })
  it('keeps the previous name when a rename draft is empty', () => {
    expect(resolveDocumentName('Orders', '')).toBe('Orders')
    expect(resolveDocumentName('Orders', '   ')).toBe('Orders')
    expect(resolveDocumentName('Orders', '  Payments  ')).toBe('Payments')
  })
  it('limits compare selection to two documents and preserves selection order', () => {
    expect(toggleCompareId([], 'first')).toEqual(['first'])
    expect(toggleCompareId(['first'], 'second')).toEqual(['first', 'second'])
    expect(toggleCompareId(['first', 'second'], 'third')).toEqual(['first', 'second'])
    expect(toggleCompareId(['first', 'second'], 'first')).toEqual(['second'])
  })
})
