---
_schema: default
title: Contact
description: Reach Elevate Idaho by phone, email, or message. Our Boise North End office is open by appointment, Tuesday through Saturday.
pageSections:
  - _component: page-sections/heroes/hero-center
    eyebrow: Contact
    heading: Let's talk.
    subtext: >-
      <p>Most of our conversations are about something six months away — not
      a property that's already on the market. If you're thinking about a move
      in Idaho, we'd be glad to hear from you.</p>
    buttonSections: []
    colorScheme: inherit
    backgroundColor: base
    paddingVertical: 4xl
  - _component: page-sections/ctas/cta-form
    heading: Send us a note.
    subtext: >-
      A real person reads every message, usually within one business day.
      Private inquiries welcome — we understand.
    formAction: ./
    formBlocks:
      - _component: building-blocks/forms/input
        label: Your name
        name: name
        type: text
        required: true
      - _component: building-blocks/forms/input
        label: Email
        name: email
        type: email
        required: true
      - _component: building-blocks/forms/input
        label: Phone (optional)
        name: phone
        type: tel
        required: false
      - _component: building-blocks/forms/textarea
        label: How can we help?
        name: message
        required: true
      - _component: building-blocks/forms/submit
        text: Send message
        variant: primary
        size: md
        iconPosition: before
        hideText: false
        disabled: false
    imageSource: https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80
    imageAlt: Boise home at twilight
    reverse: false
    colorScheme: inherit
    backgroundColor: base
    paddingVertical: 4xl
  - _component: page-sections/features/feature-grid
    eyebrow: Other ways to reach us
    heading: Office, phone, and hours.
    subtext: ''
    gap: xl
    minItemWidth: 280
    maxItemWidth: 360
    features:
      - title: The office
        description: >-
          223 N 6th Street<br>Boise, ID 83702<br><br>A quiet brick
          storefront between Hyde Park and Downtown. Visits are by
          appointment, Tuesday through Saturday.
        iconName: cube
        iconColor: green
      - title: By phone
        description: >-
          (208) 555-0128<br><br>Answered by a member of the team, Monday
          through Friday, 8 AM to 6 PM Mountain.
        iconName: bolt
        iconColor: orange
      - title: By email
        description: >-
          hello@elevateidaho.com<br><br>For agent introductions, media
          requests, or off-market inquiries. Response within one business day.
        iconName: pencil
        iconColor: yellow
    colorScheme: inherit
    backgroundColor: surface
    align: center
    paddingVertical: 4xl
---
