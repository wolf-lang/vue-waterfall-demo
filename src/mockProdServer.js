import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

import discover from './mock/discover'

export function setupMockServer() {
  console.log('setupMockServer')
  console.log(discover) 
  createProdMockServer([...discover])
}