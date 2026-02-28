import { SectionDivider, MetricRow, PrepNav, Bridge, Highlight } from './PrepShared';
import PrepChat from './PrepChat';

export default function PrepLeadership() {
  return (
    <div>
      <PrepNav
        backHref="#/prep"
        backLabel="Back to Prep"
        prevHref="#/prep/mobile"
        prevLabel="Mobile"
        count="3 of 3"
      />

      <div className="prep-page prep-fade-in">
        {/* Hero */}
        <div className="prep-hero">
          <div className="prep-hero-kicker">Case Study Walkthrough</div>
          <h1>Design Leadership at Scale</h1>
          <p>
            Hiring, holding the bar, and building teams that compound. Lessons
            from managing interns to principals at HubSpot.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <span className="prep-tag">HubSpot &middot; Senior Design Manager</span>
            <span className="prep-tag">Hired 12 designers &middot; Exited 3</span>
            <span className="prep-tag">Led through reorgs, PIPs, rapid scaling</span>
          </div>
        </div>

        <SectionDivider />

        {/* Hiring */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Hiring: The Most Impactful Thing a Leader Does
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            The clearest lesson: the most impactful thing a design leader can do
            is hire well. Strong designers consistently demonstrate taste,
            judgment, and the ability to operate autonomously within ambiguity.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <div className="prep-info" style={{ margin: 0 }}>
              <div className="prep-info-label">What I hire for</div>
              <ul>
                <li>Product judgment over craft specialization</li>
                <li>Autonomy &mdash; can they operate without constant direction?</li>
                <li>Comfort working directly with eng and PM</li>
                <li>Taste and clarity in decision-making</li>
              </ul>
            </div>
            <div className="prep-info" style={{ margin: 0 }}>
              <div className="prep-info-label">The trust multiplier</div>
              <p>
                When a designer consistently demonstrates strong taste, their
                cross-functional partners begin to trust them as the
                tastemaker. Less time debating direction, more energy flowing
                toward building. The designer earns authority through work, not
                hierarchy.
              </p>
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginTop: 'var(--space-4)' }}>
            Every strong hire compounded &mdash; they attracted better candidates,
            elevated critique sessions, and set implicit standards that pulled
            the whole team forward.
          </p>
        </section>

        <SectionDivider />

        {/* Performance System */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            My Performance System
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            I don&apos;t believe in long performance review seasons. My system is
            simple and runs every week:
          </p>
          <div style={{ marginTop: 'var(--space-6)' }}>
            <div className="prep-step">
              <span className="prep-step-marker">Mon</span>
              <div>
                <div className="prep-step-title">
                  15-min standup &mdash; &quot;What targets are you going after?&quot;
                </div>
                <div className="prep-step-body">
                  Everyone speaks for a minute. &quot;What are you going after
                  this week?&quot; builds the record automatically. Not a status
                  update &mdash; a commitment. If someone has five different targets in
                  two months, that&apos;s a signal. Consistent target, shipping
                  toward it = solid.
                </div>
              </div>
            </div>
            <div className="prep-step">
              <span className="prep-step-marker">Wed</span>
              <div>
                <div className="prep-step-title">Group design critique</div>
                <div className="prep-step-body">
                  Live feedback, recorded. Quality coaching happens in the room,
                  not in separate 1:1s. I prefer group critique over static
                  recurring 1:1s &mdash; keeps calendar free for ad-hoc, live
                  discussion where and when it matters.
                </div>
              </div>
            </div>
            <div className="prep-step">
              <span className="prep-step-marker" style={{ fontSize: 'var(--text-xs)' }}>Rev</span>
              <div>
                <div className="prep-step-title">Performance = outcomes, not outputs</div>
                <div className="prep-step-body">
                  A performance review should be a couple of sentences: &quot;We
                  had this problem for this customer, here&apos;s the
                  impact.&quot; A link to an Amplitude chart, not a 10-page
                  document.
                </div>
              </div>
            </div>
          </div>
          <Highlight label="Why this works">
            <p>
              Strong performers manage themselves &mdash; they know their targets
              every day. The Monday record also builds the paper trail needed if
              performance issues arise. Five different targets in two months =
              signal. Consistent target, shipping toward it = solid.
            </p>
          </Highlight>
        </section>

        <SectionDivider />

        {/* Making Hard Calls */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Making Hard Calls
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            Of{' '}
            <strong style={{ color: 'var(--text)' }}>12 designers hired, I exited 3</strong>.
            I managed multiple performance improvement plans and exits. In
            every case, the team became healthier, standards became clearer, and
            output improved. The hardest lesson: investing heavily in coaching
            someone toward a bar they aren&apos;t reaching delays decisions that
            benefit the whole team.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <div className="prep-info" style={{ margin: 0 }}>
              <div className="prep-info-label">What I&apos;ve learned</div>
              <ul>
                <li>
                  Skills can be developed. Taste and judgment tend to be
                  established before senior level.
                </li>
                <li>
                  The longest performance write-ups belonged to the weakest
                  performers.
                </li>
                <li>
                  Avoiding hard conversations costs more &mdash; in time, morale, and
                  focus.
                </li>
                <li>
                  The best empathy is clarity at the start. No ambiguity.
                </li>
              </ul>
            </div>
            <div className="prep-info" style={{ margin: 0 }}>
              <div className="prep-info-label">The mid-performer gap</div>
              <p>
                During a senior designer&apos;s extended leave while recruiting,
                strong performers took ownership and moved fast. Mid-level
                performers became net detractors &mdash; requiring attention rather
                than acting as catalysts. Team composition matters more than team
                size.
              </p>
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
            One designer who went through PIP with me is now a senior at a
            WorkTech AI company. She told me her new team loves how
            metrics-focused she is. The process works when the standard is clear.
          </p>
        </section>

        <SectionDivider />

        {/* Leading Through Organizational Change */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Leading Through Organizational Change
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            HubSpot underwent significant reorganization &mdash; the reorg affected
            ~25% of the group, including a designer on my team. Leading through
            this required balancing transparency, empathy, and forward momentum.
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            Designers who consistently delivered impact were easy to advocate
            for during the process. This reinforced that the outcomes-based
            system protects people when things get hard.
          </p>
        </section>

        <SectionDivider />

        {/* Honest Reflection */}
        <section className="prep-fade-in">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)' }}>
            Honest Reflection
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 'var(--space-4)' }}>
            I wouldn&apos;t listen so much to the VPs. I should have pushed back
            earlier on organizational decisions that impacted our delivery &mdash;
            like an arbitrary cut of the Mac app launch, or spinning up a team
            in India when timezone misalignment would hurt execution. You
            don&apos;t need to look at the title and agree. You can think about
            it and say honestly what you feel. I would have delivered more for
            customers if I&apos;d stood up in those conversations earlier.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginTop: 'var(--space-4)' }}>
            Going forward: hire more slowly, decide faster. Optimize for
            autonomy, judgment, and taste rather than potential alone. Let
            outcomes drive growth conversations. The bar is the strategy.
          </p>
        </section>

        <SectionDivider />

        {/* Bridge */}
        <section className="prep-fade-in">
          <Bridge label="Bridge to Text.com">
            <p>
              Text.com has 23 product designers across independent teams
              (Spotify-style experience stripes). The VP of Design role is about
              setting direction, raising the bar, and organizing design workflow
              &mdash; not running delivery. That&apos;s exactly the separation I&apos;ve
              operated in: craft quality and standards with me, execution
              autonomy with the teams. I&apos;d bring this outcomes-based system
              from day one.
            </p>
          </Bridge>
        </section>

        {/* Bottom Navigation */}
        <div className="prep-bottom-nav">
          <a href="#/prep/mobile" className="prep-nav-link">&larr; Prev: HubSpot Mobile</a>
          <a href="#/prep" className="btn btn-primary">Back to Q&amp;A Prep &rarr;</a>
        </div>

        <PrepChat companyId="leadership" placeholder="Ask about the Design Leadership walkthrough..." />
      </div>
    </div>
  );
}
