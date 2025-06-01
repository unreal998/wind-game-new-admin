import { Metadata } from "next"

interface PageSEOProps {
  title: string
  description?: string
  canonicalUrl?: string
  ogType?: string
  ogImage?: string
  twitterCard?: string
  keywords?: string[]
}

export function customMetaDataGenerator({
  title,
  description,
  canonicalUrl = "https://wind-tap-cp.vercel.app",
  ogType = "website",
  keywords = ["investment", "success", "money"],
  ogImage = `${canonicalUrl}/og-image.svg`,
  twitterCard = "summary_large_image",
}: PageSEOProps): Metadata {
  // Create Site Title
  const fullTitle = `${title}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    openGraph: {
    //   locale: "en_US",
      title: fullTitle,
      description,
      type: ogType as "website",
      url: canonicalUrl,
      images: [
        {
          url: ogImage,      
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: twitterCard as "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: "/favicon.ico",
    },
  }
}
