'use client'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { AppStore, store, persistor } from '@/lib/redux/store'
import { counterSlice } from '@/lib/redux/counter/counterSlice'
import { PersistGate } from 'redux-persist/integration/react'
// import { fetchCurrentUser } from "@/lib/features/userSlice";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default function StoreProvider({
  count,
  children,
}: {
  count: number
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!storeRef.current) {
      storeRef.current = store
    }
 
    if (typeof count === 'number') {
      storeRef.current.dispatch(counterSlice.actions.incrementByAmount(count))
    }
  }, [count])
  const storeRef = useRef<AppStore | null>(null)

  return (
    <Provider store={storeRef.current || store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}
