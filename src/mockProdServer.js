import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

import discover from '../mock/discover'

export function setupMockServer() {
  createProdMockServer([...discover])
}