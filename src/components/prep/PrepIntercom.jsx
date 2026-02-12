import { useState } from 'react';
import { SectionDivider, Accordion, MetricRow, PrepNav, Bridge, InfoBox, Highlight, TipList, WalkthroughLinks } from './PrepShared';

/* ─── Q&A Data ─── */
const QA_ITEMS = [
  {
    question: 'Walk us through a recent project.',
    answer:
      'Breeze AI Standalone App. Inherited at 1.9% usage across all HubSpot users. Reframed as "brilliant basics" \u2014 core capabilities first, not more AI features. Shipped a standalone AI-first app in 90 days with 2 designers. 44% week-2 retention. Contributed to +10 NPS for $1B Sales Hub. Key: removed traditional handoffs, worked directly in production code and LLM instruction files.',
    details: [
      '1.9% usage \u2192 reframed as core capabilities problem, not feature problem',
      '90-day deadline for INBOUND conference, no net-new headcount',
      'Purpose-built AI design system for conversational workflows',
      '44% W2 retention \u2014 strong signal for AI-first product',
      'Contributed to +10 NPS improvement across $1B Sales Hub',
    ],
    bridge:
      'Fin.ai faces the same design challenge: when should AI resolve vs. escalate? I shipped exactly this pattern at HubSpot \u2014 intent recognition, confidence-appropriate output, and human handoff.',
  },
  {
    question:
      'How do you think about design at the Staff/Principal level?',
    answer:
      'Your career path blog post describes exactly how I\u2019ve operated. At HubSpot I was the force multiplier across adjacent teams \u2014 leading Breeze AI vision while my senior designers executed autonomously. I identified problems at the group level, drove solutions across teams, and improved design process (Monday/Wednesday cadence). The Staff/Principal distinction is about influence radius, not hierarchy.',
    details: [
      'Staff = force multiplier across adjacent teams \u2014 exactly my HubSpot mode',
      'Principal = group-level influence, co-leading with cross-functional leaders',
      'Led Breeze vision end-to-end while managing 6 senior/staff designers',
      'Monday targets + Wednesday critique \u2014 lightweight system that scales',
      'Influence radius, not management headcount, defines the level',
    ],
    bridge:
      'Intercom\u2019s parallel IC track (Senior \u2192 Staff \u2192 Principal) without mandatory management is exactly the player-coach mode I\u2019m best in.',
  },
  {
    question: 'Tell us about your approach to systems thinking.',
    answer:
      'Every project I lead starts with the system, not the screen. Breeze: built a purpose-built design system for AI workflows. Mobile: designed signal infrastructure (STAR framework) for prioritization. Central Valuations: architected the entire service stack as a designer. I think in systems because I build in code \u2014 you understand the constraints differently when you ship.',
    details: [
      'Breeze: purpose-built AI design system \u2014 not retrofitting existing components',
      'Mobile: STAR framework (Signal, Target, Assess Results) for prioritization',
      'Central Valuations: full-stack architecture designed and built by a designer',
      'Systems thinking comes from building in code, not just designing in Figma',
      'Design system, decision framework, and product architecture are all systems work',
    ],
    bridge:
      'Fin.ai is a systems problem: intent recognition \u2192 orchestrated response \u2192 confidence-appropriate output \u2192 human handoff. That\u2019s not a screen, it\u2019s a behavior system. I\u2019ve built this.',
  },
  {
    question: 'How do you handle disagreement or pushback?',
    answer:
      'My honest reflection from HubSpot: I should have pushed back on VP decisions earlier. The arbitrary Mac app cut, the India team with timezone misalignment \u2014 I agreed too quickly. Going forward: respectful directness. You can think about it and honestly say what you feel. The bar is the strategy \u2014 that\u2019s not negotiable.',
    details: [
      'Honest self-awareness: agreed too quickly on decisions I disagreed with',
      'Mac app cut and India team \u2014 specific examples of where directness was needed',
      'Lesson learned: respectful directness > diplomatic compliance',
      'The quality bar is the strategy \u2014 protecting it isn\u2019t pushback, it\u2019s leadership',
      'Intercom values "adaptive but opinionated" \u2014 this is exactly that growth',
    ],
  },
  {
    question: 'What draws you to Intercom?',
    answer:
      'Three things. First, Fin.ai is the exact problem space I just worked in \u2014 AI agents, intent recognition, orchestrated response, human handoff. I shipped this at HubSpot. Second, Dublin-based \u2014 I\u2019m local, no relocation needed, and I want to contribute to the Dublin tech scene. Third, your "designers who ship" culture is how I work \u2014 I design in code, prototype with LLMs, and care about outcomes over artifacts.',
    details: [
      'Fin.ai = same design challenges as Breeze: AI confidence, human handoff, intent-led UX',
      'Dublin HQ \u2014 local, no relocation, immediate availability',
      '"Designers who ship" culture matches my design engineering identity',
      'No homework assignments \u2014 shows respect for candidates and signals maturity',
      'Founder-led company at $343M revenue \u2014 still growing fast but not chaotic',
    ],
  },
];

/* ─── Page ─── */
export default function PrepIntercom() {
  return (
    <div className="accent-blue">
      <PrepNav backHref="#/prep" backLabel="Back to Prep" />

      <div className="prep-page prep-fade-in">
        {/* ── Header ── */}
        <div className="prep-hero">
          <div className="prep-hero-kicker">Pre-screening Interview Prep</div>
          <h1>Intercom &mdash; Design Leadership</h1>
          <p>
            Pre-screening via John Moriarty. Staff/Principal Designer or Design
            Director &mdash; role TBD.
          </p>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <span className="prep-tag">Intercom &middot; Design Leadership</span>
            <span className="prep-tag">Dublin HQ &middot; Pre-screening</span>
            <span className="prep-tag">Fin.ai &middot; AI Customer Service</span>
          </div>
        </div>

        <SectionDivider />

        {/* ── Context Card: John Moriarty ── */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Your Contact
          </h2>
          <Highlight>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                  John Moriarty
                </p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
                  Product Design Director &middot; Since Dec 2025
                </p>
              </div>
              <span className="prep-badge">Building Fin.ai</span>
            </div>
            <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
              <div className="prep-info" style={{ margin: 0 }}>
                <div className="prep-info-label">Background</div>
                <p>
                  Previously Head of Product Design at DataRobot (agentic/generative
                  AI workflows). 18+ years designing and scaling digital products.
                </p>
              </div>
              <div className="prep-info" style={{ margin: 0 }}>
                <div className="prep-info-label">How He Found You</div>
                <p>
                  Reached out after seeing your portfolio and Breeze case study
                  video. Watched the 1-minute Breeze video and found it helpful.
                  Asked for the password to your case studies.
                </p>
              </div>
              <div className="prep-info" style={{ margin: 0 }}>
                <div className="prep-info-label">Location</div>
                <p>
                  Based in Dublin, Ireland. Building Fin.ai &mdash; Intercom&apos;s
                  AI agent and customer service suite.
                </p>
              </div>
              <div className="prep-info" style={{ margin: 0 }}>
                <div className="prep-info-label">Signal</div>
                <p>
                  Your experience is &quot;well aligned with some roles we have
                  open.&quot; Setting up initial recruitment team screening.
                </p>
              </div>
            </div>
          </Highlight>
        </section>

        <SectionDivider />

        {/* ── Company Overview ── */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Company Overview
          </h2>
          <MetricRow metrics={[
            { value: '$343M', label: 'Revenue (2024)', sub: 'Up 25% year-over-year' },
            { value: '$1.3B', label: 'Valuation', sub: '$240M total funding' },
            { value: '~1,847', label: 'Employees', sub: 'Dublin, London, SF, Chicago, Sydney' },
            { value: '14 yrs', label: 'Founded', sub: 'Founder-led company' },
            { value: '60+', label: 'Designers', sub: 'Across R&D and Brand' },
            { value: '65%', label: 'Fin.ai Resolution Rate', sub: '$100M+ committed to AI' },
          ]} />
          <Highlight label="Mission" style={{ marginTop: 'var(--space-4)' }}>
            <p>
              &quot;Make internet business personal.&quot; AI pivot: Fin.ai
              resolves 65% of customer queries. AI team scaled from &lt;10 to
              50+ researchers. $100M+ committed to AI investment.
            </p>
          </Highlight>
          <InfoBox style={{ marginTop: 'var(--space-3)' }}>
            <p style={{ fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              SVP Design: Emmet Connolly
            </p>
            <p style={{ marginTop: 'var(--space-1)' }}>
              Previously Android Wear and Google Flights. Dublin HQ has 78
              open roles. Berlin office coming soon.
            </p>
          </InfoBox>
        </section>

        <SectionDivider />

        {/* ── Design Team Structure ── */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Design Team Structure
          </h2>
          <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
            <InfoBox style={{ margin: 0 }}>
              <div className="prep-info-label">How They Work</div>
              <ul>
                <li>Cross-functional model: designers embedded with engineers and PMs</li>
                <li>&quot;Designers who ship&quot; culture</li>
                <li>No homework assignments in hiring process</li>
                <li>Design philosophy: ship, measure, iterate</li>
              </ul>
            </InfoBox>
            <InfoBox style={{ margin: 0 }}>
              <div className="prep-info-label">Career Levels (IC Track)</div>
              <ul>
                <li>Senior &rarr; Staff &rarr; Principal (parallel IC track)</li>
                <li>No management required for progression</li>
                <li>Staff = force multiplier across adjacent teams</li>
                <li>Principal = group-level influence, co-leads with cross-functional leaders</li>
              </ul>
            </InfoBox>
          </div>
        </section>

        <SectionDivider />

        {/* ── Their Values ── */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Their Values &mdash; Mapped to Your Experience
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            From Intercom&apos;s careers page. Layer these in naturally.
          </p>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {[
              {
                value: 'Success First',
                motto: 'Shareholder value through incredible work',
                yours:
                  'Outcomes-based performance system. Metrics on every project. Sales Hub NPS +10.',
              },
              {
                value: 'Incredibly High Standards',
                motto: 'We aspire to true greatness',
                yours:
                  'Hiring bar \u2014 hired 12, exited 3 who didn\u2019t meet the bar. Won\u2019t settle.',
              },
              {
                value: 'Open Mindedness',
                motto: 'Question the status quo',
                yours:
                  'Pushed for "brilliant basics" when leadership wanted more AI features. Challenged VP decisions.',
              },
              {
                value: 'Resilience',
                motto: 'Adaptability amid change',
                yours:
                  'Led through HubSpot reorg (25% of group affected). Shipped Breeze while managing team transitions.',
              },
              {
                value: 'Impatience',
                motto: '52 weeks is not a long amount of time',
                yours:
                  '90-day Breeze ship. "Deel Speed" mindset. Action over process.',
              },
              {
                value: 'Customer Obsessed',
                motto: 'Exceptional customer focus',
                yours:
                  'Top-tasks research drove mobile strategy. Intern from customer support was best hire. Customer connection over Figma files.',
              },
            ].map((item) => (
              <div key={item.value} className="prep-value-row">
                <div className="prep-value-icon">{'\u2726'}</div>
                <div>
                  <span className="prep-value-name">
                    {item.value}{' '}
                    <span className="prep-value-motto">
                      &mdash; &quot;{item.motto}&quot;
                    </span>
                  </span>
                  <div className="prep-value-yours">{item.yours}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── What They Look For in Designers ── */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            What They Look For in Designers
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            From their hiring blog. Hit these naturally in conversation.
          </p>
          <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
            {[
              {
                trait: 'Strategy & problem definition',
                yours: 'Breeze reframe: usage problem, not feature problem',
              },
              {
                trait: 'Systems thinking',
                yours: 'AI design system, STAR framework, full-stack architecture',
              },
              {
                trait: 'Collaboration across functions',
                yours: 'Design+eng as one system, no handoffs on Breeze',
              },
              {
                trait: 'Quality beyond surface',
                yours: 'Product scoping + interaction design, not just visual polish',
              },
              {
                trait: 'Impact focus',
                yours: '"What changed because of your work?" \u2014 44% retention, +10 NPS',
              },
              {
                trait: 'Growth mindset',
                yours: 'Humility about PIP timing, VP pushback lessons, self-awareness',
              },
              {
                trait: 'Adaptive but opinionated',
                yours: 'Pushed for brilliant basics, not someone who always says yes',
              },
              {
                trait: 'Outputs AND outcomes',
                yours: 'Shipped the app AND moved the metrics. Both matter.',
              },
              {
                trait: 'Kindness and generosity',
                yours: 'Empathy as a strength \u2014 Intercom values this (unlike the "too empathetic" HubSpot lesson)',
              },
            ].map((item) => (
              <InfoBox key={item.trait} style={{ margin: 0 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--accent)', margin: 0 }}>
                  {item.trait}
                </p>
                <p style={{ marginTop: 'var(--space-1)' }}>{item.yours}</p>
              </InfoBox>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── What John Saw in Your Portfolio ── */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            What John Saw in Your Portfolio
          </h2>
          <div style={{ marginTop: 'var(--space-4)' }}>
            {[
              'He asked for the password to your case studies \u2014 took the extra step',
              'He watched the Breeze 1-minute video and found it helpful',
              'Your experience is "well aligned with some roles we have open"',
              'He\u2019s setting up initial recruitment team screening',
              'He\u2019s new to Intercom (Dec 2025) \u2014 building his team, looking for strong early additions',
            ].map((point, i) => (
              <div key={i} className="prep-accordion-detail" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Why Intercom Aligns ── */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Why Intercom Aligns
          </h2>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {[
              {
                point: 'AI-first product company',
                detail:
                  'Fin.ai is the exact product category you just worked in. You built AI-first customer service tools at HubSpot (Breeze).',
              },
              {
                point: '"Conversation first" design system',
                detail:
                  'You\u2019ve been working on this exact concept. Directly relevant to Fin.',
              },
              {
                point: 'Dublin-based',
                detail:
                  'You\u2019re in Dublin. No relocation, no visa, immediate availability. Massive advantage.',
              },
              {
                point: '"Designers who ship" culture',
                detail:
                  'Your entire identity. You design in code, prototype with LLMs, and care about outcomes over artifacts.',
              },
              {
                point: 'Cross-functional embedded model',
                detail:
                  'How you\u2019ve always worked. Designers embedded with engineers and PMs, not siloed.',
              },
              {
                point: 'Staff/Principal = IC leadership',
                detail:
                  'No mandatory management. Exactly the player-coach mode you love.',
              },
              {
                point: 'No homework assignments',
                detail:
                  'Shows respect for candidates and signals hiring maturity.',
              },
            ].map((item) => (
              <div key={item.point} className="prep-value-row">
                <div className="prep-value-icon">{'\u2713'}</div>
                <div>
                  <span className="prep-value-name">{item.point}</span>
                  <div className="prep-value-yours">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ── Q&A Prep ── */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Q&amp;A Prep
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

        {/* ── Bridge to Intercom Callout ── */}
        <section className="prep-fade-in">
          <Bridge label="Bridge to Intercom">
            <p>
              Intercom is building the future of AI customer service with Fin. I
              just spent two years building AI-first customer service tools at
              HubSpot &mdash; Breeze AI assistant, intent-led workflows,
              confidence-appropriate AI output. The design challenges are
              identical: when should AI be assertive vs. hedging, how do you
              design seamless human handoff, how do you make AI behavior
              observable. I&apos;d bring this exact experience to Fin.
            </p>
          </Bridge>
        </section>

        <SectionDivider />

        {/* ── Delivery Tips ── */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Delivery Tips
          </h2>
          <TipList tips={[
            {
              title: 'This is pre-screening \u2014 be warm, conversational, curious.',
              body: 'Don\u2019t over-prepare or over-present. Be yourself. Ask questions. Show genuine interest.',
            },
            {
              title: 'John is new to Intercom (Dec 2025).',
              body: 'He\u2019s building his team. Show you\u2019d be a strong early addition. Empathize with his position.',
            },
            {
              title: 'He liked the Breeze video.',
              body: 'Reference it. Offer to walk him through more. It\u2019s already a warm lead.',
            },
            {
              title: 'Mention "conversation first" design system.',
              body: 'You\u2019ve been working on this exact concept. Directly relevant to Fin.',
            },
            {
              title: 'Dublin location is a massive advantage.',
              body: 'Mention it naturally. No relocation, no visa, immediate availability. Local commitment to the Dublin tech scene.',
            },
            {
              title: 'Ask about role scope.',
              body: 'Staff/Principal IC or Design Director? Show you\u2019re open to both but curious about the distinction.',
            },
            {
              title: 'Reference their "no homework" hiring process positively.',
              body: 'Shows respect for candidates. Signals hiring maturity. Mention it naturally.',
            },
            {
              title: 'Emmet Connolly (SVP Design) came from Google.',
              body: 'Likely values craft at the highest level. Worth noting you\u2019re aware of the design leadership pedigree.',
            },
            {
              title: '"Adaptive but opinionated" is their language.',
              body: 'Use it. This is who you are \u2014 you pushed for brilliant basics when leadership wanted shiny AI features.',
            },
            {
              title: 'They value kindness and generosity.',
              body: 'Your empathy is a strength here. Unlike the "too empathetic" HubSpot lesson, Intercom explicitly values this.',
            },
          ]} />
        </section>

        <SectionDivider />

        {/* ── Shared Walkthroughs ── */}
        <WalkthroughLinks />

        {/* ── Footer ── */}
        <div className="prep-footer">
          Prepared for Eric Greene &middot; Intercom Design Leadership &middot;
          Pre-screening &middot; Feb 2026
        </div>
      </div>
    </div>
  );
}
