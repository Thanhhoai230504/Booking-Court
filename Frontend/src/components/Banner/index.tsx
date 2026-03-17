import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";

interface BannerProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Banner: React.FC<BannerProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #006837 0%, #2E7D32 30%, #43A047 60%, #66BB6A 100%)",
        position: "relative",
        overflow: "hidden",
        py: { xs: 4, md: 6 },
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: "20%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "60%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            color: "white",
            fontWeight: 800,
            textAlign: "center",
            mb: 1,
            fontSize: { xs: "1.5rem", md: "2.2rem" },
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          🏓 Đặt Sân Pickleball
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            mb: 3,
            fontSize: { xs: "0.9rem", md: "1.05rem" },
            fontWeight: 400,
          }}
        >
          Tìm và đặt sân Pickleball gần bạn - nhanh chóng, tiện lợi
        </Typography>

        {/* Search bar */}
        <Paper
          elevation={0}
          sx={{
            maxWidth: 650,
            mx: "auto",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          <TextField
            fullWidth
            placeholder="Tìm kiếm sân theo tên, địa chỉ..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#006837" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <FilterList sx={{ color: "#999", cursor: "pointer" }} />
                </InputAdornment>
              ),
              sx: {
                py: 0.5,
                px: 1,
                "& fieldset": { border: "none" },
                fontSize: "0.95rem",
              },
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default Banner;
