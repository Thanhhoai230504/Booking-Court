import { Court, User, Booking, Drink, CourtTimeSlots, TimeSlot } from '../types';

// ============ MOCK USERS ============
export const mockUsers: User[] = [
    {
        _id: 'user001',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        phone: '0901234567',
        role: 'customer',
        isAdmin: false,
        createdAt: '2024-01-15T08:00:00Z',
    },
    {
        _id: 'user002',
        name: 'Trần Thị Bích',
        email: 'bich.tran@email.com',
        phone: '0912345678',
        role: 'customer',
        isAdmin: false,
        createdAt: '2024-02-01T10:00:00Z',
    },
    {
        _id: 'admin001',
        name: 'Lê Minh Quản',
        email: 'quan.le@email.com',
        phone: '0987654321',
        role: 'admin',
        isAdmin: true,
        createdAt: '2024-01-01T08:00:00Z',
    },
];

// ============ MOCK COURTS ============
export const mockCourts: Court[] = [
    {
        _id: 'court001',
        name: 'Pickleball Quận 7 Center',
        address: '123 Nguyễn Thị Thập, Quận 7',
        city: 'Hồ Chí Minh',
        images: ['/courts/court1.jpg'],
        description: 'Sân Pickleball cao cấp với hệ thống chiếu sáng LED hiện đại, mặt sân chuyên nghiệp tiêu chuẩn quốc tế.',
        totalCourts: 4,
        status: 'active',
        openingHours: { start: '06:00', end: '22:00' },
        pricePerHour: 150000,
        hourlyPricing: [
            { hour: '06:00-08:00', price: 100000 },
            { hour: '08:00-17:00', price: 150000 },
            { hour: '17:00-22:00', price: 200000 },
        ],
        adminId: 'admin001',
        createdAt: '2024-01-10T08:00:00Z',
        rating: 4.8,
        reviewCount: 125,
    },
    {
        _id: 'court002',
        name: 'Thủ Đức Pickle Arena',
        address: '456 Võ Văn Ngân, Thủ Đức',
        city: 'Hồ Chí Minh',
        images: ['/courts/court2.jpg'],
        description: 'Sân rộng rãi, thoáng mát, có khu vực nghỉ ngơi và quán nước tiện lợi cho người chơi.',
        totalCourts: 3,
        status: 'active',
        openingHours: { start: '05:30', end: '22:30' },
        pricePerHour: 120000,
        hourlyPricing: [
            { hour: '05:30-08:00', price: 80000 },
            { hour: '08:00-17:00', price: 120000 },
            { hour: '17:00-22:30', price: 180000 },
        ],
        adminId: 'admin001',
        createdAt: '2024-01-15T08:00:00Z',
        rating: 4.5,
        reviewCount: 89,
    },
    {
        _id: 'court003',
        name: 'Phú Nhuận Pickleball Club',
        address: '789 Phan Xích Long, Phú Nhuận',
        city: 'Hồ Chí Minh',
        images: ['/courts/court3.jpg'],
        description: 'Câu lạc bộ Pickleball đẳng cấp, phù hợp cho cả người mới bắt đầu và chuyên nghiệp.',
        totalCourts: 2,
        status: 'active',
        openingHours: { start: '06:00', end: '21:00' },
        pricePerHour: 180000,
        hourlyPricing: [
            { hour: '06:00-08:00', price: 120000 },
            { hour: '08:00-17:00', price: 180000 },
            { hour: '17:00-21:00', price: 220000 },
        ],
        adminId: 'admin001',
        createdAt: '2024-02-01T08:00:00Z',
        rating: 4.9,
        reviewCount: 210,
    },
    {
        _id: 'court004',
        name: 'Bình Thạnh Sports Complex',
        address: '321 Điện Biên Phủ, Bình Thạnh',
        city: 'Hồ Chí Minh',
        images: ['/courts/court4.jpg'],
        description: 'Tổ hợp thể thao đa năng với sân Pickleball trong nhà, điều hòa mát mẻ quanh năm.',
        totalCourts: 6,
        status: 'active',
        openingHours: { start: '06:00', end: '23:00' },
        pricePerHour: 200000,
        hourlyPricing: [
            { hour: '06:00-08:00', price: 140000 },
            { hour: '08:00-17:00', price: 200000 },
            { hour: '17:00-23:00', price: 250000 },
        ],
        adminId: 'admin001',
        createdAt: '2024-02-10T08:00:00Z',
        rating: 4.7,
        reviewCount: 156,
    },
    {
        _id: 'court005',
        name: 'Tân Bình Pickle Zone',
        address: '555 Cộng Hòa, Tân Bình',
        city: 'Hồ Chí Minh',
        images: ['/courts/court5.jpg'],
        description: 'Sân Pickleball ngoài trời với không gian xanh mát, giá cả phải chăng phù hợp cho mọi người.',
        totalCourts: 3,
        status: 'active',
        openingHours: { start: '05:00', end: '21:00' },
        pricePerHour: 90000,
        hourlyPricing: [
            { hour: '05:00-08:00', price: 60000 },
            { hour: '08:00-17:00', price: 90000 },
            { hour: '17:00-21:00', price: 130000 },
        ],
        adminId: 'admin001',
        createdAt: '2024-03-01T08:00:00Z',
        rating: 4.3,
        reviewCount: 67,
    },
    {
        _id: 'court006',
        name: 'Gò Vấp Premium Court',
        address: '888 Quang Trung, Gò Vấp',
        city: 'Hồ Chí Minh',
        images: ['/courts/court6.jpg'],
        description: 'Sân Pickleball Premium với đầy đủ tiện nghi: phòng thay đồ, tủ khóa, khu vực warm-up.',
        totalCourts: 4,
        status: 'active',
        openingHours: { start: '06:00', end: '22:00' },
        pricePerHour: 160000,
        hourlyPricing: [
            { hour: '06:00-08:00', price: 110000 },
            { hour: '08:00-17:00', price: 160000 },
            { hour: '17:00-22:00', price: 210000 },
        ],
        adminId: 'admin001',
        createdAt: '2024-03-10T08:00:00Z',
        rating: 4.6,
        reviewCount: 98,
    },
];

// ============ MOCK BOOKINGS ============
export const mockBookings: Booking[] = [
    {
        _id: 'bk001',
        bookingNumber: 'BK17080001',
        customerId: 'user001',
        courtId: 'court001',
        adminId: 'admin001',
        bookingType: 'single',
        customerName: 'Nguyễn Văn An',
        customerPhone: '0901234567',
        startDate: '2026-03-07',
        endDate: '2026-03-07',
        startTime: '08:00',
        endTime: '10:00',
        durationHours: 2,
        courtPrice: 300000,
        drinkItems: [],
        totalDrinkPrice: 0,
        totalPrice: 300000,
        status: 'CONFIRMED',
        paymentMethod: 'online',
        paymentStatus: 'completed',
        createdAt: '2026-03-05T10:00:00Z',
        approvedAt: '2026-03-05T10:30:00Z',
    },
    {
        _id: 'bk002',
        bookingNumber: 'BK17080002',
        customerId: 'user001',
        courtId: 'court003',
        adminId: 'admin001',
        bookingType: 'single',
        customerName: 'Nguyễn Văn An',
        customerPhone: '0901234567',
        startDate: '2026-03-08',
        endDate: '2026-03-08',
        startTime: '14:00',
        endTime: '16:00',
        durationHours: 2,
        courtPrice: 360000,
        drinkItems: [
            { drinkId: 'drink001', name: 'Nước suối', price: 10000, quantity: 2, addedAt: '2026-03-08T14:30:00Z' },
        ],
        totalDrinkPrice: 20000,
        totalPrice: 380000,
        status: 'PENDING_APPROVAL',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        createdAt: '2026-03-06T08:00:00Z',
    },
    {
        _id: 'bk003',
        bookingNumber: 'BK17080003',
        customerId: 'user001',
        courtId: 'court002',
        adminId: 'admin001',
        bookingType: 'recurring',
        customerName: 'Nguyễn Văn An',
        customerPhone: '0901234567',
        startDate: '2026-03-10',
        endDate: '2026-03-10',
        startTime: '17:00',
        endTime: '19:00',
        durationHours: 2,
        courtPrice: 360000,
        drinkItems: [],
        totalDrinkPrice: 0,
        totalPrice: 360000,
        status: 'CONFIRMED',
        paymentMethod: 'online',
        paymentStatus: 'completed',
        recurringRule: {
            frequency: 'weekly',
            interval: 1,
            endDate: '2026-05-10',
            recurringBookingIds: [],
        },
        createdAt: '2026-03-04T14:00:00Z',
        approvedAt: '2026-03-04T14:15:00Z',
    },
    {
        _id: 'bk004',
        bookingNumber: 'BK17080004',
        customerId: 'user002',
        courtId: 'court001',
        adminId: 'admin001',
        bookingType: 'single',
        customerName: 'Trần Thị Bích',
        customerPhone: '0912345678',
        startDate: '2026-03-07',
        endDate: '2026-03-07',
        startTime: '14:00',
        endTime: '15:00',
        durationHours: 1,
        courtPrice: 150000,
        drinkItems: [],
        totalDrinkPrice: 0,
        totalPrice: 150000,
        status: 'COMPLETED',
        paymentMethod: 'cash',
        paymentStatus: 'completed',
        createdAt: '2026-03-01T09:00:00Z',
        completedAt: '2026-03-07T15:00:00Z',
    },
];

// ============ MOCK DRINKS ============
export const mockDrinks: Drink[] = [
    { _id: 'drink001', name: 'Nước suối', price: 10000, quantity: 100, minStock: 20, adminId: 'admin001', description: 'Nước suối Aquafina 500ml', createdAt: '2024-01-01T00:00:00Z' },
    { _id: 'drink002', name: 'Trà đá', price: 5000, quantity: 200, minStock: 30, adminId: 'admin001', description: 'Trà đá truyền thống', createdAt: '2024-01-01T00:00:00Z' },
    { _id: 'drink003', name: 'Bia Saigon', price: 30000, quantity: 50, minStock: 10, adminId: 'admin001', description: 'Bia Saigon Special', createdAt: '2024-01-01T00:00:00Z' },
    { _id: 'drink004', name: 'Nước cam', price: 25000, quantity: 40, minStock: 10, adminId: 'admin001', description: 'Nước cam tươi vắt', createdAt: '2024-01-01T00:00:00Z' },
    { _id: 'drink005', name: 'Coca-Cola', price: 15000, quantity: 80, minStock: 15, adminId: 'admin001', description: 'Coca-Cola lon 330ml', createdAt: '2024-01-01T00:00:00Z' },
    { _id: 'drink006', name: 'Nước dừa', price: 20000, quantity: 30, minStock: 10, adminId: 'admin001', description: 'Nước dừa tươi', createdAt: '2024-01-01T00:00:00Z' },
];

// ============ BANNER DATA ============
export const mockBanners = [
    {
        id: 1,
        title: 'Chào mừng đến Pickleball!',
        subtitle: 'Đặt sân ngay hôm nay - Giảm 20% cho lần đặt đầu tiên',
        gradient: 'linear-gradient(135deg, #006D38 0%, #00894A 50%, #43A047 100%)',
    },
    {
        id: 2,
        title: 'Khuyến mãi cuối tuần',
        subtitle: 'Giảm 30% vào Thứ 7 & Chủ nhật cho khung giờ sáng',
        gradient: 'linear-gradient(135deg, #1E88E5 0%, #42A5F5 50%, #64B5F6 100%)',
    },
    {
        id: 3,
        title: 'Giải đấu Pickleball 2026',
        subtitle: 'Đăng ký ngay - Giải thưởng hấp dẫn lên đến 50 triệu',
        gradient: 'linear-gradient(135deg, #D4A017 0%, #E8B838 50%, #FFD54F 100%)',
    },
];

// ============ HELPERS ============
export const generateTimeSlots = (courtId: string, date: string): CourtTimeSlots[] => {
    const court = mockCourts.find(c => c._id === courtId);
    if (!court) return [];

    const startHour = parseInt(court.openingHours.start.split(':')[0]);
    const endHour = parseInt(court.openingHours.end.split(':')[0]);

    const courtSlots: CourtTimeSlots[] = [];

    for (let i = 0; i < court.totalCourts; i++) {
        const slots: TimeSlot[] = [];
        for (let h = startHour; h < endHour; h++) {
            const time = `${h.toString().padStart(2, '0')}:00`;
            const booking = mockBookings.find(
                b =>
                    b.courtId === courtId &&
                    b.startDate === date &&
                    parseInt(b.startTime.split(':')[0]) <= h &&
                    parseInt(b.endTime.split(':')[0]) > h
            );

            let status: TimeSlot['status'] = 'available';
            if (booking) {
                status = 'booked';
            } else if (Math.random() < 0.1) {
                status = 'locked';
            }

            slots.push({
                time,
                status,
                bookingId: booking?._id,
            });
        }
        courtSlots.push({
            courtName: `Sân ${String.fromCharCode(65 + i)}`,
            courtIndex: i,
            slots,
        });
    }

    return courtSlots;
};

export const currentUser = mockUsers[0];
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return `${days[date.getDay()]}, ${date.toLocaleDateString('vi-VN')}`;
};
