import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoriteState {
  favoriteIds: string[];
}

// Load favorites from localStorage
const loadFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem('favoriteCourts');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState: FavoriteState = {
  favoriteIds: loadFavorites(),
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const courtId = action.payload;
      const index = state.favoriteIds.indexOf(courtId);
      if (index >= 0) {
        state.favoriteIds.splice(index, 1);
      } else {
        state.favoriteIds.push(courtId);
      }
      localStorage.setItem('favoriteCourts', JSON.stringify(state.favoriteIds));
    },
  },
});

export const { toggleFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
