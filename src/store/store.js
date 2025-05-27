import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import authReducer from "./slice/authSlice";
import accountReducer from "./slice/accountSlice"; // Add this import

// Persist config
const persistConfig = {
  key: "root",
  storage,
  // Only persist auth and accounts data
  whitelist: ["auth", "accounts"],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  accounts: accountReducer, // Add accounts reducer
  // Add more reducers here as you create them
  // transactions: transactionReducer,
  // categories: categoryReducer,
  // etc.
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
export const persistor = persistStore(store);
