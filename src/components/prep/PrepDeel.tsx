import { SectionDivider, Accordion, MetricRow, PrepNav, Bridge, InfoBox, Highlight, TipList, WalkthroughLinks } from './PrepShared';
import PrepChat from './PrepChat';

const STAR_EXAMPLES = [
  {
    label: 'Short Deadline + Grit',
    situation:
      'HubSpot needed an AI-first standalone app for INBOUND conference. 90-day deadline, no new headcount.',
    task: 'Lead design vision and execution with 2 designers while managing team of 6.',
    action:
      'Removed all traditional handoffs. Worked directly in production code and LLM instruction files. Created purpose-built AI design system. Shielded team from stakeholder overhead.',
    result:
      'Shipped iOS + Android in 90 days. 44% week-2 retention. Contributed to +10 NPS for Sales Hub. Established AI interaction principles adopted across HubSpot.',
    deelValue: 'Deel Speed + Grit & Tenacity',
  },
  {
    label: 'Hard People Decision + Retrospective',
    situation:
      "Inherited designers at HubSpot who weren't meeting the bar. Was too empathetic for too long.",
    task: 'Improve team quality while maintaining output and morale.',
    action:
      "Made hard calls \u2014 managed 3 exits through PIPs and restructuring. Built Monday/Wednesday performance system that created automatic paper trail. Raised hiring bar.",
    result:
      'Team became healthier, standards clearer. One PIP designer is now senior at WorkTech AI \u2014 process works when bar is clear. Freed up 30%+ of my time for creative leadership.',
    deelValue: 'Trust & Accountability',
  },
  {
    label: 'Customer-Led Strategy',
    situation:
      'Breeze Assistant had only 1.9% usage across all HubSpot users when I inherited it.',
    task: 'Turn AI from a bolted-on feature into a core workflow.',
    action:
      'Reframed as "brilliant basics" \u2014 core capabilities first, not more features. Anchored on meeting prep (highest-frequency workflow). Built intent-led interaction model vs chat-first.',
    result:
      'Shifted org thinking from "where do we add AI?" to "what work should AI own?" Within $1B Sales Hub business.',
    deelValue: 'Customer-Centric + Bias Toward Action',
  },
  {
    label: 'Learning + Staying Current',
    situation:
      'AI code generation is transforming how products are built.',
    task: 'Stay ahead of the curve and apply learnings immediately.',
    action:
      'Built Central Valuations AI-first with Claude Code \u2014 entire platform without engineering support. Used n8n for automated workflows. Designed in code, not Figma. Use LLMs as design tools.',
    result:
      'Proved a single designer can build and ship production software. Validated new design engineering model. Currently exploring this as full-time venture.',
    deelValue: 'Ownership & Vertical Integration',
  },
];

const DEEL_VALUES = [
  {
    value: 'Deel Speed',
    motto: 'Move fast and build to last',
    yourExample:
      'Breeze AI shipped in 90 days from vision to production. Removed traditional handoffs, worked directly in code and LLM instruction files.',
    metric: '90 days, 44% W2 retention',
  },
  {
    value: 'Ownership & Accountability',
    motto: 'Unless we own every inch of the chain',
    yourExample:
      'Central Valuations \u2014 built and own the entire product. When engineering partner left, took over the whole system. Still running exactly as designed 2 years later.',
    metric: '2+ years, zero redesigns needed',
  },
  {
    value: 'Bias Toward Action',
    motto: 'Leaders pause meetings to call customers',
    yourExample:
      'Best hire was an intern from customer support who knew every customer and every support case. Fought to keep her when she was supposed to rotate. Lesson: get to the customer, not the Figma file.',
    metric: 'Hired from CS into design team',
  },
  {
    value: 'Grit & Tenacity',
    motto: 'Push through, short deadlines, retrospectives',
    yourExample:
      "Managed team through HubSpot reorg \u2014 25% of group affected. Exited 3 designers who weren't meeting the bar while simultaneously shipping Breeze.",
    metric: '3 exits + shipping simultaneously',
  },
  {
    value: 'Customer-Centric',
    motto: 'Top-down customer obsession',
    yourExample:
      'Led user research for mobile app \u2014 300K+ weekly active users. Top tasks research drove the entire product strategy. Used customer insights to justify "brilliant basics" over feature proliferation.',
    metric: '300K+ WAU, top-tasks driven',
  },
  {
    value: 'Trust & Accountability',
    motto: 'Trust until proven otherwise, tight KPIs',
    yourExample:
      'Monday targets standup \u2014 "What are you going after this week?" builds accountability record automatically. Five different targets in two months = signal. Consistent target, shipping toward it = solid.',
    metric: 'Automatic paper trail system',
  },
  {
    value: 'Vertical Integration',
    motto: 'Own the whole chain',
    yourExample:
      'Breeze AI \u2014 designers worked in LLM instruction files, not just Figma. AI behavior, interaction design, and UI evolved together as one system. No handoffs. Purpose-built design system for AI workflows.',
    metric: 'Design-to-production, zero handoffs',
  },
];

const INTERVIEW_STRUCTURE = [
  {
    num: '1',
    topic: 'Design knowledge, inspiration, resources',
    tip: 'Reference Shape Up, Multipliers \u2014 books Avi recommends',
  },
  {
    num: '2',
    topic: 'Scenario simulations',
    tip: '"What would you do if..." \u2014 think on your feet',
  },
  {
    num: '3',
    topic: 'Role and team information',
    tip: "Ask smart questions about his 45-person org",
  },
  {
    num: '4',
    topic: 'Examples of challenges with clear metrics',
    tip: 'STAR format with data \u2014 this is the core',
  },
  {
    num: '5',
    topic: 'Short deadlines and how you handled them',
    tip: 'Breeze 90-day story \u2014 your strongest example',
  },
  {
    num: '6',
    topic: 'Retrospectives and learning from mistakes',
    tip: 'PIP timing, forecasting failure, VP pushback',
  },
  {
    num: '7',
    topic: 'Tenacity and grit \u2014 pushing through adversity',
    tip: 'Reorg + shipping simultaneously, hard people calls',
  },
];

const AVI_LOOKS_FOR = [
  {
    label: 'Prioritization instinct',
    detail: '"Is there something more useful I should do now?"',
  },
  {
    label: 'Ruthless triage',
    detail: 'Can you categorize work into his 6 buckets?',
  },
  {
    label: 'Low + High design',
    detail: 'Balance immediate fixes with visionary thinking',
  },
  {
    label: 'IC craft alongside leadership',
    detail: 'He does IC work himself \u2014 show you do too',
  },
  {
    label: 'Written communication',
    detail: 'Precise, structured. Remote-first demands it.',
  },
  {
    label: 'Autonomous, communicative, curious',
    detail: 'His three hiring criteria',
  },
];

const QUICK_REF = [
  {
    ask: 'Short deadlines',
    lead: 'Breeze 90-day INBOUND ship',
    number: '90 days, 44% W2 retention',
  },
  {
    ask: 'Grit / tenacity',
    lead: 'Reorg + 3 exits while shipping Breeze',
    number: '25% of group affected',
  },
  {
    ask: 'Customer obsession',
    lead: 'Breeze 1.9% usage to core workflow',
    number: '1.9% starting point',
  },
  {
    ask: 'Metrics / results',
    lead: 'Breeze retention + NPS + mobile WAU',
    number: '44%, +10 NPS, 8x WAU',
  },
  {
    ask: 'Retrospectives / mistakes',
    lead: 'PIP timing \u2014 was too empathetic too long',
    number: '30%+ time freed',
  },
  {
    ask: 'Design inspiration',
    lead: 'Shape Up, building in code, LLMs as design tools',
    number: 'Full-stack with Claude Code',
  },
  {
    ask: 'Team / people',
    lead: 'Monday/Wednesday system, hiring bar',
    number: '12 hired, 3 exited',
  },
  {
    ask: 'Why Deel?',
    lead: 'OS for global work, design reports to CEO',
    number: '90 designers, 30 countries',
  },
];

const TIPS = [
  {
    title: 'You have 30 MINUTES. Be concise.',
    body: "Use STAR tightly \u2014 don't ramble. Each example under 2 minutes. Leave time for questions.",
  },
  {
    title: 'Lead with metrics.',
    body: '90 days, 44% retention, 1.9% to transformation, 12 hired / 3 exited. Numbers first, story second.',
  },
  {
    title: 'Use their language \u2014 "Deel Speed."',
    body: "Your 90-day Breeze ship IS Deel Speed. Say it: \"That's what I'd call Deel Speed \u2014 we shipped in 90 days.\"",
  },
  {
    title: 'Reference Shape Up if it comes up.',
    body: 'You know the book. Shaped work, appetite-based cycles, no backlogs. Connects to how you think about prioritization.',
  },
  {
    title: 'Show craft AND leadership.',
    body: 'Avi does both. You do both. LLM instruction files, production code, Claude Code builds \u2014 this is hands-on craft for the AI era.',
  },
  {
    title: 'Written communication matters.',
    body: 'Be precise and structured in your answers. This is a remote-first interview \u2014 the way you communicate IS the signal.',
  },
  {
    title: "Don't over-apologize about Staff IC feedback.",
    body: 'Own it. Redirect to Lead strengths. "My strength is leading teams to great outcomes."',
  },
  {
    title: 'Avi categorizes work into 6 buckets.',
    body: 'Demonstrate you think about prioritization similarly. "Is there something more useful I should do now?" is his mantra.',
  },
  {
    title: 'Tenacity and grit \u2014 the video emphasis.',
    body: 'The Deel interview prep video specifically calls out tenacity, grit, pushing through, metrics, retrospectives. Hit all five.',
  },
  {
    title: 'Ask a smart closing question.',
    body: 'Try: "How do you balance low design and high design across 45 designers?" or "What does great look like for a Lead in their first 90 days here?"',
  },
];

function StarCard({ example }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {example.deelValue && (
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>
          Maps to: {example.deelValue}
        </p>
      )}
      <div className="prep-star-grid">
        <span className="prep-star-label">S</span>
        <span className="prep-star-value">{example.situation}</span>
        <span className="prep-star-label">T</span>
        <span className="prep-star-value">{example.task}</span>
        <span className="prep-star-label">A</span>
        <span className="prep-star-value">{example.action}</span>
        <span className="prep-star-label">R</span>
        <span className="prep-star-value">{example.result}</span>
      </div>
    </div>
  );
}

export default function PrepDeel() {
  return (
    <div className="accent-emerald">
      <PrepNav
        backHref="#/prep"
        backLabel="Back to Prep"
        count="30 min only \u2014 every second counts"
      />
      <div className="prep-page prep-fade-in">
        {/* Hero */}
        <div className="prep-hero">
          <div className="prep-hero-kicker">Round 4 &mdash; Cultural Assessment</div>
          <h1>Deel &mdash; Lead Product Designer</h1>
          <p>
            30-minute cultural assessment with Avi Ashkenazi. Focus: tenacity,
            grit, metrics, STAR method.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <span className="prep-tag">Deel &middot; Lead Product Designer</span>
            <span className="prep-tag">Round 4 &middot; Cultural Fit</span>
            <span className="prep-badge">30 min only</span>
          </div>
        </div>

        <SectionDivider />

        {/* Interviewer Context */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Know Your Interviewer
          </h2>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Highlight label="Interviewer">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    Avi Ashkenazi
                  </p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
                    Sr Director of Product Design &middot; Since June 2025
                  </p>
                </div>
                <span className="prep-badge">Reports to CEO</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <InfoBox label="Background">
                  <p>
                    Previously Samsung, Shopify. Leads ~45 of 90 designers across
                    30 countries.
                  </p>
                </InfoBox>
                <InfoBox label="Design Philosophy">
                  <p>
                    &quot;Low design&quot; (2-month problems) vs &quot;High
                    design&quot; (future vision). Maintains hands-on IC
                    contributions as a leader.
                  </p>
                </InfoBox>
                <InfoBox label="Work Categorization">
                  <p>
                    Urgent / Support / Lead / Self-serve / Overlook / Wrong to do
                  </p>
                </InfoBox>
                <InfoBox label="Recommends">
                  <p>
                    &quot;Shape Up&quot; (Ryan Singer), &quot;Multipliers&quot;
                    (Liz Wiseman). Podcast appearances on taste, craft, AI.
                  </p>
                </InfoBox>
              </div>
            </Highlight>
          </div>

          <div style={{ marginTop: 'var(--space-3)' }}>
            <Highlight label="What Avi Will Look For">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-2)' }}>
                {AVI_LOOKS_FOR.map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ flexShrink: 0, color: 'var(--accent)', marginTop: 2 }}>&rarr;</span>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {item.label}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {' '}&mdash; {item.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Highlight>
          </div>

          <InfoBox label="Design tasks in hiring">
            <p>
              Avi supports design tasks in hiring to reveal actual contribution
              vs portfolio storytelling. Be ready: your work should speak for
              itself, not your narrative of it.
            </p>
          </InfoBox>
        </section>

        <SectionDivider />

        {/* Interview Structure */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Interview Structure
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            From the recruiter email and Deel&apos;s interview prep video.
            Expect these topics in 30 minutes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            {INTERVIEW_STRUCTURE.map((item) => (
              <div key={item.num} className="prep-step">
                <span className="prep-step-marker">{item.num}</span>
                <div>
                  <div className="prep-step-title">{item.topic}</div>
                  <div className="prep-step-body">{item.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Deel Values */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Deel Values &mdash; Mapped to Your Experience
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Each value has a STAR-ready example. Use their language naturally.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            {DEEL_VALUES.map((v) => (
              <Accordion
                key={v.value}
                question={`${v.value} \u2014 "${v.motto}"`}
              >
                <p>{v.yourExample}</p>
                <Highlight label={`Key metric: ${v.metric}`}>
                  <p style={{ display: 'none' }}>{/* metric shown in label */}</p>
                </Highlight>
              </Accordion>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* STAR Examples */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Prepared STAR Examples
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Four tight examples ready to deliver. Keep each under 2 minutes.
            Lead with the result, then unpack if they ask.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            {STAR_EXAMPLES.map((ex) => (
              <Accordion key={ex.label} question={ex.label}>
                <StarCard example={ex} />
              </Accordion>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Key Metrics */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Your Numbers
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Drop these early. They anchor credibility fast in 30 minutes.
          </p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <MetricRow metrics={[
              { value: '90 days', label: 'Vision to Production', sub: 'Breeze iOS + Android for INBOUND' },
              { value: '44%', label: 'Week 2 Retention', sub: 'Breeze AI standalone app' },
              { value: '1.9%', label: 'Starting AI Usage', sub: 'Transformed into core workflow' },
              { value: '12 hired', label: '3 Exited', sub: 'Built and held the bar' },
              { value: '+10 NPS', label: 'Sales Hub Impact', sub: 'Cross-platform mobile contribution' },
              { value: '2+ years', label: 'Central Valuations Running', sub: 'Zero redesigns needed' },
            ]} />
          </div>
        </section>

        <SectionDivider />

        {/* Avi's Philosophy */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Avi&apos;s Design Philosophy &mdash; Mirror It
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Based on podcast appearances and public talks. Weave these naturally
            into your answers.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <InfoBox label="Low Design vs High Design">
              <p>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Low design:</span>{' '}
                Solve the 2-month problem. Ship it.
              </p>
              <p style={{ marginTop: 'var(--space-1)' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>High design:</span>{' '}
                Future vision. Where is the product going?
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                Your parallel: Breeze (low = 90-day ship) + intent-led AI model
                (high = future of sales tools)
              </p>
            </InfoBox>
            <InfoBox label="Work Categorization (6 buckets)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
                {['Urgent', 'Support', 'Lead', 'Self-serve', 'Overlook', 'Wrong to do'].map((bucket) => (
                  <span key={bucket} className="prep-tag">{bucket}</span>
                ))}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Show you think about prioritization this way &mdash; demonstrate
                ruthless triage instinct
              </p>
            </InfoBox>
            <InfoBox label="Hands-On Leadership">
              <p>
                Avi still does IC design work as Sr Director. He values leaders
                who contribute, not just direct.
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                Your parallel: LLM instruction files, production code, Claude
                Code builds, prototyping in code
              </p>
            </InfoBox>
            <InfoBox label="Written Communication">
              <p>
                Fully remote, 30 countries. Written clarity matters enormously.
                Be precise and structured in every answer.
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                Your parallel: STAR method itself demonstrates structured
                thinking. Monday standup commitments in writing.
              </p>
            </InfoBox>
          </div>
        </section>

        <SectionDivider />

        {/* Level Feedback */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Address the IC Craft Feedback
          </h2>
          <Highlight label="Their feedback">
            <p>
              &quot;Strong problem-solving, systems thinking, communication.
              Leadership presence and alignment stood out. IC craft wasn&apos;t
              consistently at Staff level.&quot;
            </p>
          </Highlight>
          <Bridge label="Your response strategy">
            <p>
              Don&apos;t be defensive. Say: &quot;I agree &mdash; my strength is
              leading teams to great outcomes, not winning visual design awards.
              For a Lead role, that&apos;s exactly the right balance. I raise the
              bar for others and lead by example on strategy, systems thinking,
              and customer connection.&quot;
            </p>
          </Bridge>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <span style={{ flexShrink: 0, color: 'var(--accent)', marginTop: 2 }}>&rarr;</span>
              <span>
                Don&apos;t over-apologize. Own it, redirect to Lead strengths.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <span style={{ flexShrink: 0, color: 'var(--accent)', marginTop: 2 }}>&rarr;</span>
              <span>
                Demonstrate hands-on craft through: LLM instruction files,
                production code work, Claude Code builds, AI design system
                creation.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <span style={{ flexShrink: 0, color: 'var(--accent)', marginTop: 2 }}>&rarr;</span>
              <span>
                Avi values craft AND leadership &mdash; the Lead role is about both.
                Show you do both.
              </span>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Bridge to Deel */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Bridge to Deel
          </h2>
          <Bridge label="Close with this">
            <p>
              &quot;Deel is building the OS for global work &mdash; 150 countries,
              $17.3B valuation, preparing for IPO. The design team is 90 people
              from 30 countries, reporting directly to the CEO. That&apos;s rare
              and shows design has a strategic seat. I&apos;d bring my
              outcomes-based system, my hiring bar, and my &apos;brilliant
              basics&apos; approach to quality at scale.&quot;
            </p>
          </Bridge>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <MetricRow metrics={[
              { value: '150', label: 'Countries' },
              { value: '$17.3B', label: 'Valuation' },
              { value: '90', label: 'Designers, 30 countries' },
            ]} />
          </div>
        </section>

        <SectionDivider />

        {/* Delivery Tips */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Delivery Tips &mdash; 30 Minutes
          </h2>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <TipList tips={TIPS} />
          </div>
        </section>

        <SectionDivider />

        {/* Quick Reference Table */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Quick Reference &mdash; What to Say When
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
            Fast lookup for common interview moments.
          </p>
          <table className="prep-table">
            <thead>
              <tr>
                <th>They Ask About...</th>
                <th>Lead With</th>
                <th>Key Number</th>
              </tr>
            </thead>
            <tbody>
              {QUICK_REF.map((row) => (
                <tr key={row.ask}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{row.ask}</td>
                  <td>{row.lead}</td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--accent)' }}>{row.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <SectionDivider />
        <WalkthroughLinks />

        {/* Footer */}
        <div className="prep-footer">
          Prepared for Eric Greene &middot; Deel Lead Product Designer &middot;
          Round 4 Cultural Assessment &middot; 30 min
        </div>

        <PrepChat companyId="deel" placeholder="Ask about Deel, your talking points, or practice an answer..." />
      </div>
    </div>
  );
}
