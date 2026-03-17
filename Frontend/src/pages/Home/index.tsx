import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Skeleton,
  Alert,
} from '@mui/material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchAvailableCourts } from '../../store/slices/courtSlice';

import CourtCard from '../../components/SlideBar';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courts, isLoading, error } = useSelector((state: RootState) => state.courts);

  useEffect(() => {
    dispatch(fetchAvailableCourts());
  }, [dispatch]);

  return (
    <Box>

      {/* Court Grid */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton
                  variant="rounded"
                  height={340}
                  sx={{ borderRadius: 3 }}
                  animation="wave"
                />
              </Grid>
            ))}
          </Grid>
        ) : courts.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              animation: 'fadeIn 0.5s ease',
            }}
          >
            <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
              🏓
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.secondary" gutterBottom>
              Không tìm thấy sân nào
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hãy thử tìm kiếm với từ khóa khác hoặc bỏ filter
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courts.map((court, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={court._id}
                sx={{
                  animation: `fadeInUp 0.5s ease forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                <CourtCard court={court} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Home;
