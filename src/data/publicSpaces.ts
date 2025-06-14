// src/data/publicSpaces.ts

export interface PublicSpace {
  name: string;
  slug: string;
  date: string; // ISO format
  image: string;
}

export const publicSpaces: PublicSpace[] = [
  {
    name: "Alicia & Marcos Wedding",
    slug: "alicia-marcos-wedding",
    date: "2025-05-01",
    image: "/sampleimage1.jpg",
  },
  {
    name: "Camila’s Graduation Party",
    slug: "camila-graduation",
    date: "2025-03-20",
    image: "/sampleimage2.jpg",
  },
  {
    name: "Nina & Joel Engagement",
    slug: "nina-joel-engagement",
    date: "2025-04-15",
    image: "/sampleimage3.jpg",
  },
  {
    name: "Zoe & Aaron Beach Ceremony",
    slug: "zoe-aaron-beach",
    date: "2025-02-10",
    image: "/sampleimage4.jpg",
  },
];
