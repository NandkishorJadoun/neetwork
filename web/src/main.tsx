import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider, useAuth } from './auth'
import { router } from './router'
import "./styles/index.css"

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <InnerApp />
  </AuthProvider>
)
