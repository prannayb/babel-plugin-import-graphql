import { join } from 'path'

import { print } from 'graphql/language'

import { requireGql } from '../plugin/requireGql'

describe('parse client-side graphql file at runtime', () => {
  test('absolute filepath argument', () => {
    const result = requireGql(join(__dirname, './fixtures/shared/named.graphql'))
    expect(typeof result).toBe('object')
  })

  test('relative filepath argument', () => {
    const result = requireGql('./fixtures/shared/named.graphql')
    expect(typeof result).toBe('object')
  })

  test('single named query', () => {
    const result = requireGql('./fixtures/shared/named.graphql')
    expect(result.kind).toBe('Document')
  })

  test('single named query with { nowrap: false }', () => {
    const { named } = requireGql('./fixtures/shared/named.graphql', { nowrap: false })
    expect(named.kind).toBe('Document')
  })

  test('single unnamed query', () => {
    const result = requireGql('./fixtures/shared/unnamed.graphql')
    expect(result.kind).toBe('Document')
  })

  test('multiple operations', () => {
    const result = requireGql('./fixtures/shared/multiple.graphql')
    const { first, second, third } = result
    expect(first).toEqual(result.default)
    expect(first.kind).toBe('Document')
    expect(second.kind).toBe('Document')
    expect(third.kind).toBe('Document')
  })

  test('query with nested fragment', () => {
    const full = requireGql('./fixtures/requireGql/fragments/nested/partial.graphql')
    expect(full.kind).toBe('Document')
    expect(full.definitions).toHaveLength(2)
    expect(full.definitions[0].kind).toBe('OperationDefinition')
    expect(full.definitions[1].kind).toBe('FragmentDefinition')
  })

  test('query with chained fragment imports', () => {
    const full = requireGql('./fixtures/requireGql/fragments/chained/partial.graphql')
    expect(full.kind).toBe('Document')
    expect(print(full)).toMatchSnapshot()
  })

  test('query document indented with spaces', () => {
    const result = requireGql('./fixtures/requireGql/whitespace/spaces.graphql')
    expect(result.kind).toBe('Document')
  })

  test('query document indented with tabs', () => {
    const result = requireGql('./fixtures/requireGql/whitespace/tabs.graphql')
    expect(result.kind).toBe('Document')
  })
})

describe('parse schema file at runtime', () => {
  test('returns raw source text', () => {
    const schema = requireGql('./fixtures/shared/schema.graphql')
    expect(schema).toMatchSnapshot()
  })

  test('concatenates multiple levels of #imported types', () => {
    const schema = requireGql('./fixtures/requireGql/customImport/chainedImportsSchema.graphql')
    expect(schema).toMatchSnapshot()
  })
})
