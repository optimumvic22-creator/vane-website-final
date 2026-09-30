import { defineQuery } from 'next-sanity'

const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height, aspectRatio }
    }
  }
`

export const HOMEPAGE = defineQuery(/* groq */ `
  *[_type == "homepage"][0] {
    ...,
    missionPortraitImage { ${imageFragment} },
    founder1Image { ${imageFragment} },
    founder2Image { ${imageFragment} },
    "heroVideoUrl": heroVideo.asset->url,
    heroVideoPoster { ${imageFragment} },
    problemMqsOverallScore,
    problemMqsDomains[] { code, label, labelDe, score },
    mqsDomains[] {
      code,
      label,
      labelDe,
      baselineScore,
      "videoUrl": video.asset->url
    }
  }
`)

export const TEAM_MEMBERS = defineQuery(/* groq */ `
  *[_type == "teamMember"] | order(displayOrder asc) {
    ...,
    headshot { ${imageFragment} }
  }
`)
