// /ai/summary.json, /ai/faq.json and /ai/service.json are the machine-
// readable summaries the geo-optimizer audit looks for. Generated from the
// same facts as the JSON-LD (src/lib/site.ts).
import type { APIRoute } from 'astro';
import { SITE } from '../../lib/site';
import { absolute } from '../../lib/seo-data';
import { locales } from '../../i18n';

export const GET: APIRoute = () =>
  Response.json({
    name: SITE.name,
    url: `${SITE.url}/`,
    type: 'Nonprofit organization (501(c)(3))',
    ein: SITE.ein,
    description:
      'unfoldingWord equips the global church to translate the Bible into every language, providing open-licensed biblical content, translation tools, training and technology to church networks among the least reached.',
    mission:
      'To fulfill the Great Commission, unfoldingWord provides scalable strategies—including tools, training and technologies—to equip global leaders who face significant barriers to planting thriving churches among the least reached.',
    headquarters: `${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}, USA`,
    contact: { telephone: SITE.telephone, page: absolute('/contact/') },
    keyPages: {
      about: absolute('/about/'),
      strategy: absolute('/ccbt/'),
      programs: absolute('/overview/'),
      forTranslators: absolute('/for-translators/'),
      stories: absolute('/stories/'),
      give: absolute('/give/'),
      faq: absolute('/ccbt/faq/'),
    },
    languages: locales.map((l) => l.tag),
    accountability: SITE.trust.map((t) => t.label),
    sameAs: SITE.profiles,
    llms: absolute('/llms.txt'),
  });
