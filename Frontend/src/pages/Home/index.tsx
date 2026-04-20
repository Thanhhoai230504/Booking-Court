import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Grid,
  Typography,
  Skeleton,
  Chip,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Paper,
  InputAdornment,
} from "@mui/material";
import { FilterList, Search, LocationOn } from "@mui/icons-material";
import { AppDispatch, RootState } from "../../store/store";
import { fetchAvailableCourts } from "../../store/slices/courtSlice";
import Banner from "../../components/Banner";
import CourtCard from "../../components/CourtCard";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courts, isLoading, error } = useSelector(
    (state: RootState) => state.courts,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  useEffect(() => {
    dispatch(fetchAvailableCourts());
  }, [dispatch]);

  const filteredCourts = useMemo(() => {
    let filtered = courts;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (court) =>
          court.name.toLowerCase().includes(search) ||
          court.address.toLowerCase().includes(search) ||
          (court.city && court.city.toLowerCase().includes(search)) ||
          (court.district && court.district.toLowerCase().includes(search)),
      );
    }
    if (districtFilter) {
      filtered = filtered.filter((court) => court.district === districtFilter);
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (court) => court.pricePerHour <= Number(maxPrice),
      );
    }
    return filtered;
  }, [courts, searchTerm, districtFilter, maxPrice]);

  const districts = useMemo(() => {
    const districtSet = new Set(courts.map((c) => c.district).filter(Boolean));
    return Array.from(districtSet) as string[];
  }, [courts]);

  return (
    <Box>
      <Banner searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Filter bar */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: "1px solid #e0e0e0",
          bgcolor: "white",
          py: 2,
          position: "sticky",
          top: 72,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#006837",
              }}
            >
              <FilterList />
              <Typography fontWeight={600} fontSize="0.9rem">
                Bộ lọc
              </Typography>
            </Box>

            {districts.length > 0 && (
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Quận/Huyện</InputLabel>
                <Select
                  value={districtFilter}
                  label="Quận/Huyện"
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {districts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Giá tối đa</InputLabel>
              <Select
                value={maxPrice}
                label="Giá tối đa"
                onChange={(e) => setMaxPrice(e.target.value as number | "")}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value={100000}>Dưới 100.000đ</MenuItem>
                <MenuItem value={150000}>Dưới 150.000đ</MenuItem>
                <MenuItem value={200000}>Dưới 200.000đ</MenuItem>
                <MenuItem value={300000}>Dưới 300.000đ</MenuItem>
                <MenuItem value={500000}>Dưới 500.000đ</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flex: 1 }} />

            <Typography variant="body2" color="text.secondary">
              <strong style={{ color: "#006837" }}>
                {filteredCourts.length}
              </strong>{" "}
              sân được tìm thấy
            </Typography>
          </Box>
        </Container>
      </Paper>

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
        ) : filteredCourts.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              animation: "fadeIn 0.5s ease",
            }}
          >
            <Typography variant="h1" sx={{ fontSize: "4rem", mb: 2 }}>
              🏓
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              color="text.secondary"
              gutterBottom
            >
              Không tìm thấy sân nào
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hãy thử tìm kiếm với từ khóa khác hoặc bỏ filter
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredCourts.map((court, index) => (
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
