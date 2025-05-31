import api from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to fetch accounts
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/accounts");
      console.log("accounts/fetchAccounts: ", response.data);
      return response.data;
    } catch (error) {
      console.error("accounts/fetchAccounts error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch accounts"
      );
    }
  }
);

// Async thunk to create account
export const createAccount = createAsyncThunk(
  "accounts/createAccount",
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/accounts", accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create account"
      );
    }
  }
);

// Async thunk to update account
export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async ({ id, accountData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/accounts/${id}`, accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update account"
      );
    }
  }
);

// Async thunk to delete account
export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/accounts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete account"
      );
    }
  }
);

const initialState = {
  accounts: [],
  loading: false,
  error: null,
  totalBalance: 0,
};

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    clearAccountError: (state) => {
      state.error = null;
    },
    resetAccounts: (state) => {
      state.accounts = [];
      state.totalBalance = 0;
      state.error = null;
      state.loading = false;
    },
    // Manual update
    updateAccountBalance: (state, action) => {
      const { accountId, newBalance } = action.payload;
      const account = state.accounts.find((acc) => acc._id === accountId);
      if (account) {
        const oldbalance = account.balance;
        account.balance = newBalance;
        state.totalBalance = state.totalBalance - oldbalance + newBalance;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch accounts
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
        state.totalBalance = action.payload.reduce(
          (total, account) => total + (account.balance || 0),
          0
        );
        state.error = null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create account
    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.push(action.payload);
        state.totalBalance += action.payload.balance || 0;
        state.error = null;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update account
    builder
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.accounts.findIndex(
          (account) => account._id === action.payload._id
        );
        if (index !== -1) {
          const oldBalance = state.accounts[index].balance || 0;
          state.accounts[index] = action.payload;
          const newBalance = action.payload.balance || 0;
          state.totalBalance = state.totalBalance - oldBalance + newBalance;
        }
        state.error = null;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete account
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        const accountToDelete = state.accounts.find(
          (account) => account._id === action.payload
        );
        if (accountToDelete) {
          state.totalBalance -= accountToDelete.balance || 0;
        }
        state.accounts = state.accounts.filter(
          (account) => account._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAccountError, resetAccounts, updateAccountBalance } =
  accountSlice.actions;
export default accountSlice.reducer;
