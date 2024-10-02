import { PcAsset } from '@/lib/types/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface creditState {
  search: string
  tokenType: string
  page: number
  limit: number
  selectedAsset: PcAsset | null
}

const initialState: creditState = {
  search: '',
  tokenType: 'ALL',
  page: 1,
  limit: 10,
  selectedAsset: null,
}

const creditSlice = createSlice({
  name: 'credit',
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
    setSelectedAsset: (state, action: PayloadAction<PcAsset>) => {
      state.selectedAsset = action.payload
    },
  },
})

export const { setSearch, setTokenType, setPage, setLimit, setSelectedAsset } =
  creditSlice.actions
export default creditSlice.reducer
