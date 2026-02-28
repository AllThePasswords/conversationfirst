import { SectionDivider, MetricRow, PrepNav, Bridge, Highlight } from './PrepShared';
import PrepChat from './PrepChat';

export default function PrepMobile() {
  return (
    <div>
      <PrepNav
        backHref="#/prep"
        backLabel="Back to Prep"
        prevHref="#/prep/breeze"
        prevLabel="Breeze"
        nextHref="#/prep/leadership"
        nextLabel="Leadership"
        count="2 of 3"
      />

      <div className="prep-page prep-fade-in">
        {/* Hero */}
        <div className="prep-hero">
          <div className="prep-hero-kicker">Case Study Walkthrough</div>
          <h1>Scaling HubSpot Mobile</h1>
          <p>
            Repositioning the mobile app from companion tool to primary sales
            work surface. 8x weekly active usage growth.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <span className="prep-tag">HubSpot &middot; Design Manager &rarr; Senior Design Manager</span>
            <span className="prep-tag">Scaled 2 &rarr; 6 designers</span>
            <span className="prep-tag">55-person group &middot; 6 pods</span>
          </div>
        </div>

        <SectionDivider />

        {/* The Opportunity */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            The Opportunity
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            When I joined, the mobile team had two designers and the app
            primarily supported basic CRM viewing. Meanwhile, HubSpot&apos;s
            fastest-growing customers were Pro and Enterprise accounts with large
            sales teams operating in the field. There was a clear gap between how
            the product was designed and how customers actually worked.
          </p>
          <div className="prep-info" style={{ marginTop: 'var(--space-6)' }}>
            <div className="prep-info-label">Why mobile mattered strategically</div>
            <ul>
              <li>
                Sales reps spend most of their day away from desks &mdash; calling,
                emailing, meeting, and logging activity between locations
              </li>
              <li>
                Customers active on both desktop and mobile showed higher
                engagement and higher ARR
              </li>
              <li>
                With calling, email, calendar, and CRM integrated, mobile could
                become a rep&apos;s primary work device
              </li>
            </ul>
          </div>
        </section>

        <SectionDivider />

        {/* Research-Led Vision */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Research-Led Vision
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            The first major initiative I led was a top-tasks research program.
            We surveyed hundreds of mobile customers who identified as sales
            reps, asking what they actually needed. Clear patterns emerged:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            {['Calling', 'Email follow-ups', 'Meeting prep', 'Post-meeting notes'].map(
              (task) => (
                <div
                  key={task}
                  className="prep-highlight"
                  style={{ textAlign: 'center', margin: 0 }}
                >
                  <p style={{ fontWeight: 600, color: 'var(--accent)' }}>{task}</p>
                </div>
              )
            )}
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
            This research became the mobile vision: design mobile first for
            sales reps, then expand deliberately into marketing and service.
          </p>
        </section>

        <SectionDivider />

        {/* STAR Framework */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Deciding What to Ship (and What Not To)
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            To avoid building a smaller, unfocused version of desktop, I
            introduced a decision framework called STAR:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            {[
              {
                letter: 'S',
                word: 'Signal',
                desc: 'Is it highly used on desktop and frequently requested on mobile?',
              },
              {
                letter: 'T',
                word: 'Target',
                desc: 'Who is the primary mobile user: sales, marketing, or service?',
              },
              {
                letter: 'A',
                word: 'Assess',
                desc: 'Does it actually drive usage, retention, or NPS?',
              },
              {
                letter: 'R',
                word: 'Results',
                desc: 'Shared accountability for outcomes, not opinions.',
              },
            ].map((item) => (
              <div key={item.letter} className="prep-info" style={{ margin: 0 }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--accent)' }}>
                  {item.letter}
                </p>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)', marginTop: 'var(--space-1)' }}>
                  {item.word}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <Highlight label="Learning from failure">
            <p>
              We shipped mobile forecasting based on executive intuition rather
              than user signal. It attracted only a few hundred users.
              Reinforced the need to prioritize signal over opinion. The
              framework gave us shared language to learn from it, not blame.
            </p>
          </Highlight>
        </section>

        <SectionDivider />

        {/* Operating at Scale */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Operating at Scale
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            At peak scale, mobile operated across six cross-functional pods with
            ~55 people spanning product, design, and engineering.
          </p>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="prep-info" style={{ margin: 0 }}>
              <div className="prep-info-label">Cadence</div>
              <p>
                Quarterly planning &rarr; Quarterly kick-offs &rarr; 2-week delivery
                sprints. Each quarter began with cross-functional alignment on
                priorities, success metrics, and trade-offs.
              </p>
            </div>
            <div className="prep-info" style={{ margin: 0 }}>
              <div className="prep-info-label">Team Structure</div>
              <p>
                Designers owned workflows, not product areas &mdash; &quot;sales
                communications&quot; and &quot;core CRM,&quot; not &quot;settings
                page.&quot; This mapped to how customers actually worked.
              </p>
            </div>
            <div className="prep-info" style={{ margin: 0 }}>
              <div className="prep-info-label">Customer Signal Infrastructure</div>
              <p>
                Built inbound feedback loops &mdash; mobile NPS, feature-level CSAT,
                requests surfaced via CS and Support &mdash; into a single dashboard.
                One shared source of truth for the whole team.
              </p>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Enforcing Quality */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Enforcing Quality
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            Quality was defined by usage and Voice of the Customer signals, not
            polish alone. The biggest gains came from shipping the
            &quot;brilliant basics&quot; reps consistently asked for:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            {[
              'Call recording',
              'Phone number masking',
              'Meeting preparation',
              'Fast post-meeting note capture',
            ].map((feat) => (
              <div
                key={feat}
                className="prep-info"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 0 }}
              >
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{'\u2191'}</span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                  {feat}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-6)' }}>
            After the first year, I identified an accessibility gap. The mobile
            design system didn&apos;t properly support native platform
            accessibility features. I led a full redesign &mdash; rebuilding
            components to WCAG AA standards and shipping dark mode on mobile
            years before desktop. This set a new internal quality bar.
          </p>
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
                { value: '8x', label: 'Weekly active usage growth' },
                { value: '#1', label: 'NPS in the company' },
                { value: '2\u21926', label: 'Design team scaled' },
                { value: 'AA', label: 'Accessible design system + dark mode' },
              ]}
            />
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-6)' }}>
            Repositioned HubSpot mobile as a primary sales work surface.
            Strengthened multi-surface adoption and proved that mobile wasn&apos;t
            a companion &mdash; it was where reps actually worked.
          </p>
        </section>

        <SectionDivider />

        {/* Honest Reflection */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Honest Reflection
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            Mobile success came from repeatedly choosing the right problems to
            solve, enforcing quality, and protecting focus &mdash; not from shipping
            more. Treating mobile as a first-class product required discipline,
            strong signal, and an operating model that could scale without losing
            coherence.
          </p>
        </section>

        <SectionDivider />

        {/* Bridge */}
        <section className="prep-fade-in">
          <Bridge label="Bridge to Text.com">
            <p>
              Text.com has multiple products (LiveChat, ChatBot, HelpDesk,
              KnowledgeBase) that need coherent design across surfaces. The
              challenge is the same: define quality through customer signal, not
              opinion. Use frameworks to say no. Structure teams around workflows.
              Build feedback infrastructure that the whole org trusts. I&apos;d
              want to build this shared signal layer with Iza&apos;s CX team
              from day one.
            </p>
          </Bridge>
        </section>

        {/* Bottom Navigation */}
        <div className="prep-bottom-nav">
          <a href="#/prep/breeze" className="prep-nav-link">&larr; Prev: Breeze AI</a>
          <a href="#/prep/leadership" className="btn btn-primary">Next: Leadership &rarr;</a>
        </div>

        <PrepChat companyId="mobile" placeholder="Ask about the HubSpot Mobile walkthrough..." />
      </div>
    </div>
  );
}
