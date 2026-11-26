---
title: Content
description: Open-licensed biblical content from unfoldingWord, including Open Bible Stories, original-language texts, grammars, lexicons, source texts and translation helps.
schemaType: CollectionPage
sections:
- type: hero
  variant: banner
  title: 'For Translators: Content'
  image: for-translators/content.jpg
  imageAlt: Rows of old leather-bound books on dark library shelves beside a wooden ladder
- type: prose
  title: Biblical Content
  body: |-
    Listed below are the open-licensed biblical content resources we are creating.

    Each resource is made available under the terms of a [Creative Commons Attribution Share-Alike 4.0 License](https://creativecommons.org/licenses/by-sa/4.0).

    **Click the subject areas below to expand and view the content.**
  background: ocean
  align: center
- type: resources
  title: Discipleship + Study
  variant: accordion
  items:
  - title: <span id="OBS"></span>unfoldingWord® Open Bible Stories (OBS)
    description: |-
      50 key stories of the Bible, from Creation to Revelation, for evangelism & discipleship, in text, audio, and video, on any mobile phone, in any language, for free. It increases understanding of the historical and redemptive narrative of the entire Bible and provides an ideal starting point for Bible translation.

      [Click here](https://git.door43.org/unfoldingWord/en_obs/releases/download/v9/en_obs_v9.pdf) to download the PDF (English)

      [Click here](https://openbiblestories.org/l/en/) to view on the web (English)

      [Click here](https://openbiblestories.org/discover/) for OBS in other languages

      Status: Released – v9

      [Find out more](https://www.unfoldingword.org/open-bible-stories)

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
  - title: <span id="UBN"></span>unfoldingWord® Bible Notes (UBN)
    description: |-
      The **unfoldingWord Bible Notes** project is:

      - **Free of copyright and licensing restrictions** (CC BY-SA), permitting the entire global Church to use and build on it without hindrance.
      - **Based on existing work** of excellent pedigree and academic repute.
      - **Translated** into all the [Gateway Languages](https://www.unfoldingword.org/publications/the-gateway-languages-strategy) of the world, and any other language in which the Church desires to have a study Bible notes.

      [View source](https://git.door43.org/unfoldingWord/en_ubn)

      Status: In progress

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
  - title: <span id="UBM"></span>unfoldingWord® Bible Maps (UBM)
    description: |-
      High-quality Bible maps covering essential biblical geography, designed for ease of translation and use. The maps enable anyone to increase their understanding of the Bible in its historical and geographic context.

      Open Bible Maps are open-licensed Bible maps for every language. The objective is to create a set of foundational Bible maps that can be rapidly and accurately translated into thousands of languages.

      Status: Not started

      **Specifications**

      The Bible maps must…

      - …use industry-standard data formats.
      - …be made available under open licenses (CC BY, or CC BY-SA).
      - …provide optional reusability and flexibility (e.g., print, large screen, small screen, etc.).
      - …be easily translated into thousands of different languages.

      **A Possible Implementation**

      The proposed solution is to create the Bible maps using the Scalable Vector Graphics (SVG) format, which is an industry-standard XML-based vector image format for two-dimensional graphics with support for interactivity and animation. This format can optionally include base 64-encoded raster backgrounds, which makes it possible to create a map that has both full-color (e.g., relief maps) and plain variants. Using this format, all the text (and formatting) on the map would be encoded as metadata in the SVG file.

      Once the maps are created, the specific IDs of each place name label can be identified, and renamed if needed for ease of identification. In the example image below, the text element with id “tspan3129” (line 518) is labeled “Tyre” (line 523). All the other place names in the map have unique IDs and, because of the structure of the SVG file, it is possible to extract a complete list of all the place names on the map.

      With all the place names identified, it is possible to use a computer script and a dictionary lookup routine to programmatically translate the place names and write the translated names *in the map itself*. Given a lexicon of all the translations of the place names, the map could be translated automatically. (Such a lexicon could be generated from existing Bible translations with the help of machine learning algorithms or metadata embedded in the translations themselves, e.g. Strong’s Numbers.)

      A “Proof of Concept” of this project shows that all of this is possible, and is available [here](https://www.dropbox.com/sh/hh2x61v9gzsu9vi/AAAqr9L-AXOu18t10kA7qAH1a?dl=0).

      **Want to Help?**

      If you are interested in helping complete this project as a gift to the global church, please contact us via the form below.

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
    image: for-translators/bible-map-svg-example.jpg
    imageAlt: Two browser windows side by side, one showing the SVG source code of a map with the place name Tyre highlighted, the other showing the rendered color relief map of Israel with Tyre labeled near the coast
  - title: <span id="UBH"></span>unfoldingWord® Bible Handbook (UBH)
    description: |-
      A handbook providing clear and concise information regarding the cultural, religious, historical, and geographic settings in which the story of the Bible occurs.

      Status: Not started

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
  - title: <span id="UBC"></span>unfoldingWord® Bible Commentary (UBC)
    description: |-
      An open-licensed Bible commentary designed for translation and adaptation. It provides pastors and students of the Bible with access to in-depth explanatory material that greatly increases their understanding of the Bible.

      Status: Not started

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
- type: resources
  title: Greek
  variant: accordion
  items:
  - title: <span id="UGNT"></span>unfoldingWord® Greek New Testament (UGNT)
    description: |-
      An open-licensed, lexically tagged, morphologically parsed critical Greek New Testament with full apparatus. It enables the global Church to have access to the original texts of the New Testament.

      [Click here](https://git.door43.org/unfoldingWord/el-x-koine_ugnt/releases/download/v0.34/el-x-koine_ugnt_v0.34.pdf) to download the PDF (Whole UGNT)

      [Click here](https://git.door43.org/unfoldingWord/el-x-koine_ugnt/releases/tag/v0.34) to download by Bible book

      [Click here](https://preview.door43.org/u/unfoldingWord/el-x-koine_ugnt/v0.34/) to view on the web

      Status: In Progress – v0.34

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/). The UGNT is based on the [Bunning Heuristic Prototype](https://greekcntr.org) produced for the Center for New Testament Restoration by Alan Bunning.*
  - title: <span id="UGG"></span>unfoldingWord® Greek Grammar (UGG)
    description: |-
      An open-licensed Greek grammar (reference first, eventually for teaching), providing information about Greek grammatical elements. It enables the global Church to gain the best possible understanding of the grammar of the original texts of the New Testament.

      [Click here](https://ugg.readthedocs.io/en/latest/) to view on the web

      Status: In progress

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
  - title: <span id="UGL"></span>unfoldingWord® Greek Lexicon (UGL)
    description: |-
      An open-licensed, lexically tagged Greek lexicon. It enables the global Church to gain the best possible understanding of the words in the original texts of the New Testament.

      [Click here](https://ugl-info.readthedocs.io/en/latest/) to view on the web

      Status: In progress

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
- type: resources
  title: Hebrew + Aramaic
  variant: accordion
  items:
  - title: <span id="UHB"></span>unfoldingWord® Hebrew Bible (UHB)
    description: |-
      An open-licensed, lexically tagged, morphologically parsed Hebrew Old Testament. It enables the global Church to have access to the original texts of the Old Testament.

      [Click here](https://git.door43.org/unfoldingWord/hbo_uhb/releases/download/v3.0.0/hbo_uhb_v3.0.0.pdf) to download the PDF (Whole UHB)

      [Click here](https://git.door43.org/unfoldingWord/hbo_uhb/releases/tag/v3.0.0) to download by Bible book

      [Click here](https://preview.door43.org/u/unfoldingWord/hbo_uhb/v3.0.0/) to view on the web

      Status: Complete – v3.0.0

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/). The UHB is based on the [Open Scriptures Hebrew Bible](https://github.com/openscriptures/morphhb).*
  - title: <span id="UHG"></span>unfoldingWord® Hebrew Grammar (UHG)
    description: |-
      An open-licensed Hebrew grammar (reference first, eventually for teaching), providing information about Hebrew grammatical elements. It enables the global Church to gain the best possible understanding of the grammar of the original texts of the Old Testament.

      [Click here](https://uhg.readthedocs.io/en/latest/) to view on the web

      Status: v2.0.1

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
  - title: <span id="UAG"></span>unfoldingWord® Aramaic Grammar (UAG)
    description: |-
      An open-licensed Aramaic grammar (reference first, eventually for teaching), providing information about Aramaic grammatical elements. It enables the global Church to gain the best possible understanding of the grammar of the original texts of the Old Testament.

      [Click here](https://uag.readthedocs.io/en/latest/) to view on the web

      Status: In Progress

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
  - title: <span id="UHAL"></span>unfoldingWord® Hebrew & Aramaic Lexicon (UHAL)
    description: |-
      An open-licensed, lexically tagged Hebrew & Aramaic lexicon. It enables the global Church to gain the best possible understanding of the words in the original texts of the Old Testament.

      [View source](https://git.door43.org/unfoldingWord/en_uhal)

      Status: In Progress

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
- type: resources
  title: Source Texts
  variant: accordion
  items:
  - title: <span id="ULT"></span>unfoldingWord® Literal Text (ULT)
    description: |-
      An open-licensed update of the ASV, intended to provide a ‘form-centric’ understanding of the Bible. It increases the translator’s understanding of the lexical and grammatical composition of the underlying text by adhering closely to the word order and structure of the originals.

      The unfoldingWord® Literal Text is intended to be used together with the [unfoldingWord® Simplified Text](https://www.unfoldingword.org/for-translators/content#UST) to provide a more robust view of both the form and function of the original texts.

      [Click here](https://git.door43.org/unfoldingWord/en_ult/releases/download/v91/en_ult_v91.pdf) to download the PDF (Whole ULT)

      [Click here](https://git.door43.org/unfoldingWord/en_ult/releases/tag/v91) to download by Bible book

      [Click here](https://preview.door43.org/u/unfoldingWord/en_ult/v91/) to view on the web

      Status: In Progress – v91

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
  - title: <span id="UST"></span>unfoldingWord® Simplified Text (UST)
    description: |-
      An open-licensed translation, intended to provide a ‘functional’ understanding of the Bible. It increases the translator’s understanding of the text by translating theological terms as descriptive phrases.

      The unfoldingWord® Simplified Text is intended to be used together with the [unfoldingWord® Literal Text](https://www.unfoldingword.org/for-translators/content#ULT) to provide a more robust view of both the form and function of the original texts.

      [Click here](https://git.door43.org/unfoldingWord/en_ust/releases/download/v91/en_ust_v91.pdf) to download the PDF (Whole UST)

      [Click here](https://git.door43.org/unfoldingWord/en_ust/releases/tag/v91) to download a Bible book’s PDF

      [Click here](https://preview.door43.org/u/unfoldingWord/en_ust/v91/) to view on the web

      Status: In Progress – v91

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
- type: resources
  title: Translation Helps
  variant: accordion
  items:
  - title: <span id="UTW"></span>unfoldingWord® Translation Words (UTW)
    description: |-
      A basic Bible lexicon that provides translators with clear, concise definitions and translation suggestions for every important word in the Bible. It provides translators and checkers with essential lexical information to help them make the best possible translation decisions.

      [Click here](https://git.door43.org/unfoldingWord/en_tw/releases/download/v92/en_tw_v92.pdf) to download the PDF

      [Click here](https://preview.door43.org/u/unfoldingWord/en_tw/v92) to view on the web

      Status: Released – v92

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
  - title: <span id="UTN"></span>unfoldingWord® Translation Notes (UTN)
    description: |-
      Open-licensed exegetical notes that provide historical, cultural, and linguistic information for translators. It provides translators and checkers with pertinent, just-in-time information to help them make the best possible translation decisions.

      [Click here](https://git.door43.org/unfoldingWord/en_tn/releases/tag/v92) to download a Bible book’s PDF

      [Click here](https://preview.door43.org/u/unfoldingWord/en_tn/v92/) to view on the web

      Status: In Progress – v92

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
  - title: <span id="UTQ"></span>unfoldingWord® Translation Questions (UTQ)
    description: |-
      Comprehension and theological questions for each chapter of the Bible. It enables translators and translation checkers to confirm that the intended meaning of their translations is clearly communicated to the speakers of that language.

      [Click here](https://git.door43.org/unfoldingWord/en_tq/releases/download/v92/en_tq_v92.pdf) to download the PDF (All Bible Books)

      [Click here](https://git.door43.org/unfoldingWord/en_tq/releases/tag/v92) to download a Bible book’s PDF

      [Click here](https://preview.door43.org/u/unfoldingWord/en_tq/v92/) to view on the web

      Status: In Progress – v92

      *This work is designed by unfoldingWord® and developed by the [Door43 World Missions Community](https://door43.org/); it is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).*
- type: cards
  title: The biblical content we are creating is governed by the following principles.
  columns: 3
  background: ocean
  align: start
  items:
  - title: Everyone
    body: |-
      Without exception, the Church in every people group will have adequate biblical content in their own language.

      *And Jesus came and said to them, “All authority in heaven and on earth has been given to me. Go therefore and make disciples of all people groups, baptizing them in the name of the Father and of the Son and of the Holy Spirit” —Matthew 28:19*
  - title: Excellence
    body: |-
      Above all else, we strive for excellence in everything we do.

      *Do your best to present yourself to God as one approved, a worker who has no need to be ashamed, rightly handling the word of truth. —2 Timothy 2:15*
  - title: Unstoppable
    body: |-
      We believe God will be glorified through a movement of Bible translation in every language that cannot be repressed.

      *After this I looked, and behold, a great multitude that no one could number, from every people group, from all tribes and peoples and languages, standing before the throne and before the Lamb, clothed in white robes, with palm branches in their hands. —Revelation 7:9*

      *And Jesus came and said to them, “All authority in heaven and on earth has been given to me. Go therefore and make disciples of all people groups, baptizing them in the name of the Father and of the Son and of the Holy Spirit” —Matthew 28:19*
- type: prose
  title: Distinctive Features
  body: |-
    The unfoldingWord project is committed to these things:

    - **Church-centric** — we seek to serve the church in every people group by equipping them for perpetual, self-sufficient translation of biblical content with excellence.
    - **Always open** — everything we create is made available under a license that irrevocably grants the entire church unrestricted freedom. (Acts 4:32)
    - **Biblically faithful** — we are committed to clear and accurate communication of God's Word in every culture.
    - **Quality media** — we enable the church to produce media of the best possible quality that meets their needs.
    - **Accessible** — all content is freely available and redistributable in suitable formats.
- type: split
  title: Versioning
  body: unfoldingWord® uses a simple versioning system to help identify each resource we publish. This versioning system will be used for all resources that are published in the Door43 Catalog which in turn populates our apps. The version number consists of one or more digits separated by periods.
  image: for-translators/versioning.jpg
  imageAlt: Diagram titled "version numbers in unfoldingWord" showing the number 4.1.2, with arrows labeling 4 as the source version number (usually English), 1 as the intermediate source version number (Gateway Language) and 2 as the other language version number
  imagePosition: start
- type: prose
  body: |-
    ### Source language

    The first digit will always indicate the source version. Let's take Open Bible Stories as an example. Since the Open Bible Stories started in English, there is only one digit in the version number for the English OBS:

    > OBS (en) version 4

    If the English OBS gets republished for whatever reason, the new version number will never add a period plus a new number, the same number will increase:

    > OBS version 4 → OBS version 5 (Not version 4.1)

    ### Translation of source language

    For any translation of a source text, the version number of the source will remain the same, then a period and a new digit will be used to distinguish the translation. That digit will always begin at 1. For instance, if English OBS version 4 is translated into Arabic:

    > OBS (en) version 4 → OBS (ar) version 4.1 (Not version 5, Not version 4.0, Not version 4.2)

    If a translation is republished for whatever reason, the digit(s) corresponding to the source text remain the same, only the digit referring to the translation increases. In this case, the first digit (4, referring to the English version it was translated from) remains the same. The second digit (1, referring to the revision of the Arabic translation) increases by one.

    > OBS (ar) version 4.1 → OBS (ar) version 4.2 (Not version 5, Not version 4.1.1, Not version 4.3)

    If a translation is made of a translation, the version number of the source will remain the same, then a period and a new digit will be used to distinguish the translation. For instance, if the Arabic OBS version 4.2 is used as a source text for a translation into Sudanese Arabic (apd) it would look like this:

    > OBS (ar) version 4.2 → OBS (apd) version 4.2.1 (Not version 4.3, Not version 4.2.0)

    ### Updating a version

    If a translation (or source) is updated, all the "downstream" versions are able to see at a glance that one of their source texts has been updated.

    In our example above, if English OBS version 4 is updated to version 5, any of the downstream languages (Arabic at version 4.2 or Sudanese Arabic at 4.2.1) will immediately be able to see that English is now at version 5 and all of their translations are based on the English version 4 of OBS and its subsequent translations.

    To update their version, Arabic would first have to update their text to match the English OBS version 5.

    > OBS (en) version 5 → OBS (ar) version 5.1

    Note: The digit corresponding to Arabic (the second digit) does not keep increasing (e.g. NOT version 4.2 → version 5.3) but rather "re-sets" when an "upstream" version is updated (e.g. (ar) version 4.2 → (ar) version 5.1).

    In this example, Sudanese Arabic would need to update their translation to match the Arabic:

    > OBS (ar) version 5.1 → OBS (apd) 5.1.1
- type: prose
  title: Technical Details
  body: |-
    ### Published resources – versions

    1. All resources published by unfoldingWord follow these guidelines.
    2. All published resources must have a version number.
    3. Any changes to a published resource results in a new version number. — The only possible exception are typographical errors that will not affect the meaning (e.g. punctuation, misspellings). Typos that inadvertently change the meaning should be included in a new version (e.g. "sin on more" instead of "sin no more").
    4. Version numbers increase numerically.

    ### Drafted resources – revisions

    1. Resources that are in a state of flux (e.g. being created, revised, or checked) may be given a revision number to facilitate communication.
    2. Revision numbers are full integers and follow the version number (e.g. ver 2 → rev 3, OR ver 3.3.1 → rev 4).
    3. Once a resource is published, all revisions must be removed as all of the revisions are now incorporated in the new version number (e.g. when ver 12 rev 3 is published → ver 13).
    4. If revisions are needed on the re-published version, the revision numbering restarts at 1 (e.g. when ver 2 rev 3 is published → ver 3, the first revision is ver 3 rev 1 (not ver 3 rev 4)).

    ### Source language versioning

    1. All version numbers are based on the source language. — A notable exception is the Bible, where the source language becomes the language translated from the Greek and Hebrew. The original autographs are stagnant and adding a level to the version number corresponding to these originals only stands to increase the complexity of the versioning system while adding very little benefit. (e.g. the English ULB → ver 1 or ver 8, not ver 1.1 nor ver 1.8)
    2. The version of the source language must be a non-negative integer and should not have a decimal (e.g. ver 13, NOT ver 13.0).
    3. Upon the first publishing, the version number must be greater than zero (e.g. ver 1). — Conversely, if desired an unpublished draft may be considered ver 0 rev 1 → ver 0 rev 2, etc.

    ### Translations

    1. All translations must keep the version number of the resource it was translated from and add a decimal to that version. — e.g. English OBS ver 4 is translated into Swahili. The Swahili translation becomes ver 4.1. If the Swahili translation becomes the source text for a Datooga translation, the Datooga translation becomes ver 4.1.1. — e.g. Van Dyke version was created in Arabic, thus the Arabic would be ver 1. An English translation would become ver 1.1.
    2. If a resource is updated, the updated resource must update its version number, all "downstream" translations must not change their version number until their translation is updated to reflect the changes made to the "upstream" resources. — e.g. In the example above, if the English OBS is updated to ver 5, the Swahili remains ver 4.1 and the Datooga remains 4.1.1. Swahili becomes ver 5.1 only when it has updated its text to match English ver 5. And Datooga will only become ver 5.1.1 after it updates its text to match the Swahili ver 5.1. — e.g. If after updating its text to ver 5.1 the Swahili translators realize that it needs still further revision, then the new published version would become 5.2. If the Datooga updated their translation to match the Swahili ver 5.2, then their translation would be version 5.2.1.

    ### Recommendations

    1. It is strongly recommended that change logs be kept between each publishing to ensure ease of update for all "downstream" languages.
    2. It is recommended that large resources be divided into smaller sections that each have its own version (e.g. each book of the Bible instead of one version for the whole Bible).

    ### Benefits

    1. This system allows for easy identification of needed update (if an "upstream" language has a higher version, then the text needs to be updated).
    2. This system shows how far "downstream" a translation is from the source text (the more decimals, the farther away).
    3. This system begins to show the linguistic "genealogy".
    4. This system should be simple enough for anyone to understand.

    ### Drawbacks

    All minor changes require a complete version change (which runs contrary to normal versioning methodology).

    This system assumes only one primary source language.
---
