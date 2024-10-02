import { configureStore, combineReducers } from '@reduxjs/toolkit'
import accountsReducer from '@/lib/redux/slices/accountsSlice'
import userSlice from '@/lib/redux/slices/userSlice'
import logger from 'redux-logger'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import equityReducer from '@/lib/redux/slices/equityslice'
import creditReducer from '@/lib/redux/slices/creditSlice'

const userPersistConfig = {
  key: 'user',
  storage,
}

// Wrap the user reducer with persistReducer
const persistedUserReducer = persistReducer(userPersistConfig, userSlice)

// Combine reducers, only persist user slice
const rootReducer = combineReducers({
  user: persistedUserReducer,
  accounts: accountsReducer,
  equity: equityReducer,
  credit: creditReducer,
})

// Create the store with the persisted user reducer
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable serializable checks for persist
    }).concat(logger),
})

// Setup persistor for redux-persist
export const persistor = persistStore(store)

// Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
