import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import authReducer from "./slice/authSlice";
import accountReducer from "./slice/accountSlice";
import categoryReducer from "./slice/categorySlice";
import transactionReducer from "./slice/transactionSlice";

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
  accounts: accountReducer,
  categories: categoryReducer,
  transactions: transactionReducer,
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
});

// Create persistor
export const persistor = persistStore(store);
