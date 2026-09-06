const SERVICE_AREA_GROUPS = [
  {
    county: "Iredell County",
    areas: [
      { slug: "statesville", name: "Statesville" },
      { slug: "mooresville", name: "Mooresville" },
      { slug: "troutman", name: "Troutman" },
      { slug: "harmony", name: "Harmony" },
      { slug: "love-valley", name: "Love Valley" },
      { slug: "davidson", name: "Davidson" },
    ],
  },
  {
    county: "Mecklenburg County",
    areas: [
      { slug: "charlotte", name: "Charlotte" },
      { slug: "cornelius", name: "Cornelius" },
      { slug: "davidson", name: "Davidson" },
      { slug: "huntersville", name: "Huntersville" },
      { slug: "matthews", name: "Matthews" },
      { slug: "mint-hill", name: "Mint Hill" },
      { slug: "pineville", name: "Pineville" },
      { slug: "stallings", name: "Stallings" },
    ],
  },
  {
    county: "Gaston County",
    areas: [
      { slug: "gastonia", name: "Gastonia" },
      { slug: "belmont", name: "Belmont" },
      { slug: "bessemer-city", name: "Bessemer City" },
      { slug: "cherryville", name: "Cherryville" },
      { slug: "cramerton", name: "Cramerton" },
      { slug: "dallas", name: "Dallas" },
      { slug: "high-shoals", name: "High Shoals" },
      { slug: "kings-mountain", name: "Kings Mountain" },
      { slug: "lowell", name: "Lowell" },
      { slug: "mcadenville", name: "McAdenville" },
      { slug: "mount-holly", name: "Mount Holly" },
      { slug: "ranlo", name: "Ranlo" },
      { slug: "stanley", name: "Stanley" },
    ],
  },
  {
    county: "Lincoln County",
    areas: [
      { slug: "lincolnton", name: "Lincolnton" },
      { slug: "denver", name: "Denver" },
      { slug: "iron-station", name: "Iron Station" },
      { slug: "lowesville", name: "Lowesville" },
      { slug: "westport", name: "Westport" },
      { slug: "crouse", name: "Crouse" },
      { slug: "maiden", name: "Maiden" },
    ],
  },
  {
    county: "Rowan County",
    areas: [
      { slug: "salisbury", name: "Salisbury" },
      { slug: "kannapolis", name: "Kannapolis" },
      { slug: "china-grove", name: "China Grove" },
      { slug: "cleveland", name: "Cleveland" },
      { slug: "east-spencer", name: "East Spencer" },
      { slug: "faith", name: "Faith" },
      { slug: "gold-hill", name: "Gold Hill" },
      { slug: "granite-quarry", name: "Granite Quarry" },
      { slug: "landis", name: "Landis" },
      { slug: "rockwell", name: "Rockwell" },
      { slug: "spencer", name: "Spencer" },
    ],
  },
  {
    county: "Cabarrus County",
    areas: [
      { slug: "concord", name: "Concord" },
      { slug: "kannapolis", name: "Kannapolis" },
      { slug: "harrisburg", name: "Harrisburg" },
      { slug: "mount-pleasant", name: "Mount Pleasant" },
      { slug: "midland", name: "Midland" },
      { slug: "locust", name: "Locust" },
    ],
  },
  {
    county: "Catawba County",
    areas: [
      { slug: "hickory", name: "Hickory" },
      { slug: "newton", name: "Newton" },
      { slug: "conover", name: "Conover" },
      { slug: "long-view", name: "Long View" },
      { slug: "maiden", name: "Maiden" },
      { slug: "claremont", name: "Claremont" },
      { slug: "catawba", name: "Catawba" },
      { slug: "brookford", name: "Brookford" },
    ],
  },
];

const CONFIG = {
  businessName: "A&W Fencing",
  niche: "Fencing",
  tagline: "Professional Fencing Installations Built for Lasting Performance",
  phone: "(704) 771-1901",
  phoneRaw: "7047711901",
  email: "",
  city: "Cherryville",
  state: "North Carolina",
  stateShort: "NC",
  address: "Cherryville, NC 28021",
  licenseNumber: "",
  colors: { primary: "#3B82F6", secondary: "#1C2333" },
  social: { facebook: "", instagram: "", youtube: "", yelp: "", nextdoor: "" },
  googleReviewsUrl: "",
  rating: "",
  reviewCount: 0,
  yearsExperience: 0,
  projectsCompleted: "0+",
  satisfactionRate: "98%",
  webhookUrl: "",
  metaPixelId: "",
  maps: { mapEmbedUrl: "", mapSearchQuery: "A&W Fencing Cherryville NC", mapHeight: 420 },
  hero: {
    eyebrow: "Local Home Service Professionals",
    headline: "Install Fencing Built for Lasting Performance",
    subheadline: "Professional installations designed to match your property's layout and functional requirements.",
    ctaPrimary: "Get a Free Estimate",
    ctaSecondary: "Explore Services",
    heroImage: "https://irp.cdn-website.com/7e50aa29/dms3rep/multi/opt/shutterstock_2243694087-660h.jpg",
  },
  services: [
    {
      slug: "residential-fence-installation",
      name: "Residential Fence Installation",
      desc: "Privacy, security, and curb appeal tailored to your home's specific needs and layout.",
      longDesc: "Enhance your home's privacy, security, and curb appeal with a professionally installed residential fence. We offer a variety of materials and styles, including wood, vinyl, aluminum, and chain link, designed to complement your property's aesthetic and meet your specific needs for pet containment, child safety, or boundary definition. Our team ensures a seamless installation process from start to finish.",
      benefits: ["Enhanced Privacy", "Increased Property Security", "Improved Curb Appeal", "Pet & Child Safety", "Property Value Boost"],
      faqs: [
        { q: "What types of residential fences do you install?", a: "We install a wide range of residential fences, including wood privacy fences, decorative aluminum fences, low-maintenance vinyl fences, and durable chain link fences." },
        { q: "How long does residential fence installation take?", a: "The duration depends on the fence length, material, and site conditions, but most residential projects are completed within a few days to a week." },
        { q: "Do I need a permit for a residential fence in Cherryville?", a: "Permit requirements vary by location and fence height. We can help guide you through the local regulations in Cherryville and surrounding areas." }
      ],
      image: "/public/services/residential-fence-installation.jpg",
    },
    {
      slug: "commercial-fence-installation",
      name: "Commercial Fence Installation",
      desc: "Professional-grade perimeter solutions designed to protect business properties and assets effectively.",
      longDesc: "Protect your business assets and secure your commercial property with our professional-grade fencing solutions. We design and install durable fences for various commercial needs, including perimeter security, access control, and aesthetic enhancement. Our options include heavy-duty chain link, ornamental iron, anti-climb fencing, and more, all built to withstand demanding environments and provide lasting security.",
      benefits: ["Asset Protection & Security", "Deterrence of Trespassing", "Controlled Access Points", "Enhanced Business Image", "Compliance with Regulations"],
      faqs: [
        { q: "What security features can you integrate into commercial fences?", a: "We can integrate features like barbed wire, razor wire, anti-climb designs, and advanced gate access control systems for maximum security." },
        { q: "Can you install fencing for large commercial properties?", a: "Yes, our team is equipped to handle commercial fencing projects of all sizes, from small businesses to large industrial complexes." },
        { q: "What materials are best for commercial security fences?", a: "Heavy-gauge chain link, ornamental steel/iron, and high-security mesh are popular choices for their durability and security features." }
      ],
      image: "/public/services/commercial-fence-installation.jpg",
    },
    {
      slug: "custom-gates-access-control",
      name: "Custom Gates & Automatic Access Control",
      desc: "Secure entry systems engineered for convenience and controlled access on any property type.",
      longDesc: "Enhance the convenience and security of your property with custom gates and state-of-the-art automatic access control systems. Whether you need a grand entrance gate for your estate, a secure entry for a commercial complex, or a simple automated driveway gate, we design and install solutions that combine functionality, durability, and aesthetic appeal. Our systems can include keypads, remote controls, intercoms, and smart integration.",
      benefits: ["Convenient Property Access", "Enhanced Security & Control", "Increased Property Value", "Custom Design Options", "Integration with Smart Systems"],
      faqs: [
        { q: "What types of automatic gates do you install?", a: "We install swing gates, slide gates, and cantilever gates, all custom-fabricated to fit your specific opening and operational needs." },
        { q: "Can automatic gates be integrated with existing security systems?", a: "Yes, we can integrate new gate automation with your existing security cameras, intercoms, and smart home or business systems." },
        { q: "What happens if there's a power outage?", a: "Most automatic gate systems come with a battery backup or a manual override option to ensure access during power interruptions." }
      ],
      image: "/public/services/custom-gates-access-control.jpg",
    },
    {
      slug: "farm-agricultural-fencing",
      name: "Farm & Agricultural Fencing",
      desc: "Reliable containment and protection for livestock, crops, and rural property boundaries.",
      longDesc: "Provide reliable containment and protection for your livestock, crops, and rural property boundaries with our specialized farm and agricultural fencing solutions. We understand the unique needs of agricultural properties and offer robust options like woven wire, high-tensile wire, barbed wire, and post-and-rail fences, designed for durability and effectiveness in managing animals and defining large land parcels.",
      benefits: ["Effective Livestock Containment", "Crop Protection from Wildlife", "Clear Boundary Definition", "Durable & Long-lasting", "Reduced Maintenance"],
      faqs: [
        { q: "What is the best fence for livestock containment?", a: "The best fence depends on the type of livestock. Woven wire is excellent for smaller animals, while high-tensile and barbed wire are effective for larger animals like cattle." },
        { q: "Can you install fencing for large acreage?", a: "Yes, we have experience installing agricultural fencing across extensive acreage, efficiently and effectively." },
        { q: "Do you offer repair services for farm fences?", a: "Absolutely. We provide repair services to maintain the integrity and functionality of your existing farm and agricultural fences." }
      ],
      image: "/public/services/farm-agricultural-fencing.jpg",
    },
  ],
  serviceAreaGroups: SERVICE_AREA_GROUPS,
  serviceAreas: Array.from(
    new Map(
      SERVICE_AREA_GROUPS.flatMap(group =>
        group.areas.map(area => [area.slug, { ...area, county: group.county }])
      )
    ).values()
  ),
  testimonials: [
    { name: "Sarah", city: "Cherryville", text: "A&W Fencing did an amazing job on our new privacy fence in Cherryville. The team was professional, efficient, and the quality is outstanding. Highly recommend!" },
    { name: "John", city: "Cherryville", text: "We needed a secure fence for our commercial property in Cherryville, and A&W Fencing delivered. The process was smooth, and the fence looks great while providing the security we needed." },
    { name: "Emily", city: "Cherryville", text: "Our new automatic gate from A&W Fencing is a game-changer! It's so convenient and adds a layer of security we didn't have before. Excellent service in Cherryville!" },
    { name: "Michael", city: "Cherryville", text: "As a farmer in the Cherryville area, reliable fencing is crucial. A&W Fencing installed a robust agricultural fence for us that perfectly contains our livestock. Fantastic work!" }
  ],
  processSteps: [
    { title: "Tell Us About Your Project", desc: "Share your goals and schedule a convenient consultation." },
    { title: "Receive a Clear Plan", desc: "We assess the work and provide a straightforward recommendation." },
    { title: "Professional Service", desc: "Our team completes the job with care and clear communication." },
    { title: "Final Walkthrough", desc: "We make sure the completed work meets your expectations." },
  ],
  faqs: [
    { q: "What areas do you serve?", a: "We proudly serve Cherryville, NC, and the surrounding communities, including Lake Norman, Charlotte, Gastonia, Lincolnton, Salisbury, Concord, and Hickory areas." },
    { q: "What types of fencing materials do you offer?", a: "We offer a wide range of materials including durable wood, low-maintenance vinyl, elegant aluminum, and robust chain link, as well as specialized options for agricultural and custom gate projects." },
    { q: "How long does a typical fence installation take?", a: "The timeline for installation varies depending on the size, complexity, and materials chosen for your project. We provide an estimated timeline during your initial consultation." },
    { q: "Do you offer financing options for fencing projects?", a: "Yes, we understand that a new fence is an investment. Financing options are available through First Citizens Bank to help make your project more affordable." },
    { q: "How do I get a free estimate?", a: "Getting a free estimate is easy! Simply contact us by phone or through our website, and we'll schedule a convenient time to discuss your project and provide a personalized quote." },
    { q: "Are your fences guaranteed?", a: "We stand by the quality of our work and materials. Our installations are backed by skilled craftsmanship and a commitment to lasting performance." },
    { q: "Do you handle fence repairs?", a: "While our primary focus is new installations, we can often assist with repairs for fences we've installed or significant repair projects. Please contact us to discuss your specific needs." },
    { q: "What is the best fence for privacy?", a: "For maximum privacy, a solid wood privacy fence or a vinyl privacy fence is generally recommended. Both offer excellent visual obstruction and can be customized to your desired height and style." }
  ],
  portfolioProjects: [],
  legal: { privacyPolicyDate: "May 1, 2025", termsDate: "May 1, 2025" },
};
