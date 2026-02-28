export default function PrepLanding() {
  const companies = [
    {
      name: 'Text.com',
      role: 'VP of Design',
      href: '#/prep/textcom',
      date: 'Feb 13, 2026',
      time: '1.5 hours',
      stage: 'Final Round',
      accent: 'accent-rose',
      interviewers: 'Filip Jask\u00F3lski (CPO), Iza Gurgul (VP CX), Joanna R\u0119kosiewicz',
      desc: 'Polish SaaS company, ~$89M ARR, 28K+ customers. Products: LiveChat, ChatBot, HelpDesk, KnowledgeBase. AI-first pivot. 23 product designers across independent teams.',
    },
    {
      name: 'n8n',
      role: 'Head of Design',
      href: '#/prep/n8n',
      date: 'Feb 13\u201314, 2026',
      time: 'Screening call',
      stage: 'Round 2',
      accent: 'accent-violet',
      interviewers: 'David (VP Product), Recruiter',
      desc: 'AI workflow automation, $2.5B valuation, $40M+ ARR, 723 employees. Series C ($180M) from Accel + NVIDIA. Design team of ~5\u20136 ICs + 1 lead, doubling this year. Berlin HQ.',
    },
    {
      name: 'Deel',
      role: 'Lead Product Designer',
      href: '#/prep/deel',
      date: 'Feb 13, 2026',
      time: '30 min',
      stage: 'Round 4',
      accent: 'accent-emerald',
      interviewers: 'Avi Ashkenazi (Sr Director, Design)',
      desc: 'Global HR platform, $17.3B valuation, $1B+ ARR, ~5K employees. 90 designers from 30 countries. Design reports to CEO. Preparing for IPO 2026.',
    },
    {
      name: 'Intercom',
      role: 'Design Leadership',
      href: '#/prep/intercom',
      date: 'Feb 2026',
      time: 'Pre-screening',
      stage: 'Pre-screening',
      accent: 'accent-blue',
      interviewers: 'John Moriarty (Product Design Director)',
      desc: 'AI customer service, $1.3B valuation, $343M revenue, ~1,847 employees. Fin.ai resolves 65% of queries. 60+ designers. Dublin HQ. Staff/Principal or Design Director role.',
    },
  ];

  return (
    <div className="prep-page prep-fade-in">
      <div className="prep-hero">
        <h1>Interview Prep</h1>
        <p>Four active interviews. All prep, values, transcript alignment, and walkthrough content in one place.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {companies.map((c) => (
          <a key={c.name} href={c.href} className={`prep-card ${c.accent}`}>
            <div className="prep-card-header">
              <div>
                <div className="prep-card-title">{c.name}</div>
                <div className="prep-card-role">{c.role}</div>
              </div>
              <span className="prep-badge">{c.stage}</span>
            </div>
            <div className="prep-card-meta">
              <span>{c.date}</span>
              <span>{c.time}</span>
              <span>{c.interviewers}</span>
            </div>
            <div className="prep-card-desc">{c.desc}</div>
            <div className="prep-card-arrow">Open prep &rarr;</div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-10)' }}>
        <div className="prep-info">
          <div className="prep-info-label">Shared Walkthrough Pages</div>
          <p>These HubSpot case studies work across all four interviews.</p>
          <div className="prep-walkthrough-grid" style={{ marginTop: 'var(--space-3)' }}>
            <a href="#/prep/breeze" className="prep-walkthrough-link">Breeze AI &rarr;</a>
            <a href="#/prep/mobile" className="prep-walkthrough-link">HubSpot Mobile &rarr;</a>
            <a href="#/prep/leadership" className="prep-walkthrough-link">Design Leadership &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  );
}
