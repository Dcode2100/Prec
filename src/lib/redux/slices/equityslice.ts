import { assetsPeResponse } from '@/lib/types/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface equityState {
  search: string
  tokenType: string
  page: number
  limit: number
  selectedAssetToken: string | null
  selectedAsset: assetsPeResponse | null
}

const initialState: equityState = {
  search: '',
  tokenType: 'ALL',
  page: 1,
  limit: 10,
  selectedAssetToken: null,
  selectedAsset: null,
}

const equitySlice = createSlice({
  name: 'equity',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setTokenType: (state, action: PayloadAction<string>) => {
      state.tokenType = action.payload
      state.search = ''
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    setSelectedAssetToken: (state, action: PayloadAction<string>) => {
      state.selectedAssetToken = action.payload
    },
    setSelectedAsset: (state, action: PayloadAction<assetsPeResponse>) => {
      state.selectedAsset = action.payload
    },
  },
})

export const {
  setSearch,
  setTokenType,
  setPage,
  setLimit,
  setSelectedAssetToken,
  setSelectedAsset,
} = equitySlice.actions
export default equitySlice.reducer
