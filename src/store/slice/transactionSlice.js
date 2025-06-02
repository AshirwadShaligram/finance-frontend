import api from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to fetch transactions
const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/transactions");
      return response.data;
    } catch (error) {
      console.error("transactions/fetchTransactions error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

// Async thunk to create a transaction
const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      // Transform the data to match backend expectations
      const backendData = {
        amount: transactionData.amount,
        description: transactionData.description,
        date: transactionData.date,
        type: transactionData.type,
        category: transactionData.categoryId, // ← Convert categoryId to category
        account: transactionData.accountId, // ← Convert accountId to account
      };

      const response = await api.post("/api/transactions", backendData);
      return response.data;
    } catch (error) {
      console.error("Create transaction error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create transaction"
      );
    }
  }
);

// Async thunk to update transaction
const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      // Transform the data to match backend expectations
      const backendData = {
        amount: transactionData.amount,
        description: transactionData.description,
        date: transactionData.date,
        type: transactionData.type,
        category: transactionData.categoryId, // ← Convert categoryId to category
        account: transactionData.accountId, // ← Convert accountId to account
      };

      const response = await api.put(`/api/transactions/${id}`, backendData);
      return response.data;
    } catch (error) {
      console.error("Update transaction error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update transaction"
      );
    }
  }
);

// Async thunk to delete transaction
const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete transaction"
      );
    }
  }
);

// Async thunk to fetch financial summary
const fetchFinancialSummary = createAsyncThunk(
  "transactions/fetchFinancialSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/transactions/summary");

      return response.data;
    } catch (error) {
      console.error("transactions/fetchFinancialSummary error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch financial summary"
      );
    }
  }
);

const initialState = {
  transactions: [],
  financialSummary: {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  },
  loading: false,
  summaryLoading: false,
  error: null,
  summaryError: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    clearSummaryError: (state) => {
      state.summaryError = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.summaryError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch transactions
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.transactions = action.payload;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create Transaction
    builder.addCase(createTransaction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTransaction.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions.push(action.payload);
    });
    builder.addCase(createTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Transaction
    builder.addCase(updateTransaction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTransaction.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.transactions.findIndex(
        (transaction) => transaction._id === action.payload._id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    });
    builder.addCase(updateTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete Transaction
    builder.addCase(deleteTransaction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = state.transactions.filter(
        (transaction) => transaction._id !== action.payload
      );
    });
    builder.addCase(deleteTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Financial Summary
    builder.addCase(fetchFinancialSummary.pending, (state) => {
      state.summaryLoading = true;
      state.summaryError = null;
    });
    builder.addCase(fetchFinancialSummary.fulfilled, (state, action) => {
      state.summaryLoading = false;
      state.summaryError = null;
      state.financialSummary = action.payload;
    });
    builder.addCase(fetchFinancialSummary.rejected, (state, action) => {
      state.summaryLoading = false;
      state.summaryError = action.payload;
    });
  },
});

export {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchFinancialSummary,
};

export const { clearTransactionError, clearSummaryError, clearAllErrors } =
  transactionSlice.actions;

export default transactionSlice.reducer;
