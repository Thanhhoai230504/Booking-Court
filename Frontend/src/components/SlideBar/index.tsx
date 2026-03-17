import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import {
  AccessTime,
  LocationOn,
  FavoriteBorder,
  Share,
  Star,
} from "@mui/icons-material";
import { Court } from "../../types";
import BookingTypeDialog from "../BookingTypeDialog";

interface CourtCardProps {
  court: Court;
}

// Default placeholder images for courts
const defaultImages = [
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1622279457486-62dbd5142baa?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop",
];

const CourtCard: React.FC<CourtCardProps> = ({ court }) => {
  const navigate = useNavigate();
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const courtImage =
    court.images && court.images.length > 0
      ? court.images[0]
      : defaultImages[Math.floor(Math.random() * defaultImages.length)];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 40px rgba(0, 104, 55, 0.15)",
        },
      }}
      onClick={() => navigate(`/courts/${court._id}`)}
    >
      {/* Image section */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="div"
          sx={{
            height: 200,
            backgroundImage: `url(${courtImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#e0e0e0",
          }}
        />

        {/* Overlay badges */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 0.5,
          }}
        >
          <Chip
            label="Đơn ngày"
            size="small"
            sx={{
              bgcolor: "#006837",
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
              height: 24,
            }}
          />
          {court.totalCourts > 1 && (
            <Chip
              icon={<Star sx={{ fontSize: 14, color: "#FFD700 !important" }} />}
              label={court.totalCourts + " sân"}
              size="small"
              sx={{
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
                height: 24,
              }}
            />
          )}
        </Box>

        {/* Action buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 0.5,
          }}
        >
          <IconButton
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "white", color: "#C62828" },
              width: 32,
              height: 32,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FavoriteBorder sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "white" },
              width: 32,
              height: 32,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Share sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Status badge */}
        {court.status !== "active" && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor:
                court.status === "maintenance"
                  ? "rgba(249, 168, 37, 0.9)"
                  : "rgba(198, 40, 40, 0.9)",
              color: "white",
              textAlign: "center",
              py: 0.5,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {court.status === "maintenance" ? "Đang bảo trì" : "Tạm ngưng"}
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent
        sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#1a1a1a",
          }}
        >
          {court.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "start", gap: 0.5, mb: 1 }}>
          <LocationOn
            sx={{ fontSize: 16, color: "#006837", mt: 0.2, flexShrink: 0 }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.8rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.4,
            }}
          >
            {court.address}
            {court.city ? `, ${court.city}` : ""}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
          <AccessTime sx={{ fontSize: 16, color: "#757575" }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.8rem" }}
          >
            {court.openingHours?.start || "06:00"} -{" "}
            {court.openingHours?.end || "22:00"}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: "#006837",
              fontSize: "1rem",
            }}
          >
            {formatPrice(court.pricePerHour)}/giờ
          </Typography>

          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#006837",
              fontWeight: 700,
              fontSize: "0.8rem",
              px: 2.5,
              py: 0.8,
              borderRadius: 2,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              "&:hover": {
                bgcolor: "#004D25",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowBookingDialog(true);
            }}
          >
            ĐẶT LỊCH
          </Button>
        </Box>
      </CardContent>

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
    </Card>
  );
};

export default CourtCard;
