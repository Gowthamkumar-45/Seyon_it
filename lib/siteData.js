// Single source of truth for seed data. Public site reads from DB (seeded from here).

export const CATEGORY_COLORS = {
  Government: "#38bdf8",
  Healthcare: "#34d399",
  "E-commerce": "#fb7185",
  "Mobile App": "#a78bfa",
  "Mobile Apps": "#a78bfa",
};

export const CATEGORIES = ["All", "Government", "Healthcare", "E-commerce", "Mobile Apps"];

export const seedProjects = [
  {
    slug: "ccmc-dialysis-care",
    name: "CCMC Dialysis Care",
    category: "Healthcare",
    client: "Coimbatore City Municipal Corporation",
    industry: "",
    tagline: "Complete operations platform for municipal dialysis centres.",
    description:
      "A complete operations platform for dialysis centres run by the Coimbatore City Municipal Corporation. It brings patient records, dialysis machines, treatment sessions, and billing into one system, with no paper registers.",
    features: [
      "Patient registration and medical history",
      "Dialysis session scheduling",
      "Machine allocation and usage tracking",
      "Billing and payment records",
      "Daily and monthly reports",
      "Role-based access for admin, doctors, and staff",
    ],
    featured: true,
    order: 1,
  },
  {
    slug: "ccmc-audit",
    name: "CCMC Audit",
    category: "Government",
    client: "Coimbatore City Municipal Corporation",
    industry: "",
    tagline: "Digital audit and compliance tracking for municipal departments.",
    description:
      "A digital audit platform that helps corporation officials record, track, and review audit findings across departments, bringing transparency and accountability to municipal operations.",
    features: [
      "Department-wise audit records",
      "Finding and objection tracking",
      "Compliance status monitoring",
      "Document uploads",
      "Dashboards and reports",
      "Role-based officer access",
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "mathi-products-magalir-marketplace",
    name: "Mathi Products (Magalir Marketplace)",
    category: "E-commerce",
    client: "Ramanathapuram District, SHG initiative",
    industry: "",
    tagline: "Direct marketplace for Ramanathapuram district crafts.",
    description:
      "A marketplace that sells authentic Ramanathapuram district crafts directly to customers. Built to support women's Self-Help Groups, it gives rural artisans an online storefront with no middlemen.",
    features: [
      "Product catalogue by category",
      "SHG and artisan profiles",
      "Cart and checkout",
      "Order management",
      "Admin panel for product and stock updates",
      "Mobile-friendly shopping",
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "water-bodies-management-system",
    name: "Water Bodies Management System",
    category: "Government",
    client: "Ramanathapuram District Administration",
    industry: "",
    tagline: "One platform to map, monitor, and maintain district water bodies.",
    description:
      "A management system that lets the district administration map, monitor, and maintain tanks, ponds, and lakes. It includes a dedicated module for tracking and removing Seemai Karuvelam (Prosopis juliflora), an invasive species that drains groundwater.",
    features: [
      "Water body inventory with location mapping",
      "Condition and maintenance tracking",
      "Seemai Karuvelam invasive species module",
      "Work progress monitoring",
      "Photo and field data uploads",
      "Reports for officials",
    ],
    featured: true,
    order: 4,
  },
  {
    slug: "district-csr-portal",
    name: "District CSR Portal",
    category: "Government",
    client: "District Administration",
    industry: "",
    tagline: "Government-verified CSR projects ready for corporate adoption.",
    description:
      "A portal where companies browse costed CSR project proposals published by the district administration under Schedule VII of the Companies Act, 2013. Each project carries a government-verified estimate, including the bill of quantities, schedule of rates, and sanctioning officers.",
    features: [
      "Browse costed CSR projects",
      "Filter by sector, budget size, and Schedule VII category",
      "View the bill of quantities and schedule of rates",
      "Sanctioning officer details",
      "Direct contact with the district CSR Cell",
      "Light and dark mode",
    ],
    featured: false,
    order: 5,
  },
  {
    slug: "wooden-calculator-app",
    name: "Wooden Calculator App",
    category: "Mobile Apps",
    client: "",
    industry: "Timber and furniture",
    tagline: "Fast, accurate wood volume and cost calculations.",
    description:
      "A mobile calculator for timber merchants, sawmills, and furniture makers that works out wood volume (cubic feet), measurements, and costing for logs and planks, replacing manual calculations and reducing errors.",
    features: [
      "Log and plank cubic-feet calculation",
      "Multiple measurement units",
      "Rate-based cost calculation",
      "Save and share estimates",
      "Calculation history",
      "Simple interface for shop-floor use",
    ],
    featured: true,
    order: 6,
  },
  {
    slug: "plantation-management-app",
    name: "Plantation Management App",
    category: "Mobile Apps",
    client: "",
    industry: "Forestry and agriculture",
    tagline: "Track plantations from planting to harvest.",
    description:
      "A mobile app for managing plantations end to end: sites, saplings, growth monitoring, field staff, and reports, all from a phone.",
    features: [
      "Plantation site registry",
      "Sapling and species tracking",
      "Growth monitoring with photos",
      "Field staff activity logs",
      "GPS location capture",
      "Progress reports",
    ],
    featured: false,
    order: 7,
  },
];

export const seedServices = [
  {
    title: "Government Platforms",
    icon: "Landmark",
    description: "Secure, scalable digital platforms for departments and public services.",
    order: 1,
  },
  {
    title: "Municipal Systems",
    icon: "Building2",
    description: "Operations systems for corporations: audit, billing, records, and reports.",
    order: 2,
  },
  {
    title: "Web Applications",
    icon: "Globe",
    description: "Fast, modern web apps with clean dashboards and real-time data.",
    order: 3,
  },
  {
    title: "Mobile Apps",
    icon: "Smartphone",
    description: "Native-feel Android & iOS apps built for the field and the shop floor.",
    order: 4,
  },
  {
    title: "E-commerce",
    icon: "ShoppingCart",
    description: "Storefronts and marketplaces that connect makers directly with buyers.",
    order: 5,
  },
  {
    title: "UI / UX Design",
    icon: "Palette",
    description: "Accessible, trustworthy interfaces designed for real people.",
    order: 6,
  },
];

export const seedTestimonials = [
  {
    quote:
      "Seyon replaced our paper registers with a single reliable system. Our dialysis centres run smoother than ever.",
    author: "Health Officer",
    role: "Coimbatore City Municipal Corporation",
    order: 1,
  },
  {
    quote:
      "The audit platform brought real transparency across departments. Findings no longer slip through the cracks.",
    author: "Audit Cell",
    role: "Municipal Corporation",
    order: 2,
  },
  {
    quote:
      "Our Self-Help Groups finally sell directly to customers. The marketplace changed livelihoods.",
    author: "District Coordinator",
    role: "Ramanathapuram SHG Initiative",
    order: 3,
  },
];

export const seedStats = [
  { label: "Projects Delivered", value: 40, suffix: "+", order: 1 },
  { label: "Government Clients", value: 12, suffix: "", order: 2 },
  { label: "Districts Served", value: 8, suffix: "", order: 3 },
  { label: "Mobile Apps", value: 15, suffix: "", order: 4 },
];

export const seedCompany = {
  name: "Seyon IT Solutions Pvt Ltd",
  tagline: "Government platforms, municipal systems, and mobile apps that serve real people.",
  address: "Coimbatore, Tamil Nadu, India",
  addressLine: "123 Tech Park Road, Coimbatore, Tamil Nadu 641001",
  email: "hello@seyonit.com",
  phone: "+91 90000 00000",
};

export const ADMIN_DEFAULT = {
  email: "admin@seyonit.com",
  password: "Seyon@2025",
};
