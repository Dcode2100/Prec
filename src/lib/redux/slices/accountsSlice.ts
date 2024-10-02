import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AccountsState {
  search: string
  accountType: string
  page: number
  isActive: boolean
}

const initialState: AccountsState = {
  search: '',
  accountType: 'all',
  page: 1,
  isActive: false,
}

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setAccountType: (state, action: PayloadAction<string>) => {
      state.accountType = action.payload
      state.search = ''
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setIsActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload
    },
  },
})

export const { setSearch, setAccountType, setPage, setIsActive } =
  accountsSlice.actions
export default accountsSlice.reducer
