import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Skeleton,
  Alert,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  ArrowBack,
  LocationOn,
  AccessTime,
  Phone,
  AttachMoney,
  SportsTennis,
  Share,
  FavoriteBorder,
  Favorite,
  CalendarMonth,
  Info,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "../../store/store";
import { fetchCourtDetail } from "../../store/slices/courtSlice";
import BookingTypeDialog from "@/components/BookingTypeDialog";

const defaultImages = [
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1622279457486-62dbd5142baa?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=500&fit=crop",
];

const CourtDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    selectedCourt: court,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.courts);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourtDetail(id));
    }
  }, [id, dispatch]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const images =
    court?.images && court.images.length > 0 ? court.images : defaultImages;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton
          variant="rounded"
          height={400}
          sx={{ borderRadius: 3, mb: 3 }}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!court) return null;

  return (
    <Box>
      {/* Image Hero Section */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            height: { xs: 280, md: 420 },
            backgroundImage: `url(${images[selectedImage]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#e0e0e0",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)",
            }}
          />

          {/* Top controls */}
          <Container
            maxWidth="lg"
            sx={{ position: "relative", zIndex: 1, pt: 2 }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "white" },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => setLiked(!liked)}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" },
                  }}
                >
                  {liked ? (
                    <Favorite sx={{ color: "#C62828" }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" },
                  }}
                >
                  <Share />
                </IconButton>
              </Box>
            </Box>
          </Container>

          {/* Court name overlay */}
          <Container
            maxWidth="lg"
            sx={{
              position: "absolute",
              bottom: 24,
              left: 0,
              right: 0,
              zIndex: 1,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <Chip
                label="Đơn ngày"
                size="small"
                sx={{
                  bgcolor: "#006837",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
              <Chip
                label={
                  court.status === "active"
                    ? "Đang hoạt động"
                    : court.status === "maintenance"
                      ? "Bảo trì"
                      : "Ngưng hoạt động"
                }
                size="small"
                sx={{
                  bgcolor:
                    court.status === "active"
                      ? "rgba(76,175,80,0.9)"
                      : "rgba(198,40,40,0.9)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 800,
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {court.name}
            </Typography>
          </Container>
        </Box>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: -3,
                position: "relative",
                zIndex: 2,
                overflowX: "auto",
                pb: 1,
              }}
            >
              {images.slice(0, 5).map((img, i) => (
                <Box
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  sx={{
                    width: 80,
                    height: 56,
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      selectedImage === i
                        ? "3px solid #006837"
                        : "3px solid white",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Container>
        )}
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Left - Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Info sx={{ color: "#006837" }} /> Thông tin sân
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <LocationOn sx={{ color: "#006837", mt: 0.2 }} />
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize="0.8rem"
                      >
                        Địa chỉ
                      </Typography>
                      <Typography fontWeight={600}>
                        {court.address}
                        {court.city ? `, ${court.city}` : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <AccessTime sx={{ color: "#006837", mt: 0.2 }} />
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize="0.8rem"
                      >
                        Giờ hoạt động
                      </Typography>
                      <Typography fontWeight={600}>
                        {court.openingHours?.start || "06:00"} -{" "}
                        {court.openingHours?.end || "22:00"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <SportsTennis sx={{ color: "#006837", mt: 0.2 }} />
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize="0.8rem"
                      >
                        Số lượng sân
                      </Typography>
                      <Typography fontWeight={600}>
                        {court.totalCourts} sân
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <AttachMoney sx={{ color: "#006837", mt: 0.2 }} />
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize="0.8rem"
                      >
                        Giá thuê
                      </Typography>
                      <Typography
                        fontWeight={700}
                        color="#006837"
                        fontSize="1.1rem"
                      >
                        {formatPrice(court.pricePerHour)}/giờ
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {court.adminId && typeof court.adminId === "object" && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "#F1F8E9", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Phone sx={{ color: "#006837" }} />
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize="0.8rem"
                      >
                        Chủ sân
                      </Typography>
                      <Typography fontWeight={600}>
                        {court.adminId.name} - {court.adminId.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>

            {court.description && (
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Mô tả
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography color="text.secondary" lineHeight={1.8}>
                  {court.description}
                </Typography>
              </Paper>
            )}

            {/* Hourly pricing table */}
            {court.hourlyPricing && court.hourlyPricing.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Bảng giá theo giờ
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                  {court.hourlyPricing.map((hp, i) => (
                    <Grid item xs={6} sm={4} md={3} key={i}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          borderRadius: 2,
                          borderColor: "#E0E0E0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize="0.8rem"
                        >
                          {hp.hour}
                        </Typography>
                        <Typography fontWeight={700} color="#006837">
                          {formatPrice(hp.price)}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* Right - Booking CTA */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                position: "sticky",
                top: 100,
                border: "2px solid #E8F5E9",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CalendarMonth sx={{ color: "#006837" }} /> Đặt sân
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  textAlign: "center",
                  py: 3,
                  px: 2,
                  bgcolor: "#F1F8E9",
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Typography variant="h4" fontWeight={800} color="#006837">
                  {formatPrice(court.pricePerHour)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  /giờ
                </Typography>
              </Box>

              <Box
                sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Chip
                    label={
                      court.status === "active" ? "Sẵn sàng" : "Không khả dụng"
                    }
                    size="small"
                    sx={{
                      bgcolor:
                        court.status === "active" ? "#E8F5E9" : "#FFEBEE",
                      color: court.status === "active" ? "#2E7D32" : "#C62828",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Giờ mở cửa
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {court.openingHours?.start} - {court.openingHours?.end}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={court.status !== "active"}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                  } else {
                    setShowBookingDialog(true);
                  }
                }}
                sx={{
                  bgcolor: "#006837",
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  "&:hover": { bgcolor: "#004D25" },
                  "&:disabled": { bgcolor: "#ccc" },
                }}
              >
                ĐẶT LỊCH NGAY
              </Button>

              {!isAuthenticated && (
                <Typography
                  variant="body2"
                  textAlign="center"
                  color="text.secondary"
                  sx={{ mt: 1.5, fontSize: "0.8rem" }}
                >
                  Bạn cần{" "}
                  <Typography
                    component={Link}
                    to="/login"
                    variant="body2"
                    sx={{ color: "#006837", fontWeight: 600 }}
                  >
                    đăng nhập
                  </Typography>{" "}
                  để đặt sân
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Booking type selection dialog */}
      <BookingTypeDialog
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        onSelectDaily={() => {
          setShowBookingDialog(false);
          navigate(`/booking-schedule/${court._id}`);
        }}
        onSelectEvent={() => {
          setShowBookingDialog(false);
          navigate(`/booking/${court._id}`);
        }}
      />
    </Box>
  );
};

export default CourtDetail;
