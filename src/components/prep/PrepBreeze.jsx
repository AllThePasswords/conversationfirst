import { SectionDivider, MetricRow, PrepNav, Bridge, Highlight } from './PrepShared';
import PrepChat from './PrepChat';

function Decision({ title, chose, over }) {
  return (
    <div className="prep-info">
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)' }}>
        {title}
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
        <span className="prep-badge" style={{ flexShrink: 0, marginTop: '2px', background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
          Chose
        </span>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>{chose}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <span style={{
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          padding: '2px var(--space-2)',
          borderRadius: 'var(--radius-full)',
          background: 'var(--surface)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          marginTop: '2px',
        }}>
          Over
        </span>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>{over}</p>
      </div>
    </div>
  );
}

export default function PrepBreeze() {
  return (
    <div>
      <PrepNav
        backHref="#/prep"
        backLabel="Back to Prep"
        nextHref="#/prep/mobile"
        nextLabel="Mobile"
        count="1 of 3"
      />

      <div className="prep-page prep-fade-in">
        {/* Hero */}
        <div className="prep-hero">
          <div className="prep-hero-kicker">Case Study Walkthrough</div>
          <h1>Breeze AI Standalone App</h1>
          <p>
            Designing and shipping an AI-first sales assistant from zero to
            production in 90 days.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <span className="prep-tag">HubSpot &middot; Senior Design Manager</span>
            <span className="prep-tag">2 designers (player-coach)</span>
            <span className="prep-tag">90-day deadline &rarr; INBOUND launch</span>
          </div>
        </div>

        <SectionDivider />

        {/* The Problem */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            The Problem
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            When I inherited Breeze Assistant, usage was just{' '}
            <strong style={{ color: 'var(--text)' }}>1.9% of all HubSpot users</strong>.
            It had been launched in a rush to get into the AI game &mdash; lots of
            shiny features, but none solving real problems. Sales reps were
            literally using ChatGPT instead because it had a mobile app. Meeting
            preparation was still manual and fragmented &mdash; reps stitching together
            CRM records, notes, emails, and call history before every call. AI
            had been bolted onto legacy workflows. Adoption was low, trust was
            inconsistent, and AI added work instead of replacing it.
          </p>
          <Highlight label="The strategic shift: &quot;Brilliant basics&quot; &rarr; Core capabilities">
            <p>
              Rather than chasing more AI features, I reframed the challenge as
              getting core capabilities right first. The term internally was
              &quot;brilliant basics&quot; &mdash; nail the fundamentals before adding
              complexity. If AI remained a feature bolted onto legacy workflows,
              HubSpot would fall behind competitors building AI-native tools.
            </p>
          </Highlight>
        </section>

        <SectionDivider />

        {/* Our Hypothesis */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Our Hypothesis
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            With the core context team (a cross-functional squad focused on the
            AI foundation), we bet that meaningful AI adoption required three
            things:
          </p>
          <div style={{ marginTop: 'var(--space-6)' }}>
            {[
              { num: '1', text: 'A deliberate break from legacy UI and navigation' },
              { num: '2', text: 'A shift from feature navigation to intent expression' },
              { num: '3', text: 'A product surface where AI orchestrates systems, not just answers questions' },
            ].map((item) => (
              <div key={item.num} className="prep-step">
                <span className="prep-step-marker">{item.num}</span>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', margin: 0, paddingTop: '4px' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Key Design Decisions */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Key Design Decisions
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
            Each decision had a clear trade-off. The panel will dig into these.
          </p>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Decision
              title="1. Product Surface"
              chose="Standalone app &mdash; clean AI-first interaction model, escape legacy constraints"
              over="Embedded UI within existing HubSpot &mdash; safer, but trapped in legacy navigation"
            />
            <Decision
              title="2. Interaction Model"
              chose="Intent-led workflows &mdash; user expresses what they need, AI orchestrates"
              over="Chat-first &mdash; generic conversation that doesn&apos;t map to specific tasks"
            />
            <Decision
              title="3. Configuration"
              chose="Opinionated defaults &mdash; fast execution, strong default decisions"
              over="Flexibility &mdash; enterprise configuration that slows everyone down"
            />
            <Decision
              title="4. Design Process"
              chose="Design and engineering as one system &mdash; iterate in production code and LLM instruction files"
              over="Traditional handoffs &mdash; Figma &rarr; spec &rarr; build &rarr; review cycles"
            />
          </div>
        </section>

        <SectionDivider />

        {/* Core Workflow */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            The Core Workflow: Meetings as the Wedge
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            We anchored execution in a single high-frequency, high-friction
            workflow: managing meetings before, during, and after. Over 300,000
            HubSpot users use the mobile app weekly, primarily for meeting prep.
          </p>
          <div className="prep-info" style={{ marginTop: 'var(--space-6)' }}>
            <div className="prep-info-label" style={{ color: 'var(--accent)' }}>
              When a rep selects a meeting, the system:
            </div>
            <div style={{ marginTop: 'var(--space-3)' }}>
              {[
                'Inspects CRM records for the contact and company',
                'Pulls recent company updates and relevant external context',
                'Retrieves prior notes and open action items',
                'Synthesizes everything into a task-specific interface',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>{'\u26A1'}</span>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
            Additional features: OCR scanner for business cards &rarr; contacts,
            long-form voice dictation for post-meeting notes, dark mode, and a
            fully AA-accessible design system built for AI workflows.
          </p>
        </section>

        <SectionDivider />

        {/* How We Worked */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            How We Worked
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            This project removed traditional handoffs. I managed and coached the
            design team while working directly with engineers in production code
            and LLM instruction files. AI behavior, interaction design, and UI
            evolved together as one system. We created a lightweight,
            AA-accessible design system purpose-built for AI-driven workflows.
            Design decisions were validated in production, not in review decks.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <div className="prep-info">
              <div className="prep-info-label">Constraints</div>
              <ul>
                <li>Fixed 90-day deadline (INBOUND)</li>
                <li>No net-new headcount</li>
                <li>Production iOS + Android from day one</li>
                <li>High executive visibility</li>
              </ul>
            </div>
            <div className="prep-info">
              <div className="prep-info-label">What Changed</div>
              <ul>
                <li>Designers worked in LLM instruction files</li>
                <li>No Figma &rarr; spec &rarr; build handoffs</li>
                <li>AI behavior iterated directly in code</li>
                <li>Purpose-built design system for AI flows</li>
              </ul>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Outcomes */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Outcomes
          </h2>
          <div style={{ marginTop: 'var(--space-6)' }}>
            <MetricRow
              metrics={[
                { value: '1.9%', label: 'Usage when inherited' },
                { value: '44%', label: 'Week 2 retention' },
                { value: '90 days', label: 'Vision to production' },
                { value: '$1B', label: 'Sales Hub ARR (context)' },
              ]}
            />
          </div>
          <div style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              Contributed to a{' '}
              <strong style={{ color: 'var(--text)' }}>+10 point NPS improvement</strong>{' '}
              for Sales Hub overall. Established shared AI interaction principles
              adopted across teams. Created a reference model for AI-first
              workflow design. Demonstrated a faster, smaller-team delivery model
              under executive scrutiny.
            </p>
            <p style={{ marginTop: 'var(--space-3)', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Shifted internal thinking from &quot;where do we add AI?&quot; to
              &quot;what work should AI own?&quot;
            </p>
          </div>
        </section>

        <SectionDivider />

        {/* Honest Reflection */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Honest Reflection
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            Speed didn&apos;t remove complexity. As a standalone AI product,
            Breeze attracted more stakeholders than team members at times. With
            hindsight, I would have been more aggressive in shielding the team
            from organizational overhead and clarified ownership of AI behavior
            earlier. Ambiguity there slowed progress more than technical
            constraints.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginTop: 'var(--space-4)' }}>
            Core lesson: In AI-assisted product development, design leadership
            is about judgment, constraints, and focus &mdash; not artifact production.
          </p>
        </section>

        <SectionDivider />

        {/* Bridge */}
        <section className="prep-fade-in">
          <Bridge label="Bridge to Text.com">
            <p>
              Text.com&apos;s AI agents are exactly this pattern &mdash; intent
              recognition &rarr; orchestrated response &rarr; confidence-appropriate
              output. I&apos;ve shipped this transition from legacy product to
              AI-first at scale. The design challenges are the same: defining
              when AI should be assertive vs. hedging, designing seamless human
              handoff, and making AI behavior observable for business customers.
            </p>
          </Bridge>
        </section>

        {/* Bottom Navigation */}
        <div className="prep-bottom-nav">
          <a href="#/prep" className="prep-nav-link">&larr; Back to Prep</a>
          <a href="#/prep/mobile" className="btn btn-primary">Next: HubSpot Mobile &rarr;</a>
        </div>

        <PrepChat companyId="breeze" placeholder="Ask about the Breeze AI walkthrough..." />
      </div>
    </div>
  );
}
