export interface ProductSpecs {
  material?: string;
  color?: string;
  dimensions?: string;
  weight?: string;
  madeIn?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating?: number;
  reviewsCount?: number;
  stock?: string;
  badge?: string;
  image: string;
  thumbnails?: string[];
  desc: string;
  specs?: ProductSpecs;
  status?: 'active' | 'inactive';
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: "sofa-nordic",
    name: "Sofa 2 chỗ Nordic",
    category: "noithat",
    categoryName: "Nội thất phòng khách",
    price: 2990000,
    originalPrice: 3490000,
    discount: "-14%",
    rating: 4.8,
    reviewsCount: 36,
    stock: "Còn hàng",
    badge: "Mới",
    image: "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/sofa-phong-khach-original.webp",
      "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp",
      "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp"
    ],
    desc: "Sofa 2 chỗ phong cách Bắc Âu (Nordic) với thiết kế tối giản, êm ái, bọc vải nỉ cao cấp cùng khung gỗ tự nhiên chắc chắn. Hoàn hảo cho căn hộ hiện đại và phòng khách tinh tế.",
    specs: {
      material: "Khung gỗ sồi tự nhiên, Nỉ đệm cao cấp",
      color: "Xám ghi Nordic",
      dimensions: "160cm x 80cm x 75cm",
      weight: "28.5 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "ban-an-go-soi",
    name: "Bàn ăn gỗ Sồi",
    category: "noithat",
    categoryName: "Nội thất nhà bếp",
    price: 3490000,
    originalPrice: 3990000,
    discount: "-12%",
    rating: 4.9,
    reviewsCount: 42,
    stock: "Còn hàng",
    badge: "Mới",
    image: "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/bo-ban-an-go.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/bo-ban-an-go-original.webp",
      "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/sofa-phong-khach.webp"
    ],
    desc: "Bộ bàn ăn gỗ sồi tự nhiên nguyên khối được xử lý chống mối mọt, sơn PU mờ cao cấp bảo vệ vân gỗ tự nhiên. Phù hợp cho gia đình 4-6 người.",
    specs: {
      material: "100% Gỗ sồi tự nhiên nhập khẩu",
      color: "Gỗ tự nhiên ấm áp",
      dimensions: "140cm x 80cm x 75cm",
      weight: "32 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "den-tha-tran-minimal",
    name: "Đèn thả trần Minimal",
    category: "den",
    categoryName: "Đèn trang trí",
    price: 599000,
    originalPrice: 699000,
    discount: "-15%",
    rating: 4.7,
    reviewsCount: 29,
    stock: "Còn hàng",
    badge: "-15%",
    image: "/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/do-my-nghe/den-tre-thu-cong.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/den-tre-thu-cong-original.webp",
      "/MiniShop_Assets/assets/images/products/do-my-nghe/den-long-tre.webp"
    ],
    desc: "Đèn thả trần phong cách Minimalist kết hợp chao đèn tre đan thủ công và chi tiết gỗ tinh tế. Ánh sáng vàng dịu nhẹ tạo không gian ấm cúng cho bàn ăn hoặc phòng khách.",
    specs: {
      material: "Tre tự nhiên & Hợp kim sơn tĩnh điện",
      color: "Màu tre mộc & Trắng",
      dimensions: "Đường kính 35cm, Dây dài 120cm",
      weight: "1.2 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "binh-gom-decor",
    name: "Bình gốm Decor",
    category: "trangtri",
    categoryName: "Trang trí nhà cửa",
    price: 290000,
    originalPrice: 390000,
    discount: "-25%",
    rating: 4.9,
    reviewsCount: 54,
    stock: "Còn hàng",
    badge: "Mới",
    image: "/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/do-my-nghe/binh-gom-trang-tri.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/binh-gom-trang-tri-original.webp",
      "/MiniShop_Assets/assets/images/products/do-my-nghe/bo-binh-gom-minimal.webp"
    ],
    desc: "Bình gốm trang trí nghệ thuật chế tác thủ công từ đất sét cao cấp Bát Tràng. Lớp men rạn mịn màng, tôn vinh vẻ đẹp hoa tươi hoặc hoa khô trang trí không gian.",
    specs: {
      material: "Gốm sứ tráng men mờ Bát Tràng",
      color: "Trắng sữa & Xanh rêu",
      dimensions: "Cao 22cm, Đường kính 12cm",
      weight: "0.9 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "ke-go-da-nang",
    name: "Kệ gỗ đa năng",
    category: "noithat",
    categoryName: "Nội thất lưu trữ",
    price: 1293000,
    originalPrice: 1490000,
    discount: "-13%",
    rating: 4.6,
    reviewsCount: 22,
    stock: "Còn hàng",
    badge: "",
    image: "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/ke-go-trang-tri.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/ke-go-trang-tri-original.webp"
    ],
    desc: "Kệ gỗ nhiều tầng thiết kế thông minh giúp tiết kiệm diện tích. Phù hợp sắp xếp sách, cây cảnh mini hoặc phụ kiện trang trí trong phòng làm việc và phòng khách.",
    specs: {
      material: "Gỗ cao su tự nhiên ghép thanh",
      color: "Gỗ sồi sáng",
      dimensions: "80cm x 30cm x 120cm",
      weight: "14.5 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "gio-may-luu-tru",
    name: "Giỏ mây lưu trữ",
    category: "luutru",
    categoryName: "Đồ lưu trữ thủ công",
    price: 199000,
    originalPrice: 250000,
    discount: "-20%",
    rating: 4.8,
    reviewsCount: 38,
    stock: "Còn hàng",
    badge: "Hot",
    image: "/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/do-thu-cong/gio-may-dan.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/gio-may-dan-original.webp"
    ],
    desc: "Giỏ đan mây tre đan tay thủ công 100% tự nhiên, thân thiện với môi trường. Thích hợp đựng quần áo, đồ chơi trẻ em, hoặc làm phụ kiện chụp ảnh chụp hình decor.",
    specs: {
      material: "Mây đan tự nhiên xử lý ẩm mốc",
      color: "Vàng mây mộc",
      dimensions: "35cm x 25cm x 20cm",
      weight: "0.6 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "chau-cay-de-ban",
    name: "Chậu cây để bàn",
    category: "trangtri",
    categoryName: "Trang trí không gian xanh",
    price: 150000,
    originalPrice: 180000,
    discount: "-16%",
    rating: 4.7,
    reviewsCount: 19,
    stock: "Còn hàng",
    badge: "",
    image: "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/noi-that-gia-dung/chau-cay-de-ban.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/chau-cay-de-ban-original.webp"
    ],
    desc: "Chậu cây cảnh mini để bàn làm việc giúp thanh lọc không khí, giảm căng thẳng mắt và mang lại năng lượng tích cực cho không gian sống.",
    specs: {
      material: "Chậu gốm sứ mờ & Đất dinh dưỡng",
      color: "Trắng gốm tinh khôi",
      dimensions: "Cao 18cm, Đường kính 10cm",
      weight: "0.7 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "tranh-treo-macrame",
    name: "Tranh treo Macrame",
    category: "dothucong",
    categoryName: "Nghệ thuật thủ công",
    price: 450000,
    originalPrice: 550000,
    discount: "-18%",
    rating: 4.9,
    reviewsCount: 31,
    stock: "Còn hàng",
    badge: "Mới",
    image: "/MiniShop_Assets/assets/images/products/do-thu-cong/tranh-treo-macrame.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/do-thu-cong/tranh-treo-macrame.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/tranh-treo-macrame-original.webp"
    ],
    desc: "Tranh treo tường nghệ thuật Macrame đan tay tỉ mỉ từ sợi cotton thiên nhiên phong cách Bohemian. Điểm nhấn hoàn hảo cho mảng tường phòng ngủ hoặc quầy cafe.",
    specs: {
      material: "Sợi cotton 100% & Thanh gỗ thông",
      color: "Kem tự nhiên",
      dimensions: "Dài 70cm, Rộng 45cm",
      weight: "0.8 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "khay-go-hoa-van",
    name: "Khay gỗ hoa văn",
    category: "dothucong",
    categoryName: "Đồ dùng gia đình",
    price: 320000,
    originalPrice: 380000,
    discount: "-15%",
    rating: 4.8,
    reviewsCount: 27,
    stock: "Còn hàng",
    badge: "",
    image: "/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-hoa-van.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-hoa-van.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/khay-go-hoa-van-original.webp"
    ],
    desc: "Khay phục vụ trà bánh bằng gỗ tần bì đục chạm hoa văn truyền thống tinh xảo. Bề mặt lau dầu thực vật an toàn cho thực phẩm.",
    specs: {
      material: "Gỗ tần bì cao cấp",
      color: "Nâu trầm sang trọng",
      dimensions: "38cm x 26cm x 4cm",
      weight: "0.95 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "bo-binh-gom-minimal",
    name: "Bộ bình gốm Minimal",
    category: "domynghe",
    categoryName: "Đồ mỹ nghệ cao cấp",
    price: 680000,
    originalPrice: 750000,
    discount: "-10%",
    rating: 5.0,
    reviewsCount: 45,
    stock: "Còn hàng",
    badge: "-10%",
    image: "/MiniShop_Assets/assets/images/products/do-my-nghe/bo-binh-gom-minimal.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/do-my-nghe/bo-binh-gom-minimal.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/bo-binh-gom-minimal-original.webp"
    ],
    desc: "Bộ 3 bình gốm nghệ thuật đường nét khắc chìm tối giản. Phù hợp đặt trên kệ tivi, bàn trà hoặc làm quà tặng tân gia sang trọng.",
    specs: {
      material: "Gốm sứ cao cấp nung 1300°C",
      color: "Bộ 3 màu: Kem, Xanh rêu, Trắng",
      dimensions: "Bình cao 20cm, Bình vừa 15cm, Bình nhỏ 10cm",
      weight: "1.6 kg (cả bộ)",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "den-long-tre",
    name: "Đèn lồng tre thủ công",
    category: "den",
    categoryName: "Đèn mộc mạc",
    price: 380000,
    originalPrice: 450000,
    discount: "-15%",
    rating: 4.7,
    reviewsCount: 18,
    stock: "Còn hàng",
    badge: "",
    image: "/MiniShop_Assets/assets/images/products/do-my-nghe/den-long-tre.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/do-my-nghe/den-long-tre.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/den-long-tre-original.webp"
    ],
    desc: "Đèn lồng tre đan nan nan mảnh độc đáo, tỏa ánh sáng hoa văn ấm áp lên mảng tường xung quanh. Thích hợp trang trí hiên nhà, quán trà hoặc phòng ngủ.",
    specs: {
      material: "Tre nan tự nhiên sấy khô",
      color: "Màu tre mộc đun khói",
      dimensions: "Đường kính 28cm, Cao 35cm",
      weight: "0.75 kg",
      madeIn: "Việt Nam"
    }
  },
  {
    id: "khay-go-trang-tri",
    name: "Khay gỗ trang trí",
    category: "dothucong",
    categoryName: "Đồ trang trí bàn",
    price: 250000,
    originalPrice: 300000,
    discount: "-16%",
    rating: 4.8,
    reviewsCount: 16,
    stock: "Còn hàng",
    badge: "",
    image: "/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-trang-tri.webp",
    thumbnails: [
      "/MiniShop_Assets/assets/images/products/do-thu-cong/khay-go-trang-tri.webp",
      "/MiniShop_Assets/assets/images/products/San_pham/khay-go-trang-tri-original.webp"
    ],
    desc: "Khay gỗ vuông tối giản viền bo tròn mềm mại. Thích hợp làm khay mứt, khay đựng nến thơm hoặc đồ trang sức nhỏ trên bàn trang điểm.",
    specs: {
      material: "Gỗ dẻ sấy khô nguyên thanh",
      color: "Gỗ sồi vàng nhạt",
      dimensions: "25cm x 25cm x 3cm",
      weight: "0.45 kg",
      madeIn: "Việt Nam"
    }
  }
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS_DATA.find(p => p.id === id);
}

export function getRelatedProducts(currentId: string, category: string, limit = 5): Product[] {
  const sameCategory = PRODUCTS_DATA.filter(p => p.category === category && p.id !== currentId);
  const others = PRODUCTS_DATA.filter(p => p.category !== category && p.id !== currentId);
  return [...sameCategory, ...others].slice(0, limit);
}

export function formatVND(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}
