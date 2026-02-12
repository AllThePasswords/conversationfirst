import { SectionDivider, Accordion, MetricRow, PrepNav, Bridge, InfoBox, Highlight, TipList, WalkthroughLinks } from './PrepShared';

const QA_ITEMS = [
  {
    question: 'Why n8n? Why now?',
    answer:
      "I'm already a user. I built an automated property valuation workflow \u2014 scraping the price register, Google Maps, geofencing nearby properties. Used all my credits in a few hours. I noticed real UX opportunities immediately. n8n is at the exact stage where design leadership compounds \u2014 small team, doubling, $2.5B valuation, AI-first product. I've built and scaled design teams at HubSpot from exactly this inflection point.",
    details: [
      'Already a paying user on the \u20AC29 plan',
      'Built real workflows for Central Valuations',
      'Noticed UX issues firsthand \u2014 hierarchy problem, AI credit consumption',
      'Company stage matches HubSpot inflection point exactly',
      'Was looking at n8n before Aidan recommended it',
    ],
  },
  {
    question: 'How would you approach doubling the design team?',
    answer:
      "Start with who, not how many. At HubSpot I hired 12\u201313 designers. The lesson: hire for product judgment, autonomy, and taste over craft specialization. At n8n's stage, every hire needs to be a force multiplier. I'd hire people who can work directly with engineers in code, not just Figma. And I'd build a Monday/Wednesday cadence from day one: Monday targets (\"what are you going after?\"), Wednesday group critique. No static recurring 1:1s.",
    details: [
      'Hire for judgment, autonomy, and taste \u2014 not craft specialization',
      'Every hire at this stage is a force multiplier',
      'Designers who work in code, not just Figma',
      'Monday 15-min standup + Wednesday group critique from day one',
      'No static 1:1s \u2014 group accountability builds culture faster',
      'Two frontline managers to give ICs direct support while Head sets vision',
    ],
    bridge:
      "n8n already has technical designers prototyping in code. I'd double down on that culture \u2014 hire design engineers who build, not just people who hand off Figma files.",
  },
  {
    question:
      'How do you think about design for a technical, developer-focused product?',
    answer:
      "I used n8n myself and immediately saw the tension between power and approachability. The canvas is great \u2014 feels familiar from Make.com. But one click into a node and you're in a complicated form. The hierarchy problem is real. The AI assistant goes too far \u2014 too many nodes, too expensive. There's a middle ground. At HubSpot, we designed Breeze as an intent-led system rather than chat-first or feature-nav. Same principle applies: let users express what they need, AI orchestrates the complexity.",
    details: [
      'Canvas/node interface is powerful but forms within nodes are complex',
      'AI assistant created too many nodes \u2014 used 20 credits on one workflow',
      'Middle ground needed between full manual and full AI',
      'Intent-led design: user expresses need, system orchestrates',
      'Breeze AI proved this pattern works \u2014 44% W2 retention',
    ],
  },
  {
    question: 'Tell me about a time you had to make hard people decisions.',
    answer:
      "Hired 12\u201313 designers, let go 3. The hardest lesson: I was too empathetic for too long. My dad told me \"you're not doing anybody any favors by not being brutally honest.\" The two designers I held onto too long should have been gone sooner. When I finally made the hard calls, the team got healthier, I got more time for creative work, and the bar went up. One designer who went through PIP with me is now a senior at a WorkTech AI company \u2014 the process works when the standard is clear.",
    details: [
      'Too empathetic for too long \u2014 delayed decisions that cost team health',
      'Every exit improved team output and morale',
      'PIP designer is now thriving at a WorkTech AI company',
      'Lesson: clear standards help everyone, including the person underperforming',
      'Would set and defend the bar earlier with hindsight',
    ],
  },
  {
    question: 'How do you balance hands-on design with leadership?',
    answer:
      "I told Aidan \"I'm never going to manage anyone again.\" Then I realized it wasn't management I didn't like \u2014 it was managing people who just didn't get it. When the team is strong and autonomous, I can lead vision while they execute. At HubSpot, I led the Breeze AI vision end-to-end \u2014 designing, prototyping, working in LLM instruction files \u2014 while managing 6 designers. The trick: hire so well that management becomes lightweight.",
    details: [
      'Player-coach: vision work + IC design while managing',
      'Strong autonomous team = lightweight management',
      'Led Breeze AI vision while managing 6 senior/staff designers',
      'Works in code and LLM instruction files, not just Figma',
      'Uses Figma mainly for typography/type systems now',
    ],
    bridge:
      "David wants a player-coach who can do vision work and IC design. That's exactly my mode at HubSpot \u2014 especially when the team is strong.",
  },
  {
    question: "What's your impression of n8n's product?",
    answer:
      "I used n8n to build an automated property valuation tool \u2014 scraping the property price register, Google Maps, geofencing nearby properties. Used all my credits in a few hours. The manual experience needs the onboarding video, but once you understand it, it works great. It was designed by engineers and it shows \u2014 that's not a criticism, the functionality is excellent. But there's a hierarchy of information problem: the canvas is simple and powerful, but the forms within nodes are complex. The AI assistant created way too many nodes and was expensive (20 credits for one workflow). There's a massive opportunity in the middle ground.",
    details: [
      'Canvas interface is familiar and intuitive (similar to Make.com)',
      'One click into a node = complicated form \u2014 hierarchy problem',
      'Manual mode works great once you learn it',
      'AI assistant goes too far \u2014 too many nodes, too expensive',
      '\u20AC29 plan with only 50 credits \u2014 used them fast',
      '"You\'re much better off just learning how to do it yourself" \u2014 value perception issue',
      'Massive opportunity in the middle ground between manual and full AI',
    ],
  },
];

const VALUES = [
  {
    value: 'Stay hungry, stay brave, stay kind',
    yours: 'Operating principles \u2014 ambition with empathy',
  },
  {
    value: 'Trust by default',
    yours:
      'Give experienced people space to own decisions \u2014 your management style of trusting seniors to execute',
  },
  {
    value: "Choose what\u2019s right over what\u2019s easy",
    yours:
      'Transparency, direct communication \u2014 your approach to PIPs and hard calls',
  },
  {
    value: 'Ship fast, iterate in public',
    yours:
      'Bar-raisers who ship \u2014 Breeze 90-day ship, Central Valuations launch',
  },
  {
    value: 'Low ego, collaborative',
    yours:
      'Your preference for group critique over static 1:1s \u2014 shared accountability',
  },
  {
    value: 'Community-first, builder-driven',
    yours:
      'Open source ethos \u2014 your design engineering mindset, building in code',
  },
  {
    value: '\u20AC1K dev budget + \u20AC100/month for open source',
    yours:
      'Builder culture that invests in craft \u2014 aligns with your design engineer identity',
  },
];

const DAVID_POINTS = [
  'Led team of 6 at HubSpot, all seniors/staff level',
  'Hired 12\u201313 designers total, let go 3',
  'Player-coach: does vision work + IC design while managing',
  'Loves lo-fi \u2014 "please do lo-fi" resonates',
  '"I\'m never going to manage anyone again... then realized it wasn\'t management I didn\'t like, it was managing people who didn\'t get it"',
  'Interested in player-coach or Head of Design role',
  'Uses Figma mainly for typography/type systems now \u2014 designs in code',
  'Intern from customer support became best team member (asked everyone for ideas)',
  '"Builder-doer culture" \u2014 design engineers who just build',
  'Already used n8n for automated valuation tool, built workflows',
  'Used all credits in a few hours, noted onboarding UX observations',
  '"Designed by engineers but works great" \u2014 hierarchy problem with forms on nodes',
  'AI version "too far gone" \u2014 too many nodes, expensive, middle ground needed',
  'Was looking at n8n before Aidan recommended the company',
  'Central Valuations business \u2014 AI-first rebuild, automation workflows',
  'Left HubSpot due to restructuring, AI leadership moving to North America',
  'Open to all roles David mentioned (IC, manager, head of design)',
];

const PRODUCT_INSIGHTS = [
  {
    label: 'Canvas Interface',
    observation:
      'Looks familiar from Make.com. Simple, powerful, intuitive for technical users.',
    opportunity: "Strong foundation \u2014 don't over-complicate it.",
  },
  {
    label: 'Node Forms',
    observation:
      '"One click away and you\'re into a complicated form." Hierarchy of information problem.',
    opportunity:
      'Progressive disclosure \u2014 show essential fields first, reveal complexity on demand.',
  },
  {
    label: 'Manual Mode',
    observation:
      'Needs the onboarding video but works great once you understand it.',
    opportunity:
      'Reduce dependence on video \u2014 inline guidance, contextual help.',
  },
  {
    label: 'AI Assistant',
    observation:
      'Created too many nodes. Expensive \u2014 used 20 credits on one workflow.',
    opportunity:
      'Middle ground between full manual and full AI. Let AI suggest, user confirms.',
  },
  {
    label: 'Value Perception',
    observation:
      '"You\'re much better off just learning how to do it yourself." \u20AC29 plan with only 50 credits.',
    opportunity:
      'AI should accelerate learning, not replace it. Credit model needs UX consideration.',
  },
];

const TIPS = [
  {
    title: 'David values lo-fi.',
    body: 'Lead with thinking, not polish. He said "please do lo-fi" \u2014 this is your language.',
  },
  {
    title: 'Mention your actual n8n usage prominently.',
    body: "You're a real user with real opinions. The automated valuation tool, the credit consumption, the UX observations \u2014 lead with this.",
  },
  {
    title: 'The intern story resonates.',
    body: 'The customer support intern who became your best team member. It demonstrates you value different kinds of talent and potential over pedigree.',
  },
  {
    title: '"Builder-doer culture" is their language.',
    body: 'Use it. Design engineers who just build. This is how they think about their team.',
  },
  {
    title: 'David manages ~5\u20136 designers himself.',
    body: 'Empathize with that workload. He needs someone who can take that off his plate while maintaining his involvement in critiques.',
  },
  {
    title: 'Be direct about your UX observations.',
    body: "David asked for them and loved hearing them on the intro call. Don't hold back \u2014 the hierarchy problem, the AI credit issue, the middle ground.",
  },
  {
    title: 'Mention Central Valuations.',
    body: "Shows entrepreneurial builder mindset. You didn't just use n8n \u2014 you built a real business tool with it.",
  },
  {
    title: 'Frame "never manage again" as growth, not complaint.',
    body: 'The realization was about the quality of the team, not about management itself. Strong teams make leadership rewarding.',
  },
];

export default function PrepN8n() {
  return (
    <div className="accent-violet">
      <PrepNav
        backHref="#/prep"
        backLabel="Back to Prep"
        count="n8n &middot; Head of Design"
      />
      <div className="prep-page prep-fade-in">
        {/* Hero */}
        <div className="prep-hero">
          <div className="prep-hero-kicker">Screening Interview Prep</div>
          <h1>n8n &mdash; Head of Design</h1>
          <p>
            Screening interview. Doubling a 5-person design team at a $2.5B AI
            automation company.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <span className="prep-tag">n8n &middot; Head of Design</span>
            <span className="prep-tag">Berlin HQ &middot; Remote-first</span>
            <span className="prep-tag">~5&ndash;6 designers &rarr; doubling</span>
          </div>
        </div>

        <SectionDivider />

        {/* Company Context */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Company Context
          </h2>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <MetricRow metrics={[
              { value: '$2.5B', label: 'Valuation', sub: 'Oct 2025 Series C' },
              { value: '$180M', label: 'Series C', sub: 'Led by Accel + NVIDIA' },
              { value: '$40M+', label: 'ARR', sub: '10x revenue growth YoY' },
              { value: '723', label: 'Employees', sub: 'Berlin HQ, remote-first' },
              { value: '2019', label: 'Founded', sub: 'By Jan Oberhauser' },
              { value: 'Fair-code', label: 'License Model', sub: 'Open-source workflow automation' },
            ]} />
          </div>
          <Highlight label="Mission">
            <p>
              &quot;Make AI and automation accessible to everyone.&quot;
              Open-source workflow automation platform, fair-code licensed.
              Remote-first across Europe.
            </p>
          </Highlight>
        </section>

        <SectionDivider />

        {/* Design Team */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Design Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <InfoBox label="Current State">
              <ul>
                <li>~5&ndash;6 IC designers + 1 design lead</li>
                <li>Designers are all technical &mdash; prototyping in code</li>
                <li>Also: design engineer + user researcher</li>
                <li>David (VP Product) manages design currently</li>
              </ul>
            </InfoBox>
            <InfoBox label="2026 Plan">
              <ul>
                <li>Double the design team</li>
                <li>Hiring: IC designers, 2 frontline managers, Head of Design</li>
                <li>David wants to join design critiques</li>
                <li>Hands-on VP but gives space to experienced people</li>
              </ul>
            </InfoBox>
          </div>
        </section>

        <SectionDivider />

        {/* Their Values */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Their Values &mdash; Mapped to Your Experience
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            From n8n&apos;s culture page. Layer these in naturally.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            {VALUES.map((item) => (
              <div key={item.value} className="prep-value-row">
                <div>
                  <div className="prep-value-name">{item.value}</div>
                  <div className="prep-value-yours">{item.yours}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* David Call Alignment */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            David Call Alignment (Jan 28)
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Key data points from the intro call transcript. Stay consistent.
          </p>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {DAVID_POINTS.map((point, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 7, opacity: 0.5 }} />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Product Insights */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Product Insights &mdash; Your UX Observations
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            From actually using n8n. Lead with these &mdash; you&apos;re a real
            user with real opinions.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            {PRODUCT_INSIGHTS.map((item) => (
              <div key={item.label} className="prep-info">
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent)', marginBottom: 'var(--space-2)' }}>
                  {item.label}
                </div>
                <p>{item.observation}</p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <span className="prep-badge">Opportunity</span>
                  <p style={{ margin: 0 }}>{item.opportunity}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Q&A Prep */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Q&amp;A Prep &mdash; Building &amp; Leading Design Teams at Scale
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Tap to expand. Lead with the decision, unpack when they dig in.
          </p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            {QA_ITEMS.map((q, i) => (
              <Accordion key={i} {...q} />
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Bridge to n8n Callout */}
        <section className="prep-fade-in">
          <Bridge label="Why You & n8n">
            <p>
              n8n is at the exact inflection point where design leadership
              compounds. Small technical team, doubling fast, $2.5B valuation,
              AI-first product, builder culture. I&apos;ve scaled design teams
              through this exact phase at HubSpot. I&apos;d bring my
              outcomes-based system, my hiring bar, and my builder-doer mindset
              from day one.
            </p>
          </Bridge>
        </section>

        <SectionDivider />

        {/* Delivery Tips */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Delivery Tips
          </h2>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <TipList tips={TIPS} />
          </div>
        </section>

        <SectionDivider />
        <WalkthroughLinks />

        {/* Footer */}
        <div className="prep-footer">
          Prepared for Eric Greene &middot; n8n Head of Design Interview &middot;
          Feb 2026
        </div>
      </div>
    </div>
  );
}
