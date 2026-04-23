---
_schema: default
title: Contact
pageLink: contact
draft: false
description: Start a conversation with Vynxlabs. A simple conversation is all it takes — we'll discuss your project and get back to you right away.
pageSections:
  - _component: page-sections/heroes/hero-agency
    eyebrow: CONTACT
    heading: Start a *conversation*
    subtext: >-
      A simple conversation is all it takes. We look forward to discussing
      your project with you and will get back to you right away.
    buttonSections: []
    trustedByLabel: ''
    logos: []
    colorScheme: inherit
    backgroundColor: base
    paddingVertical: 4xl
  - _component: page-sections/ctas/cta-form
    heading: Tell us about your business
    subtext: >-
      Fill this in and we'll reach out. Prefer to talk? Call <a
      href="tel:+12083610360">(208) 361-0360</a> or email <a
      href="mailto:info@vynxlabs.com">info@vynxlabs.com</a>.
    formAction: ./
    formBlocks:
      - _component: building-blocks/forms/input
        label: First name
        name: first_name
        type: text
        required: true
      - _component: building-blocks/forms/input
        label: Last name
        name: last_name
        type: text
        required: true
      - _component: building-blocks/forms/input
        label: Company name
        name: company
        type: text
        required: false
      - _component: building-blocks/forms/input
        label: Business website
        name: website
        type: text
        required: false
      - _component: building-blocks/forms/input
        label: Email
        name: email
        type: email
        required: true
      - _component: building-blocks/forms/input
        label: Phone number
        name: phone
        type: tel
        required: true
      - _component: building-blocks/forms/select
        label: Interested in
        name: interest
        required: false
        options:
          - label: Website
            value: website
          - label: Operations Hub
            value: operations-hub
          - label: AI Employee
            value: ai-employee
          - label: I need help choosing
            value: help-choosing
          - label: Other
            value: other
      - _component: building-blocks/forms/textarea
        label: Tell us about your project
        name: message
        required: false
      - _component: building-blocks/forms/submit
        text: Start the conversation
        variant: primary
        size: md
        iconPosition: before
        hideText: false
        disabled: false
    imageSource: /src/assets/images/vynx/storefront.jpeg
    imageAlt: Twin Falls, Idaho storefront
    reverse: false
    colorScheme: inherit
    backgroundColor: surface
    paddingVertical: 4xl
  - _component: page-sections/features/feature-grid
    eyebrow: OTHER CHANNELS
    heading: Prefer another way to reach us?
    subtext: ''
    gap: lg
    minItemWidth: 260
    maxItemWidth: 320
    features:
      - title: Phone
        description: "(208) 361-0360 · Monday–Friday, by appointment."
        iconName: bolt
        iconColor: cyan
      - title: Email
        description: info@vynxlabs.com
        iconName: pencil
        iconColor: cyan
      - title: Office
        description: "148 Blue Lakes Blvd N. #118, Twin Falls, Idaho"
        iconName: cube
        iconColor: cyan
    colorScheme: inherit
    backgroundColor: base
    align: center
---
