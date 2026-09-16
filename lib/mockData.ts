export interface MenuItem {
  id: string;
  name: string;
  nameSw: string;
  description: string;
  descriptionSw: string;
  price: number; // USD
  category: string;
  categorySw: string;
  image: string;
  popular: boolean;
  isChefSpecial?: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
}

export interface VerificationStep {
  id: string;
  name: string;
  nameSw: string;
  status: 'passed' | 'failed' | 'pending';
  date: string;
  notes: string;
  notesSw: string;
  icon: string; // lucide icon name
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  descriptionSw: string;
  image: string;
  hygieneScore: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  priceRange: '$' | '$$' | '$$$';
  avgDishPriceUSD: number;
  phone: string;
  whatsapp: string;
  prepTime: string;
  distance: number;
  lat: number;
  lng: number;
  city: string;
  neighborhood: string;
  categories: string[];
  categoriesSw: string[];
  menu: MenuItem[];
  verificationSteps: VerificationStep[];
  openNow: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  restaurantName: string;
  restaurantId: string;
  content: string;
  contentSw: string;
  type: 'hygiene_report' | 'review' | 'whistleblow';
  rating: number;
  upvotes: number;
  date: string;
  image: string;
  verified: boolean;
}

export interface RelocationGuide {
  id: string;
  city: string;
  title: string;
  titleSw: string;
  description: string;
  descriptionSw: string;
  topSpots: number;
  image: string;
  safetyTips: string[];
  safetyTipsSw: string[];
}

export interface OrderStep {
  id: string;
  label: string;
  labelSw: string;
  completed: boolean;
  active: boolean;
  time?: string;
}

/* ──────────────────────────────────────────────────────────
   ARUSHA-ONLY RESTAURANT DATA
   All coordinates are real Arusha, Tanzania lat/lng
   Neighborhoods: Ngarenaro · Majengo · Clock Tower / CBD · Njiro
────────────────────────────────────────────────────────── */

const defaultVerificationSteps: VerificationStep[] = [
  {
    id: 'v1',
    name: 'Kitchen Sanitation Audit',
    nameSw: 'Ukaguzi wa Usafi wa Jiko',
    status: 'passed',
    date: '2026-07-15',
    notes: 'All surfaces clean, food stored at correct temperatures, no rodent evidence.',
    notesSw: 'Nyuso zote ni safi, chakula kimehifadhiwa kwa joto sahihi, hakuna ushahidi wa panya.',
    icon: 'Utensils',
  },
  {
    id: 'v2',
    name: 'Water Source Certification',
    nameSw: 'Uthibitisho wa Chanzo cha Maji',
    status: 'passed',
    date: '2026-07-15',
    notes: 'Municipal supply confirmed. Water tested — no bacterial contamination.',
    notesSw: 'Maji ya mji yamethibitishwa. Maji yalipimwa — hakuna uchafuzi wa bakteria.',
    icon: 'Droplets',
  },
  {
    id: 'v3',
    name: 'Staff Health Licensing',
    nameSw: 'Leseni ya Afya ya Wafanyakazi',
    status: 'passed',
    date: '2026-07-10',
    notes: 'All 6 food-handling staff hold valid health certificates.',
    notesSw: 'Wafanyakazi wote 6 wanaoshughulikia chakula wana vyeti vya afya halali.',
    icon: 'HeartPulse',
  },
  {
    id: 'v4',
    name: 'Food Storage Compliance',
    nameSw: 'Uzingatifu wa Uhifadhi wa Chakula',
    status: 'passed',
    date: '2026-08-01',
    notes: 'Refrigeration units functioning. FIFO labeling in place.',
    notesSw: 'Friji zinafanya kazi. Lebo za FIFO zimewekwa mahali pake.',
    icon: 'PackageCheck',
  },
];

export const mockRestaurants: Restaurant[] = [
  /* ── 1. Ngarenaro ── */
  {
    id: 'r-aru-001',
    name: "Mama Zawadi's Kitchen",
    description:
      'A beloved Ngarenaro institution serving hearty Tanzanian home-cooking since 1998. Famous for their slow-cooked Nyama Choma and Ugali with Mchuzi wa Nyama.',
    descriptionSw:
      'Mkahawa unaopendwa katika Ngarenaro unaotumikia chakula cha nyumbani cha Tanzania tangu 1998. Maarufu kwa Nyama Choma iliyopikwa polepole na Ugali na Mchuzi wa Nyama.',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    hygieneScore: 96,
    verified: true,
    rating: 4.8,
    reviewCount: 312,
    priceRange: '$',
    avgDishPriceUSD: 2.65,
    phone: '+255754123456',
    whatsapp: '255754123456',
    prepTime: '15–25 min',
    distance: 0.6,
    lat: -3.3697,
    lng: 36.6751,
    city: 'Arusha',
    neighborhood: 'Ngarenaro',
    categories: ['Nyama Choma', 'Authentic Swahili', 'Ugali Dishes'],
    categoriesSw: ['Nyama Choma', 'Swahili Halisi', 'Ugali'],
    openNow: true,
    menu: [
      {
        id: 'm-001-1',
        name: 'Nyama Choma Full Plate',
        nameSw: 'Nyama Choma Sahani Kamili',
        description: 'Slow-grilled goat meat served with kachumbari salsa, ugali, and roasted sweet potato.',
        descriptionSw: 'Nyama ya mbuzi iliyochomwa polepole, ikiwa na kachumbari, ugali, na kiazi kitamu kilichochomwa.',
        price: 4.50,
        category: 'Grills',
        categorySw: 'Nyama Choma',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'mild',
      },
      {
        id: 'm-001-2',
        name: 'Ugali na Mchuzi wa Nyama',
        nameSw: 'Ugali na Mchuzi wa Nyama',
        description: 'Firm white ugali paired with slow-simmered beef stew in aromatic spices.',
        descriptionSw: 'Ugali mgumu nyeupe na mchuzi wa nyama ya ng\'ombe uliopikwa polepole kwa viungo vya kunukia.',
        price: 2.80,
        category: 'Ugali Dishes',
        categorySw: 'Ugali',
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'medium',
      },
      {
        id: 'm-001-3',
        name: 'Supu ya Ndizi (Banana Soup)',
        nameSw: 'Supu ya Ndizi',
        description: 'Traditional green banana soup with coconut milk, ground cardamom, and tender beef chunks.',
        descriptionSw: 'Supu ya jadi ya ndizi mbichi na maziwa ya nazi, iliki iliyosagwa, na vipande vya nyama laini.',
        price: 2.20,
        category: 'Soups',
        categorySw: 'Supu',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80',
        popular: false,
        spiceLevel: 'mild',
      },
      {
        id: 'm-001-4',
        name: 'Mandazi & Chai',
        nameSw: 'Mandazi na Chai',
        description: 'Fluffy East African doughnuts, lightly sweetened, served with spiced masala tea.',
        descriptionSw: 'Mandazi laini ya Afrika Mashariki, yenye utamu kidogo, pamoja na chai ya masala yenye viungo.',
        price: 1.10,
        category: 'Snacks & Drinks',
        categorySw: 'Vitafunio na Vinywaji',
        image: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'mild',
      },
    ],
    verificationSteps: defaultVerificationSteps,
  },

  /* ── 2. Majengo ── */
  {
    id: 'r-aru-002',
    name: 'Bahari Swahili Grill',
    description:
      'Majengo\'s top-rated coastal-style eatery bringing Zanzibar seafood flavours inland. Their Mchuzi wa Samaki is legendary in Arusha.',
    descriptionSw:
      'Mkahawa wa pwani uliopewa daraja la juu zaidi Majengo, unaoletea ladha za samaki za Zanzibar ndani ya nchi. Mchuzi wao wa Samaki ni maarufu Arusha.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    hygieneScore: 93,
    verified: true,
    rating: 4.7,
    reviewCount: 189,
    priceRange: '$$',
    avgDishPriceUSD: 3.65,
    phone: '+255784987654',
    whatsapp: '255784987654',
    prepTime: '20–30 min',
    distance: 1.1,
    lat: -3.3820,
    lng: 36.6820,
    city: 'Arusha',
    neighborhood: 'Majengo',
    categories: ['Authentic Swahili', 'Seafood', 'Coastal Cuisine'],
    categoriesSw: ['Swahili Halisi', 'Samaki', 'Chakula cha Pwani'],
    openNow: true,
    menu: [
      {
        id: 'm-002-1',
        name: 'Mchuzi wa Samaki',
        nameSw: 'Mchuzi wa Samaki',
        description: 'Whole tilapia in rich coconut-tamarind curry with pilipili hoho and fresh tomatoes. Served with wali wa nazi.',
        descriptionSw: 'Tilapia kamili katika mchuzi tajiri wa nazi-ukwaju na pilipili hoho na nyanya safi. Hutumikiwa na wali wa nazi.',
        price: 5.70,
        category: 'Seafood',
        categorySw: 'Samaki',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'medium',
      },
      {
        id: 'm-002-2',
        name: 'Wali wa Nazi (Coconut Rice)',
        nameSw: 'Wali wa Nazi',
        description: 'Long-grain rice cooked in fresh coconut milk with a pinch of turmeric.',
        descriptionSw: 'Mchele wa nafaka ndefu uliopikwa katika maziwa ya nazi safi na kidogo cha manjano.',
        price: 1.50,
        category: 'Sides',
        categorySw: 'Nyongeza',
        image: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9ef7b?auto=format&fit=crop&w=400&q=80',
        popular: false,
        spiceLevel: 'mild',
      },
      {
        id: 'm-002-3',
        name: 'Pilau Arusha',
        nameSw: 'Pilau ya Arusha',
        description: 'Fragrant pilau rice with beef, whole cardamom, cinnamon, and cloves. A staple of Arusha celebrations.',
        descriptionSw: 'Pilau yenye harufu nzuri ya nyama ya ng\'ombe, iliki nzima, mdalasini, na karafuu. Chakula cha sherehe za Arusha.',
        price: 3.80,
        category: 'Rice Dishes',
        categorySw: 'Wali na Pilau',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'medium',
      },
    ],
    verificationSteps: [
      ...defaultVerificationSteps.slice(0, 3),
      { ...defaultVerificationSteps[3], status: 'passed' },
    ],
  },

  /* ── 3. Clock Tower / CBD ── */
  {
    id: 'r-aru-003',
    name: 'Clock Tower Bites',
    description:
      'A fast, clean, and affordable lunch spot steps from Arusha Clock Tower roundabout. Packed daily with office workers craving authentic local flavours.',
    descriptionSw:
      'Mahali pa chakula cha mchana cha haraka, safi na bei nafuu karibu na mzunguko wa Clock Tower Arusha. Imejaa kila siku na wafanyakazi wanaotamani ladha za mtaani.',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    hygieneScore: 91,
    verified: true,
    rating: 4.5,
    reviewCount: 421,
    priceRange: '$',
    avgDishPriceUSD: 2.06,
    phone: '+255688555111',
    whatsapp: '255688555111',
    prepTime: '10–20 min',
    distance: 0.3,
    lat: -3.3869,
    lng: 36.6836,
    city: 'Arusha',
    neighborhood: 'Clock Tower / CBD',
    categories: ['Business Lunch', 'Local Rice', 'Chapati'],
    categoriesSw: ['Chakula cha Mchana', 'Wali wa Kawaida', 'Chapati'],
    openNow: true,
    menu: [
      {
        id: 'm-003-1',
        name: 'Business Lunch Combo',
        nameSw: 'Combo ya Chakula cha Mchana',
        description: 'Ugali or rice, choice of beef/chicken stew, steamed spinach, and a glass of tangawizi soda.',
        descriptionSw: 'Ugali au wali, mchuzi wa nyama au kuku, mchicha uliokaushwa, na glasi ya soda ya tangawizi.',
        price: 3.20,
        category: 'Business Lunch',
        categorySw: 'Chakula cha Mchana',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'mild',
      },
      {
        id: 'm-003-2',
        name: 'Chapati na Maharagwe',
        nameSw: 'Chapati na Maharagwe',
        description: 'Freshly pan-fried layered chapati with slow-cooked red kidney beans in tomato-ginger sauce.',
        descriptionSw: 'Chapati safi iliyokaangwa na maharagwe mekundu yaliyopikwa polepole katika mchuzi wa nyanya-tangawizi.',
        price: 1.80,
        category: 'Chapati',
        categorySw: 'Chapati',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'mild',
      },
      {
        id: 'm-003-3',
        name: 'Mchicha Salad',
        nameSw: 'Saladi ya Mchicha',
        description: 'Fresh amaranth greens tossed with tomato, red onion, lemon, and peanuts.',
        descriptionSw: 'Mchicha mbichi wa amaranth uliochanganywa na nyanya, kitunguu nyekundu, ndimu, na karanga.',
        price: 1.20,
        category: 'Salads & Sides',
        categorySw: 'Saladi na Nyongeza',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
        popular: false,
        spiceLevel: 'mild',
      },
    ],
    verificationSteps: defaultVerificationSteps,
  },

  /* ── 4. Njiro ── */
  {
    id: 'r-aru-004',
    name: 'Njiro Nyama Spot',
    description:
      'The go-to destination for late-evening Nyama Choma in Njiro. Open until midnight on weekends, with cold local beer and a lively courtyard atmosphere.',
    descriptionSw:
      'Mahali pa Nyama Choma ya jioni ya marehemu Njiro. Wazi hadi usiku wa manane wikendi, na bia baridi ya mtaani na mazingira ya ua yenye uchangamfu.',
    image:
      'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80',
    hygieneScore: 88,
    verified: true,
    rating: 4.6,
    reviewCount: 267,
    priceRange: '$$',
    avgDishPriceUSD: 3.86,
    phone: '+255762333444',
    whatsapp: '255762333444',
    prepTime: '25–40 min',
    distance: 2.3,
    lat: -3.3650,
    lng: 36.7010,
    city: 'Arusha',
    neighborhood: 'Njiro',
    categories: ['Nyama Choma', 'Grills', 'Evening Eats'],
    categoriesSw: ['Nyama Choma', 'Nyama Choma', 'Chakula cha Jioni'],
    openNow: true,
    menu: [
      {
        id: 'm-004-1',
        name: 'Kilo Nyama Choma (Mixed)',
        nameSw: 'Nyama Choma Kilo (Mchanganyiko)',
        description: 'One kilogram of mixed goat and beef grilled over charcoal, served with kachumbari and chips.',
        descriptionSw: 'Kilo moja ya mchanganyiko wa mbuzi na ng\'ombe iliyochomwa kwa mkaa, pamoja na kachumbari na chips.',
        price: 8.50,
        category: 'Grills',
        categorySw: 'Nyama Choma',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'mild',
      },
      {
        id: 'm-004-2',
        name: 'Chips Maye (Fries & Egg)',
        nameSw: 'Chips Maye',
        description: 'Crispy golden fries tossed with fried egg, onions, and piri-piri sauce. An Arusha street classic.',
        descriptionSw: 'Chips za dhahabu zilizounganishwa na yai la kukaanga, vitunguu, na mchuzi wa piri-piri. Chakula cha mtaani cha jadi cha Arusha.',
        price: 2.50,
        category: 'Street Food',
        categorySw: 'Chakula cha Mtaani',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'hot',
      },
      {
        id: 'm-004-3',
        name: 'Roasted Maize (Mahindi Choma)',
        nameSw: 'Mahindi Choma',
        description: 'Whole maize cob char-grilled over wood embers with lime and chilli powder.',
        descriptionSw: 'Ubwa wa mahindi nzima uliyochomwa kwa makaa ya kuni na ndimu na unga wa pilipili.',
        price: 0.60,
        category: 'Street Food',
        categorySw: 'Chakula cha Mtaani',
        image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=400&q=80',
        popular: false,
        spiceLevel: 'medium',
      },
    ],
    verificationSteps: [
      ...defaultVerificationSteps.slice(0, 2),
      { ...defaultVerificationSteps[2], status: 'passed' },
      { ...defaultVerificationSteps[3], status: 'pending', date: '2026-09-20', notes: 'Scheduled for next quarter audit.', notesSw: 'Imepangwa kwa ukaguzi wa robo mwaka ujao.' },
    ],
  },

  /* ── 5. Ngarenaro (Vegetarian-forward) ── */
  {
    id: 'r-aru-005',
    name: 'Uzuri Garden Café',
    description:
      'A serene garden café in Ngarenaro offering fresh vegetarian Swahili bowls, fresh juices, and wholesome breakfast options for health-conscious diners.',
    descriptionSw:
      'Mkahawa wa bustani wa utulivu huko Ngarenaro unaotoa bakuli za Swahili mbichi za mboga, juisi safi, na chaguzi za kiamsha kinywa cha afya kwa wageni wanaojali afya.',
    image:
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80',
    hygieneScore: 97,
    verified: true,
    rating: 4.9,
    reviewCount: 143,
    priceRange: '$$',
    avgDishPriceUSD: 2.73,
    phone: '+255713888999',
    whatsapp: '255713888999',
    prepTime: '12–18 min',
    distance: 0.8,
    lat: -3.3710,
    lng: 36.6760,
    city: 'Arusha',
    neighborhood: 'Ngarenaro',
    categories: ['Vegetarian', 'Fresh Juices', 'Breakfast'],
    categoriesSw: ['Mboga Tu', 'Juisi Safi', 'Kiamsha Kinywa'],
    openNow: true,
    menu: [
      {
        id: 'm-005-1',
        name: 'Mboga Bowl (Veggie Bowl)',
        nameSw: 'Bakuli ya Mboga',
        description: 'Brown rice base topped with sautéed kale, carrots, avocado, and peanut dressing.',
        descriptionSw: 'Msingi wa wali wa kahawia na sukuma wiki iliyokaangwa, karoti, parachichi, na mchuzi wa karanga.',
        price: 3.90,
        category: 'Bowls',
        categorySw: 'Bakuli',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'mild',
      },
      {
        id: 'm-005-2',
        name: 'Fresh Mango-Passion Juice',
        nameSw: 'Juisi ya Embe na Matunda ya Passion',
        description: 'Cold-pressed local Arusha mangoes blended with passion fruit and a touch of ginger.',
        descriptionSw: 'Embe za Arusha za mtaani zilizokamuliwa na matunda ya passion na kidogo cha tangawizi.',
        price: 1.50,
        category: 'Drinks',
        categorySw: 'Vinywaji',
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'mild',
      },
      {
        id: 'm-005-3',
        name: 'Avocado Toast Swahili-Style',
        nameSw: 'Tosti ya Parachichi ya Swahili',
        description: 'Toasted mkate wa ufuta (sesame bread) spread with smashed avocado, lemon zest, and fresh chilli.',
        descriptionSw: 'Mkate wa ufuta uliookwa na parachichi iliyosagwa, makonde ya ndimu, na pilipili safi.',
        price: 2.80,
        category: 'Breakfast',
        categorySw: 'Kiamsha Kinywa',
        image: 'https://images.unsplash.com/photo-1603046891744-1f8e9d17af22?auto=format&fit=crop&w=400&q=80',
        popular: false,
        spiceLevel: 'mild',
      },
    ],
    verificationSteps: defaultVerificationSteps,
  },

  /* ── 6. Majengo (Budget local staple) ── */
  {
    id: 'r-aru-006',
    name: 'Bora Bora Canteen',
    description:
      'A bustling Majengo workers\' canteen serving affordable, hearty Tanzanian staples — rice, beans, stews — morning to evening, six days a week.',
    descriptionSw:
      'Kantini inayofanya kazi ya wafanyakazi wa Majengo inayotumikia vyakula vya Tanzania vya bei nafuu na vya kutosha — wali, maharagwe, mchuzi — asubuhi hadi jioni, siku sita kwa wiki.',
    image:
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    hygieneScore: 85,
    verified: true,
    rating: 4.3,
    reviewCount: 508,
    priceRange: '$',
    avgDishPriceUSD: 2.36,
    phone: '+255755000111',
    whatsapp: '255755000111',
    prepTime: '8–15 min',
    distance: 1.4,
    lat: -3.3845,
    lng: 36.6790,
    city: 'Arusha',
    neighborhood: 'Majengo',
    categories: ['Local Rice', 'Authentic Swahili', 'Budget Eats'],
    categoriesSw: ['Wali wa Kawaida', 'Swahili Halisi', 'Bei Nafuu'],
    openNow: false,
    menu: [
      {
        id: 'm-006-1',
        name: 'Wali na Maharage (Rice & Beans)',
        nameSw: 'Wali na Maharagwe',
        description: 'Plain white rice with slow-cooked red kidney beans in mild tomato gravy. The staple plate of Arusha.',
        descriptionSw: 'Wali mweupe na maharagwe mekundu yaliyopikwa polepole katika mchuzi laini wa nyanya. Sahani ya kawaida ya Arusha.',
        price: 1.50,
        category: 'Rice Dishes',
        categorySw: 'Wali na Pilau',
        image: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9ef7b?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'mild',
      },
      {
        id: 'm-006-2',
        name: 'Kuku wa Kienyeji (Free-Range Chicken)',
        nameSw: 'Kuku wa Kienyeji',
        description: 'Traditional free-range chicken stew with lemongrass, tomatoes, and green peppers.',
        descriptionSw: 'Mchuzi wa kuku wa kienyeji wa jadi na mchaichai, nyanya, na pilipili ya kijani.',
        price: 3.60,
        category: 'Stews',
        categorySw: 'Mchuzi',
        image: 'https://images.unsplash.com/photo-1605926637512-c8b131444a4b?auto=format&fit=crop&w=400&q=80',
        popular: true,
        spiceLevel: 'medium',
      },
      {
        id: 'm-006-3',
        name: 'Maharage ya Nazi (Coconut Beans)',
        nameSw: 'Maharagwe ya Nazi',
        description: 'Kidney beans slow-cooked in coconut milk with turmeric, cumin, and dried chillis.',
        descriptionSw: 'Maharagwe yaliyopikwa polepole katika maziwa ya nazi na manjano, bizari, na pilipili kavu.',
        price: 2.00,
        category: 'Rice Dishes',
        categorySw: 'Wali na Pilau',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
        popular: false,
        spiceLevel: 'medium',
      },
    ],
    verificationSteps: [
      ...defaultVerificationSteps.slice(0, 3),
      { ...defaultVerificationSteps[3], status: 'pending', date: '2026-10-01', notes: 'Awaiting next inspection cycle.', notesSw: 'Inasubiri mzunguko wa ukaguzi unaofuata.' },
    ],
  },
];

/* ──────────────────────────────────────────────────────────
   COMMUNITY POSTS — Arusha-specific
────────────────────────────────────────────────────────── */
export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'cp-001',
    author: 'Amina K.',
    restaurantName: "Mama Zawadi's Kitchen",
    restaurantId: 'r-aru-001',
    content: 'Incredible hygiene standards. Watched them clean the grill between each batch. The Supu ya Ndizi was incredible — warmly spiced and filling. Best meal I have had in Ngarenaro!',
    contentSw: 'Viwango vya usafi vya ajabu. Niliwaona wakisafisha grili kati ya kila kundi. Supu ya Ndizi ilikuwa ya ajabu — na viungo vya joto na ya kutosha. Chakula bora nilichokula Ngarenaro!',
    type: 'hygiene_report',
    rating: 5,
    upvotes: 84,
    date: '2026-09-05',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'cp-002',
    author: 'Peter M.',
    restaurantName: 'Bahari Swahili Grill',
    restaurantId: 'r-aru-002',
    content: 'The Mchuzi wa Samaki is hands down the best in Arusha. Staff wore gloves throughout prep, and the kitchen was spotless when I peeked inside. Highly recommend!',
    contentSw: 'Mchuzi wa Samaki ni bora kabisa Arusha. Wafanyakazi walipiga glavu wakati wote wa kuandaa, na jiko lilikuwa safi kabisa nilipokuwa nakagua ndani. Napendekeza sana!',
    type: 'review',
    rating: 5,
    upvotes: 56,
    date: '2026-09-03',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'cp-003',
    author: 'Anonymous',
    restaurantName: 'Bora Bora Canteen',
    restaurantId: 'r-aru-006',
    content: 'Saw food sitting uncovered near the serving counter for about 20 minutes during lunch rush. Lodging a report so the hygiene team can follow up. The food itself tastes great though.',
    contentSw: 'Niliona chakula kikiwa wazi karibu na kaunta ya kutumikia kwa dakika 20 wakati wa msongamano wa chakula cha mchana. Ninatoa ripoti ili timu ya usafi iweze kufuatilia. Chakula chenyewe kina ladha nzuri.',
    type: 'whistleblow',
    rating: 3,
    upvotes: 29,
    date: '2026-08-30',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&q=80',
    verified: false,
  },
  {
    id: 'cp-004',
    author: 'Grace T.',
    restaurantName: 'Uzuri Garden Café',
    restaurantId: 'r-aru-005',
    content: 'Finally a veggie spot in Arusha that does not disappoint! The Mboga Bowl is fresh, colourful, and genuinely filling. Spotless kitchen — the owner let me tour it.',
    contentSw: 'Hatimaye mahali pa mboga Arusha ambayo haikudisappoint! Bakuli ya Mboga ni safi, yenye rangi, na inayoshiba kweli. Jiko safi — mmiliki aliniruhusu kukagua.',
    type: 'review',
    rating: 5,
    upvotes: 71,
    date: '2026-09-07',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
];

/* ──────────────────────────────────────────────────────────
   RELOCATION GUIDE — Arusha
────────────────────────────────────────────────────────── */
export const mockRelocationGuides: RelocationGuide[] = [
  {
    id: 'rg-arusha-001',
    city: 'Arusha',
    title: 'New to Arusha? Your Verified Food Guide',
    titleSw: 'Mpya Arusha? Mwongozo Wako wa Chakula Uliothibitishwa',
    description:
      'Settle into Arusha with confidence. Our curated guide covers the safest, most hygienic, and most authentic neighbourhood eateries across Ngarenaro, Majengo, Clock Tower, and Njiro.',
    descriptionSw:
      'Jisakinishe Arusha kwa ujasiri. Mwongozo wetu uliochaguliwa unashughulikia migahawa ya mitaa salama, safi, na ya kweli zaidi kote Ngarenaro, Majengo, Mnara wa Saa, na Njiro.',
    topSpots: 6,
    image:
      'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?auto=format&fit=crop&w=800&q=80',
    safetyTips: [
      'Always check for the SafePlate Verified badge before ordering',
      'Prefer eateries near Clock Tower roundabout for highest hygiene density',
      'Look for food that is freshly cooked — avoid pre-cooked display food',
      'Wash hands at the provided station before eating',
      'Mobile money payments are safer than cash at street stalls',
    ],
    safetyTipsSw: [
      'Daima angalia Nishani ya SafePlate Iliyothibitishwa kabla ya kuagiza',
      'Pendelea migahawa karibu na mzunguko wa Clock Tower kwa msongamano wa usafi wa juu',
      'Tafuta chakula kilichopikwa hivi karibuni — epuka chakula kilichoonyeshwa kilichopikwa mapema',
      'Osha mikono katika sehemu iliyotolewa kabla ya kula',
      'Malipo ya pesa ya simu ni salama zaidi kuliko pesa taslimu kwenye vibanda vya mtaani',
    ],
  },
];

/* ──────────────────────────────────────────────────────────
   ORDER STEPS
────────────────────────────────────────────────────────── */
export const defaultOrderSteps: OrderStep[] = [
  { id: 'os1', label: 'Order Placed', labelSw: 'Agizo Limewekwa', completed: true, active: false, time: '2 min ago' },
  { id: 'os2', label: 'Kitchen Verified', labelSw: 'Jiko Limethibitishwa', completed: true, active: false, time: '1 min ago' },
  { id: 'os3', label: 'Preparing', labelSw: 'Inaandaliwa', completed: false, active: true, time: 'Est. 15 min' },
  { id: 'os4', label: 'Ready for Pickup', labelSw: 'Tayari Kuchukuliwa', completed: false, active: false },
  { id: 'os5', label: 'Delivered', labelSw: 'Imefikishwa', completed: false, active: false },
];
