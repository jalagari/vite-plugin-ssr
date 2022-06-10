import React from 'react'
import { Counter } from './Counter'
import {SSRProvider} from '@react-aria/ssr';

export { Page }

function Page() {
  return (
    <SSRProvider>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </SSRProvider>
  )
}
