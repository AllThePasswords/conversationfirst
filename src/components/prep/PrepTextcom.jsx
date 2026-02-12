import { useState } from 'react';
import { SectionDivider, Accordion, MetricRow, PrepNav, Bridge, InfoBox, Highlight, TipList, WalkthroughLinks } from './PrepShared';
import PrepChat from './PrepChat';

/* ─── Theme Data ─── */
const THEMES = [
  {
    id: 'customer-experience',
    label: 'Design Decisions & Customer Experience',
    color: 'var(--accent)',
    questions: [
      {
        question:
          'Walk us through a design decision where customer experience drove the direction.',
        answer:
          'Breeze AI: "Brilliant basics" over shiny demo candy. When I inherited Breeze Assistant, usage was only 1.9% of all HubSpot users \u2014 it had been launched in a hurry to get into the AI game but wasn\'t solving real problems. Leadership wanted more AI features. I pushed for what I called "brilliant basics" \u2014 the assistant needed to know everything about your business, connect to all your apps, and actually start saving you time. This became the official strategy: core capabilities first, unique value second. We set up a dedicated context team whose only job was connecting data sources so the AI could actually answer customer questions. This approach drove the product relaunch at INBOUND.',
        details: [
          'Inherited product at 1.9% usage \u2014 not solving real problems despite lots of AI features',
          '"Brilliant basics" reframed by leadership as "core capabilities" \u2014 became the official strategy',
          'Two pillars: core capabilities (know me, know my business) + core context (connect to everything)',
          'Supporting: Central Valuations showed same principle \u2014 trust and fundamentals before speed (\u20ac1bn+ valued)',
        ],
        bridge:
          "Text.com's AI agents need the same discipline. Don't build shiny AI features \u2014 nail the brilliant basics first. Accurate responses from real data, seamless handoff, observable behavior. Your \"AI you control completely\" positioning is exactly this.",
      },
      {
        question:
          'How do you ensure design reflects what customers actually need vs. what stakeholders assume?',
        answer:
          "HubSpot Mobile: Top-tasks research + STAR framework. When I joined, mobile was a companion app. I ran a top-tasks research program \u2014 surveyed hundreds of sales reps asking what they actually needed on mobile. Clear patterns: calling, email follow-ups, meeting prep, post-meeting notes. This became the mobile vision. To protect it, I created STAR (Signal, Target, Assess Results) \u2014 a simple framework for saying no. We also shipped mobile forecasting based on executive intuition rather than signal. It got a few hundred users. That failure reinforced the framework.",
        details: [
          'Top-tasks research as foundation, not stakeholder opinion',
          'STAR framework: Signal \u2192 Target \u2192 Assess Results',
          'Failure story (forecasting) shows intellectual honesty',
          'Built customer feedback loops: NPS, feature CSAT, CS/Support requests into a single dashboard',
        ],
        bridge:
          "With Iza's CX team, I'd build a similar shared signal infrastructure. Design and CX looking at the same data, disagreeing about interpretation, converging on priorities.",
      },
      {
        question:
          'How did you handle trade-offs between different user types or personas?',
        answer:
          "Breeze AI: Speed vs. completeness. Sales reps wanted the AI to do everything immediately \u2014 prepare meetings, draft follow-ups, summarize calls. But AI output quality depends on context depth. We chose opinionated defaults that prioritized the most common sales rep workflows (meeting prep, post-call notes) and made those excellent, rather than trying to support every use case at once. Enterprise customers wanted configuration flexibility, but we optimized for fast execution because that's what field reps needed. The hierarchy was clear: mobile sales rep experience first, enterprise configuration second.",
        details: [
          'Same principle at Central Valuations: valuers needed speed, lenders needed auditability \u2014 lender risk won but valuer UX absorbed the constraint',
          'At HubSpot: understanding that the same customer uses desktop and mobile together raised Sales NPS by 10 points',
          'Trade-off framework: who bears risk when it goes wrong? Design for them first.',
        ],
        bridge:
          "At Text.com: businesses bear risk if AI misbehaves with their customers. Design for business trust and observability first, optimize consumer chat experience within those constraints.",
      },
    ],
  },
  {
    id: 'quality',
    label: 'Setting & Protecting Quality at Scale',
    color: 'var(--accent)',
    questions: [
      {
        question:
          'How do you define quality, and how do you protect it as teams grow?',
        answer:
          'HubSpot Mobile: Quality = usage + voice of customer, not polish. I defined quality through usage metrics and VoC signals (CSAT, NPS). The biggest quality gains came from shipping "brilliant basics" \u2014 call recording, phone number masking, meeting prep, fast post-meeting notes. Things reps consistently asked for. We achieved the highest NPS in the company not through visual polish but by solving the right problems well. I also led a full redesign of the mobile design system to meet WCAG AA standards and shipped dark mode on mobile years before desktop.',
        details: [
          'Quality defined by outcomes, not aesthetics',
          'Accessibility as a quality dimension \u2014 Text.com serves global customers',
          'Shipped dark mode before desktop team',
          'Highest NPS in the company',
        ],
        bridge:
          "For Text.com's AI agents, quality means accurate responses, appropriate confidence levels, and seamless human handoff \u2014 not beautiful chat bubbles.",
      },
      {
        question:
          'How do you maintain consistency across multiple teams or surfaces?',
        answer:
          'HubSpot Mobile at 55 people across 6 pods. Consistency came from: a shared operating cadence \u2014 quarterly planning, quarterly kick-offs, 2-week sprints; a purpose-built mobile design system with AA accessibility; regular design critique across pods; and structuring designer ownership around workflows, not product areas \u2014 so designers owned "sales communications" or "core CRM," which mapped to how customers actually worked.',
        details: [
          'Operating cadence as consistency mechanism',
          'Workflow-based ownership vs. product-area ownership',
          'Design critique as quality ritual',
          '55 people, 6 pods, one coherent product',
        ],
      },
      {
        question:
          'Tell me about a time quality slipped and how you handled it.',
        answer:
          "Mobile accessibility gap. After the first year, I identified a quality gap around accessibility. The existing mobile design system didn't properly support native platform accessibility features. I led a full redesign \u2014 rebuilding components to WCAG AA standards. This wasn't a visible quality issue to most stakeholders, but it was the right thing to do, and it improved usability for all users.",
        details: [
          'Proactive quality identification, not reactive',
          'Accessibility as universal quality improvement',
          'Shows willingness to invest in non-visible quality',
        ],
      },
    ],
  },
  {
    id: 'collaboration',
    label: 'Collaborating with Product, Tech & CX',
    color: 'var(--accent)',
    questions: [
      {
        question: 'How do you work with engineering and product leadership?',
        answer:
          "Breeze AI: Design and engineering as one system. On Breeze, we had 90 days to ship production iOS and Android apps for INBOUND. No net-new headcount. I managed and coached the design team while working directly with engineers in production code and LLM instruction files. We removed traditional handoffs entirely. AI behavior, interaction design, and UI evolved together. Design decisions were validated in production, not in review decks. This only works when there's mutual trust \u2014 engineers trusted my design judgment, I trusted their technical constraints.",
        details: [
          'No handoffs \u2014 design decisions validated in production',
          'Working in LLM instruction files directly',
          'Trust-based collaboration model',
          'Shipped in 90 days with a small team',
        ],
        bridge:
          "Filip has a front-end/dev background \u2014 this is his language. Text.com's AI product work likely needs this same design-eng fusion.",
      },
      {
        question:
          'How do you handle disagreements with Product or Engineering leaders?',
        answer:
          "STAR framework as shared language. At HubSpot Mobile, the STAR framework gave us a shared decision-making language. When an exec pushed for mobile forecasting, we shipped it \u2014 but the framework gave us the data to show it didn't meet the bar. That turned a disagreement into a learning moment. The framework wasn't about design winning \u2014 it was about shared accountability for outcomes.",
        details: [
          'Frameworks as neutral ground for cross-functional decisions',
          'Failure as shared learning, not blame',
          'Data-driven resolution',
        ],
      },
      {
        question:
          'How would you work with a VP of CX to connect design and customer experience?',
        answer:
          "My approach at HubSpot: building customer signal infrastructure. I built inbound customer feedback loops \u2014 mobile NPS, feature CSAT, requests from CS and Support \u2014 into a single dashboard. This gave the whole team a shared source of truth. With Iza's user research background, I'd want to build a similar shared signal infrastructure at Text.com. Design and CX should be looking at the same data, disagreeing about interpretation, and converging on priorities.",
        details: [
          "Reference Iza's research background \u2014 shows you've done homework",
          'Central Valuations: proximity to customers shortened feedback loops from months to days',
          'Shared signal infrastructure > separate reports',
        ],
      },
    ],
  },
  {
    id: 'people',
    label: 'People Decisions & Underperformance',
    color: 'var(--accent)',
    questions: [
      {
        question: 'How do you handle underperformance on your team?',
        answer:
          'Direct experience with PIPs and exits at HubSpot. I managed multiple performance improvement plans and exits. The hardest lesson: investing heavily in coaching someone toward a bar they aren\'t reaching delays decisions that benefit the whole team. I used to believe the gap could always be closed with effort. Experience taught me that taste and judgment tend to be established before someone reaches senior levels. Skills can be developed, but fundamentals either exist or don\'t. In every case where I made the hard call, the team became healthier, standards became clearer, and output improved.',
        details: [
          '"Avoiding hard conversations in the name of empathy costs more \u2014 in time, morale, and focus"',
          'Every exit improved team health',
          'Would set and defend the bar earlier with hindsight',
          'Not cold \u2014 honest about the difficulty',
        ],
      },
      {
        question: 'How do you build and scale a design team?',
        answer:
          "Grew HubSpot Mobile design from 2\u21926 designers. I hired for: product judgment over craft specialization, autonomy, comfort working directly with eng and PM, taste and clarity. I structured ownership around workflows, not product areas. The strongest designers created a compounding effect \u2014 they attracted better candidates, elevated critique, and set implicit standards. One underrated benefit of hiring for taste: it creates trust with cross-functional partners. When engineers trust the designer's judgment, less time is spent debating direction.",
        details: [
          'Hiring criteria: judgment, autonomy, taste',
          'Trust as a multiplier',
          'Strong teams become self-sustaining',
          '"Every strong hire is a multiplier. The bar is the strategy."',
        ],
        bridge:
          "Text.com is ~250 people. A VP of Design hire is high-leverage \u2014 I'd be building the design culture, not just a team.",
      },
      {
        question:
          'Tell me about a time you had to make a difficult people decision.',
        answer:
          "The mid-performer gap during extended leave. A senior designer went on extended leave while I was actively recruiting. Two other senior designers covered the gap. In that environment, strong performers took ownership and moved fast. Mid-level performers didn't fill gaps \u2014 they became net detractors, requiring attention rather than acting as catalysts. This crystallized for me that team composition matters more than team size.",
        details: [
          'Concrete situation, not abstract',
          'Strong team resilience under pressure',
          'Lesson: composition > size',
          "Relevant to Text.com's size \u2014 they need high-signal people, not bodies",
        ],
      },
    ],
  },
  {
    id: 'ai-first',
    label: 'Design in AI-First, Conversational Products',
    color: 'var(--accent)',
    questions: [
      {
        question: 'How does design change in an AI-first product?',
        answer:
          "Breeze AI: From feature navigation to intent expression. The biggest shift: we stopped designing screens and started designing behaviors. In traditional UI, users navigate to features. In AI-first, users express intent and the system orchestrates. For Breeze, when a rep selected a meeting, the system inspected CRM records, pulled company updates, retrieved notes, and synthesized a task-specific interface. Design became about defining what the AI should surface, when, and with what confidence \u2014 not about laying out buttons. We also iterated AI behavior directly in LLM instruction files, not in Figma.",
        details: [
          "Intent-led vs. feature navigation \u2014 directly relevant to Text.com's chatbot/AI agent products",
          'Design as behavior definition, not screen layout',
          'Working in LLM instruction files',
          '"Design and engineering as one system"',
        ],
        bridge:
          "Text.com's AI agents are exactly this pattern \u2014 intent recognition \u2192 orchestrated response \u2192 confidence-appropriate output. I've shipped this.",
      },
      {
        question:
          'How do you maintain quality when AI behavior is unpredictable?',
        answer:
          "Opinionated defaults and confidence-based UI. On Breeze, we chose opinionated defaults over flexibility. Rather than giving reps 20 configuration options, we made strong default decisions and optimized for speed. When AI output was uncertain, we designed the interface to signal confidence levels \u2014 so users could trust what was reliable and verify what wasn't. Quality in AI products is about managing user trust, not pixel perfection.",
        details: [
          'Directly relevant to Text.com\'s "AI you control completely" positioning',
          'Opinionated defaults = faster execution',
          'Trust management as core design problem',
          "Human escalation paths \u2014 Text.com's AI \u2192 human handoff",
        ],
      },
      {
        question: "What doesn't change about design in AI products?",
        answer:
          "Judgment, user research, and quality bar. The tools change but the fundamentals don't. You still need to deeply understand who your user is and what job they're hiring the product to do. On Breeze, we anchored in a specific workflow (meeting prep for mobile sales reps) because we knew it was high-frequency and high-friction. That's classic jobs-to-be-done thinking. AI doesn't change the need for research, taste, or holding a quality bar. If anything, it raises the bar \u2014 because AI can generate mediocre work at scale, the role of design becomes curating quality and defining what \"good\" looks like.",
        details: [
          'Ground in fundamentals \u2014 reassures senior leadership',
          'Jobs-to-be-done approach',
          '"AI can generate mediocre work at scale \u2014 design curates quality"',
          "Relevant: they need someone who won't chase AI hype but will apply disciplined design thinking",
        ],
      },
    ],
  },
];

const BONUS_QUESTIONS = [
  {
    question: 'Why Text.com?',
    answer:
      "You're at a genuine inflection point \u2014 mature product, real revenue, real customers, pivoting to AI-first. I've done exactly this transition at HubSpot, taking a legacy product and building an AI-first experience on top of it. I've also done zero-to-one in a regulated B2B environment. Text.com needs both: someone who can evolve existing products with discipline and build new AI experiences with speed. The fact that your CPO has a front-end/design background and your VP CX is a researcher tells me design has real influence here.",
    details: [],
  },
  {
    question: 'How would you approach your first 90 days?',
    answer:
      "Listen first. I'd want to: sit in on support conversations to understand customer pain, audit current design quality and team capabilities, understand the AI roadmap from Filip's perspective, build a shared signal framework with Iza's CX team, and identify one high-impact design initiative I can lead to build credibility. I wouldn't reorganize anything in the first 90 days \u2014 I'd earn trust through outcomes first.",
    details: [
      'Week 1\u20132: Shadow support, listen to customer calls, read CX data',
      'Week 3\u20134: Audit design quality, team skills, existing design system',
      'Week 5\u20138: Align on one high-impact initiative with Filip and Iza',
      'Week 9\u201312: Ship something meaningful, build credibility through outcomes',
    ],
  },
  {
    question: 'How would you approach conversational AI design specifically?',
    answer:
      'Conversational UI is deceptively simple \u2014 it looks easy but the design challenge is in behavior, not layout. I\'d focus on: defining clear intent patterns for AI agents, designing confidence-appropriate responses (when should AI be assertive vs. hedging?), human handoff moments that feel seamless not broken, and making AI behavior observable and controllable for business customers. Your "AI you control completely" positioning is the right instinct \u2014 I\'d make that real in the product design.',
    details: [
      'Intent pattern library for common customer service scenarios',
      'Confidence-based response design (assertive vs. hedging vs. escalating)',
      'Seamless AI \u2192 human handoff (the hardest UX problem in conversational AI)',
      'Business-facing observability: real-time AI supervision dashboards',
    ],
  },
];

/* ─── Section TOC navigation ─── */
const TOC_ITEMS = [
  { label: 'Walkthroughs', href: '#walkthroughs' },
  { label: 'Values', href: '#values' },
  { label: 'Consistency', href: '#consistency' },
  { label: 'Context', href: '#context' },
  { label: 'Metrics', href: '#metrics' },
  { label: 'Theme Map', href: '#themes' },
  { label: 'Q&A', href: '#qa' },
  { label: 'Process', href: '#process' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Bonus', href: '#bonus' },
  { label: 'Tips', href: '#tips' },
];

/* ─── Page ─── */
export default function PrepTextcom() {
  return (
    <div className="accent-rose">
      <PrepNav backHref="#/prep" backLabel="Back to Prep" />

      {/* ── Section pill nav ── */}
      <nav style={{
        position: 'sticky',
        top: 'calc(var(--space-12) + 1px)',
        zIndex: 20,
        background: 'color-mix(in srgb, var(--bg) 90%, transparent)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-2) var(--space-8)',
        overflowX: 'auto',
      }}>
        <div style={{
          maxWidth: 840,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          {TOC_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="prep-tag"
              style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="prep-page prep-fade-in">
        {/* ── Header ── */}
        <div className="prep-hero">
          <div className="prep-hero-kicker">VP of Design Interview</div>
          <h1>Text.com</h1>
          <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            <span>{'\u23F0'} Feb 13 &middot; 11:30 CET &middot; 1.5 hrs</span>
            <span>{'\u{1F465}'} Filip Jask&oacute;lski (CPO) &middot; Iza Gurgul (VP CX) &middot; Joanna R&#281;kosiewicz</span>
          </div>
        </div>

        {/* ── Walkthrough Cards ── */}
        <section id="walkthroughs" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Case Study Walkthroughs
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Screenshare these. Each is a scroll-through narrative with key
            decisions, metrics, and trade-offs.
          </p>
          <div className="prep-walkthrough-grid" style={{ marginTop: 'var(--space-4)' }}>
            <a href="#/prep/breeze" className="prep-walkthrough-link">
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', margin: 0 }}>
                1. Breeze AI
              </p>
              <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', marginBottom: 0 }}>
                AI-First Standalone App
              </p>
              <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 0 }}>
                90 days &middot; 44% W2 retention &middot; intent-led design
              </p>
            </a>
            <a href="#/prep/mobile" className="prep-walkthrough-link">
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', margin: 0 }}>
                2. HubSpot Mobile
              </p>
              <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', marginBottom: 0 }}>
                Scaling a Sales Work Surface
              </p>
              <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 0 }}>
                8x WAU &middot; 6 pods &middot; STAR framework
              </p>
            </a>
            <a href="#/prep/leadership" className="prep-walkthrough-link">
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', margin: 0 }}>
                3. Leadership
              </p>
              <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', marginBottom: 0 }}>
                Design Leadership at Scale
              </p>
              <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 0 }}>
                Hired 12 &middot; exited 3 &middot; outcomes over outputs
              </p>
            </a>
          </div>
        </section>

        <SectionDivider />

        {/* ── Their Values ── */}
        <section id="values" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Their Values &mdash; Embody These
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            From Text.com&apos;s &quot;Focus&quot; page &mdash; their 11 operating
            rules. Layer these in naturally.
          </p>
          <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
            {[
              { value: 'Build premium products', yours: 'Brilliant basics, AA design system, highest NPS' },
              { value: 'Keep it simple', yours: 'STAR framework, Monday standups, outcomes not outputs' },
              { value: 'Default to teamwork', yours: 'Triad model, design+eng as one system, shared dashboards' },
              { value: 'Take ownership', yours: 'Spun up mobile app on your own initiative, vision deck in 2 weeks' },
              { value: 'Call out bullshit', yours: 'Pushed back on shiny AI demos, forecasting failure, VP decisions' },
              { value: 'Learn from mistakes', yours: 'Forecasting flop, PIP reflections, VP pushback lesson' },
              { value: 'Fight for every inch', yours: '1.9% \u2192 meaningful usage, 90-day deadline delivery' },
              { value: 'Act at scale', yours: '55-person group, 6 pods, cross-platform strategy' },
              { value: 'Automate work', yours: 'Automated performance tracking, built signal dashboards' },
            ].map((item) => (
              <InfoBox key={item.value} style={{ margin: 0 }}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                  {item.value}
                </p>
                <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 0 }}>
                  {item.yours}
                </p>
              </InfoBox>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Consistency Check ── */}
        <section id="consistency" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            {'\u26A0'} Aneta Interview Alignment
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Key data points from your Feb 3 call. Stay consistent.
          </p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            {[
              'Group: 55 people, 6 designers, additional researchers + design system specialists',
              'Partners: Senior Director of Engineering + Senior Director of Product (triad leadership)',
              'Breeze usage was 1.9% when inherited \u2014 not solving real problems',
              '"Brilliant basics" \u2192 reframed by leadership as "core capabilities"',
              'Two pillars: core capabilities + core context',
              'Sales Hub became a $1B revenue business; cross-platform raised Sales NPS by 10 points',
              'Mobile app launched in 90 days, ~5K monthly downloads',
              'Hired 12 designers across career, let go 3',
              'Monday 15-min standup ("what targets?") + Wednesday group critique',
              'Performance = outcomes (Amplitude charts), not outputs (Figma files)',
              'Reflection: should have pushed back on VPs earlier \u2014 arbitrary Mac app cut, India team timezone',
              'Salary discussed: ~\u20ac200K; remote, quarterly Poland visits',
              'Text.com has 23 product designers across Spotify-style experience stripes',
              'Collins agency doing rebrand mid-2026; you did HubSpot rebrand (Cooper Hosk) + Aer Lingus rebrand',
            ].map((point, i) => (
              <div key={i} className="prep-accordion-detail" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Text.com Context ── */}
        <section id="context" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            About Text.com
          </h2>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Polish company (Wroclaw), publicly traded (WSE: TXT), ~$89M ARR,
              ~250 employees. Rebranded from &quot;LiveChat Software&quot; to
              &quot;Text&quot; in 2023 to signal AI-first pivot.
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>Products:</span>{' '}
              LiveChat, ChatBot, HelpDesk, KnowledgeBase, OpenWidget, Text
              Platform (developer APIs).
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>Customers:</span>{' '}
              28,000+ paid (PayPal, IKEA, Atlassian, Mercedes-Benz).
              Positioning: &quot;Customer Service Automation Built for
              Growth.&quot;
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>AI strategy:</span>{' '}
              AI baked into core, not bolted on. No usage surprises (bundled
              pricing). AI agents automate 80%+ routine cases. &quot;AI you
              control completely.&quot;
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>Competitors:</span>{' '}
              Intercom, Zendesk, Drift. Differentiated by bundled AI pricing
              and native integration.
            </p>
          </div>

          <InfoBox label="Know Your Panel" style={{ marginTop: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <p style={{ margin: 0 }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  Filip Jask&oacute;lski (CPO)
                </span>{' '}
                &mdash; Developer background with front-end/design interest. Led
                LiveChat Platform Teams (core messaging, APIs, marketplace).
                Speak his language: production code, LLM instruction files,
                design systems as code.
              </p>
              <p style={{ margin: 0 }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  Iza Gurgul (VP CX)
                </span>{' '}
                &mdash; User researcher by training. She&apos;ll care about how you
                use customer signal. Lean into feedback loops, NPS
                infrastructure, top-tasks methodology.
              </p>
              <p style={{ margin: 0 }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                  Joanna R&#281;kosiewicz
                </span>{' '}
                &mdash; Assessing leadership. She&apos;ll listen for self-awareness,
                how you talk about people decisions, and whether you take
                responsibility for hard outcomes.
              </p>
            </div>
          </InfoBox>

          <Highlight label="Why You Fit" style={{ marginTop: 'var(--space-4)' }}>
            <p>
              Text.com is at an inflection &mdash; shifting from mature live-chat to
              AI-first conversational platform. They need a VP of Design who
              has done exactly this transition (legacy &rarr; AI-first), scaled
              teams through it, and can hold quality while moving fast.
              That&apos;s your Breeze story, your mobile story, and your
              leadership story.
            </p>
          </Highlight>
        </section>

        <SectionDivider />

        {/* ── Key Metrics ── */}
        <section id="metrics" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Your Numbers
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Drop these early. They anchor credibility fast.
          </p>
          <MetricRow metrics={[
            { value: '44%', label: 'Week 2 Retention', sub: 'Breeze AI standalone app' },
            { value: '8x', label: 'Mobile WAU Growth', sub: 'HubSpot Mobile' },
            { value: '90 days', label: 'Vision \u2192 Production', sub: 'Breeze iOS + Android' },
            { value: '\u20ac1bn+', label: 'Property Valued', sub: 'Central Valuations' },
            { value: '#1 NPS', label: 'Highest in Company', sub: 'HubSpot Mobile' },
            { value: '2\u21926', label: 'Design Team Scaled', sub: '55-person group, 6 pods' },
          ]} />
        </section>

        <SectionDivider />

        {/* ── Theme Map ── */}
        <section id="themes" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Theme &rarr; Case Study Map
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Your primary weapon for each area they said they&apos;d cover.
          </p>
          <table className="prep-table" style={{ marginTop: 'var(--space-4)' }}>
            <thead>
              <tr>
                <th>Interview Theme</th>
                <th>Primary Story</th>
                <th>Supporting</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: 'var(--text)' }}>Design &harr; customer experience</td>
                <td>Central Valuations (lender/valuer trust)</td>
                <td>Mobile (top-tasks, STAR framework)</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text)' }}>Quality at scale</td>
                <td>Mobile (design system, NPS)</td>
                <td>Leadership (holding the bar, PIPs)</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text)' }}>Product, Tech, CX collaboration</td>
                <td>Breeze (design+eng as one system)</td>
                <td>Mobile (55-person group, 6 pods)</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text)' }}>People &amp; underperformance</td>
                <td>Design Leadership at Scale</td>
                <td>Mobile (mid-performer gap story)</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text)' }}>AI-first / conversational</td>
                <td>Breeze AI standalone app</td>
                <td>Dawn of the Design Engineer</td>
              </tr>
            </tbody>
          </table>
        </section>

        <SectionDivider />

        {/* ── Q&A by Theme ── */}
        <section id="qa" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Question Walkthroughs
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Tap to expand. Lead with the decision, unpack when they dig in.
          </p>

          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {THEMES.map((theme) => (
              <div key={theme.id}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 0 }}>
                  {theme.label}
                </h3>
                <div style={{ marginTop: 'var(--space-2)' }}>
                  {theme.questions.map((q, i) => (
                    <Accordion key={i} {...q} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Process Flow ── */}
        <section id="process" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            How I Work: Operating Model
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Your design leadership operating model &mdash; reference when they ask
            about process.
          </p>

          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Strategic Layer */}
            <InfoBox>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', margin: 0 }}>
                Strategic Layer
              </p>
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    1. Vision &amp; Roadmap
                  </p>
                  <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 0 }}>
                    Define what the product should become. Anchor in customer
                    reality, not feature requests.
                  </p>
                </div>
                <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--space-4)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    2. Customer Signal Infrastructure
                  </p>
                  <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 0 }}>
                    Top-tasks research &middot; NPS &middot; Feature CSAT &middot; Support/CS
                    feedback &rarr; Single shared dashboard. One source of truth
                    for the whole team.
                  </p>
                </div>
                <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--space-4)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    3. Decision Framework (STAR)
                  </p>
                  <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {['Signal', 'Target', 'Assess', 'Results'].map((s) => (
                      <span key={s} className="prep-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 0 }}>
                    Is the feature highly used / requested? Who is the primary
                    user? Does shipping it drive usage, retention, or NPS?
                    Shared language for saying no.
                  </p>
                </div>
              </div>
            </InfoBox>

            {/* Arrow */}
            <div className="prep-divider" style={{ padding: 'var(--space-2) 0' }}>
              <div className="prep-divider-line" style={{ height: 24 }} />
            </div>

            {/* Execution Layer */}
            <InfoBox>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', margin: 0 }}>
                Execution Layer
              </p>
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    4. Cadence
                  </p>
                  <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 0 }}>
                    Quarterly planning &rarr; Quarterly kick-offs &rarr; 2-week
                    delivery sprints. Each quarter begins with cross-functional
                    alignment on priorities, success metrics, and trade-offs.
                  </p>
                </div>
                <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--space-4)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    5. Team Structure
                  </p>
                  <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 0 }}>
                    Workflow-based ownership (not product areas). Hire for:
                    judgment, autonomy, taste. Designers own how customers
                    actually work &mdash; &quot;sales communications&quot; or
                    &quot;core CRM,&quot; not &quot;settings page.&quot;
                  </p>
                </div>
                <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 'var(--space-4)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    6. Quality Gates
                  </p>
                  <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 0 }}>
                    Cross-pod design critique &middot; AA-accessible design system &middot;
                    Usage + VoC metrics as quality definition (not polish
                    alone).
                  </p>
                </div>
              </div>
            </InfoBox>

            {/* Arrow */}
            <div className="prep-divider" style={{ padding: 'var(--space-2) 0' }}>
              <div className="prep-divider-line" style={{ height: 24 }} />
            </div>

            {/* Loop */}
            <div style={{
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-5)',
              textAlign: 'center',
              background: 'var(--surface)',
            }}>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>
                Ship &rarr; Measure &rarr; Learn &rarr; Repeat
              </p>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Architecture Diagram ── */}
        <section id="architecture" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Breeze AI: Orchestration Architecture
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            How the AI assistant orchestrates multiple data sources into a
            synthesized, task-specific interface.
          </p>

          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* User Intent */}
            <InfoBox style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', margin: 0 }}>
                User Intent
              </p>
              <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', marginBottom: 0 }}>
                &quot;Prepare for meeting with Acme Corp&quot;
              </p>
              <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 0 }}>
                Intent-led, not feature navigation
              </p>
            </InfoBox>

            <div className="prep-divider" style={{ padding: 'var(--space-2) 0' }}>
              <div className="prep-divider-line" style={{ height: 24 }} />
            </div>

            {/* Orchestration Layer */}
            <Highlight style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', margin: 0 }}>
                Orchestration Layer
              </p>
              <p style={{ marginTop: 'var(--space-2)', textAlign: 'center' }}>
                LLM instruction files iterated by design + engineering
                together
              </p>
              <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 0, textAlign: 'center' }}>
                No handoffs &mdash; AI behavior, interaction design, and UI evolved
                as one system
              </p>
            </Highlight>

            <div className="prep-divider" style={{ padding: 'var(--space-2) 0' }}>
              <div className="prep-divider-line" style={{ height: 24 }} />
            </div>

            {/* Data Sources */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-2)' }}>
              {[
                { label: 'CRM Records', icon: '\uD83D\uDCCB' },
                { label: 'Email History', icon: '\uD83D\uDCE7' },
                { label: 'Notes & Actions', icon: '\uD83D\uDCDD' },
                { label: 'Call History', icon: '\uD83D\uDCDE' },
                { label: 'External Context', icon: '\uD83C\uDF10' },
              ].map((src) => (
                <InfoBox key={src.label} style={{ margin: 0, textAlign: 'center' }}>
                  <p style={{ fontSize: 'var(--text-lg)', margin: 0 }}>{src.icon}</p>
                  <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 0 }}>
                    {src.label}
                  </p>
                </InfoBox>
              ))}
            </div>

            <div className="prep-divider" style={{ padding: 'var(--space-2) 0' }}>
              <div className="prep-divider-line" style={{ height: 24 }} />
            </div>

            {/* Synthesized Interface */}
            <InfoBox>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', margin: 0 }}>
                Synthesized Interface
              </p>
              <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 0 }}>
                Task-specific UI (not generic chat)
              </p>
              <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
                {[
                  'Meeting brief',
                  'Key contacts',
                  'Open actions',
                  'Suggested prep',
                ].map((item) => (
                  <div
                    key={item}
                    className="prep-tag"
                    style={{ display: 'block', textAlign: 'center', padding: 'var(--space-2) var(--space-3)' }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {[
                  'OCR Scanner',
                  'Voice Dictation',
                  'Dark Mode',
                  'AA Accessible',
                ].map((feat) => (
                  <span key={feat} className="prep-tag">
                    {feat}
                  </span>
                ))}
              </div>
            </InfoBox>

            <div className="prep-divider" style={{ padding: 'var(--space-2) 0' }}>
              <div className="prep-divider-line" style={{ height: 24 }} />
            </div>

            {/* Platforms */}
            <div style={{
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-5)',
              textAlign: 'center',
              background: 'var(--surface)',
            }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                iOS &middot; Android &middot; Desktop (closed beta)
              </p>
              <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 0 }}>
                Shipped in 90 days &middot; ~5K downloads/month &middot; 44% W2 retention
              </p>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Bonus Questions ── */}
        <section id="bonus" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Bonus: Text.com-Specific Questions
          </h2>
          <div style={{ marginTop: 'var(--space-4)' }}>
            {BONUS_QUESTIONS.map((q, i) => (
              <Accordion key={i} {...q} />
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Delivery Tips ── */}
        <section id="tips" style={{ scrollMarginTop: '120px' }} className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Delivery Tips
          </h2>
          <TipList tips={[
            {
              title: 'Lead with the decision, not the backstory.',
              body: 'They said "fewer questions, more depth" \u2014 start with the punchline, then unpack when they dig in.',
            },
            {
              title: 'Use numbers early.',
              body: '44% W2 retention, 8x usage growth, \u20ac1bn+ valued, 90-day delivery, 55-person group \u2014 these anchor credibility fast.',
            },
            {
              title: 'Name the trade-off.',
              body: 'Every good answer includes what you chose NOT to do. Marketplace vs. infrastructure. Flexibility vs. opinionated defaults.',
            },
            {
              title: 'Be honest about mistakes.',
              body: 'They explicitly asked for honesty and reflection. Your forecasting failure, your slowness on PIPs, the stakeholder gap on Breeze \u2014 these are strengths when owned.',
            },
            {
              title: 'Bridge to Text.com.',
              body: 'After each answer: "I imagine at Text.com, a similar challenge might be..." Shows you\'re already thinking about their problems.',
            },
            {
              title: 'Filip is technical.',
              body: "Speak his language \u2014 production code, LLM instruction files, design systems as code. Don't over-abstract.",
            },
            {
              title: 'Iza is a researcher.',
              body: "She'll care about how you use customer signal. Lean into feedback loops, NPS infrastructure, top-tasks methodology.",
            },
            {
              title: 'Joanna is assessing leadership.',
              body: "She'll listen for self-awareness, how you talk about people decisions, and whether you take responsibility for hard outcomes.",
            },
          ]} />
        </section>

        {/* ── Footer ── */}
        <div className="prep-footer">
          Prepared for Eric Greene &middot; Text.com VP of Design Interview &middot; Feb 13,
          2026
        </div>

        <PrepChat companyId="textcom" placeholder="Ask about Text.com, your talking points, or practice an answer..." />
      </div>
    </div>
  );
}
