export default function About() {
  return (
    <div className="min-h-screen p-4 sm:p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            About The Great Wall
          </h1>
          <p className="text-lg text-muted-foreground">
            Documenting support for military operations in Palestine
          </p>
        </div>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Imagine</h2>
          <p className="text-muted-foreground leading-relaxed">
            Consider a hypothetical scenario: if a group of Iranians claiming religious text (Quran) as justification for territorial rights arrived in Switzerland and displaced the existing population through force, gradually expanding their control over more land.
            Most would agree the international community wouldn&apos;t accept this. Yet when we examine the historical record of how the current Israeli-Palestinian situation developed—with documented displacement of populations and territorial expansion—there appears to be a different standard of international response. Why does this discrepancy exist?
          </p>
        </section>

        {/* Mission Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            This is a public record where both good and bad actors are visible for all to see. We document public figures and corporations who have publicly supported or funded military operations in Gaza that have been subject to International Court of Justice provisional measures and multiple United Nations resolutions. But we also recognize those who have taken principled stands for human rights and international law. This transparency allows consumers and citizens to know where public figures and organizations stand on these critical issues, and to make informed decisions about who deserves their support and who doesn&apos;t.
          </p>
        </section>

        {/* Context Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Legal Context</h2>
          <p className="text-muted-foreground leading-relaxed">
            In January 2024, the International Court of Justice issued provisional measures in a case brought by South Africa, finding a plausible risk of genocide and ordering Israel to prevent genocidal acts and ensure humanitarian aid access. Multiple UN Security Council resolutions and General Assembly resolutions have called for ceasefires and condemned actions in Gaza. Despite these international legal proceedings and documented civilian casualties, many public figures and corporations have continued or increased their support.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">The Antisemitism Question</h2>
          <p className="text-muted-foreground leading-relaxed">
            We refuse to moderate our condemnation of Zionism and the actions of the Israeli state in the face of what we see as a deliberate campaign of dispossession and apartheid. The historical record is clear: from the Nakba to the ongoing siege of Gaza and the illegal expansion of settlements, a project of ethnic supremacy is being enacted. This is not a conflict between equals; it is a military occupation where one power subjects another to statelessness and military rule.</p>
          <p className="text-muted-foreground leading-relaxed">We are aware that criticizing this power evokes accusations of antisemitism—a tactic designed to silence dissent. We reject this entirely. Our solidarity is with the Palestinian people facing daily violence and humiliation. It is also with the many Jewish voices, from Noam Chomsky to the Jewish Voice for Peace, who stand against this ideology. This is not about religion; it is about opposing a political project that violates international law and basic human rights.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are critical of any ideology that asserts one group&apos;s primacy over global affairs. In our view, Zionism, as a political movement, has been used to justify the consolidation of significant influence in international systems such as finance, news, media, entertainment, social media, tech and politics. This concentration of power has been used to stifle dissent and undermine international law, as also seen in the illegal bombing of Qatar, Iran, Lebanon, Syria etc. It is crucial to distinguish this criticism of a political ideology from prejudice against Jewish people, as many Jews themselves are not Zionists. Our position is one of anti-Zionism, not antisemitism.</p>
        </section>

        {/* How It Works Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
          <div className="space-y-4 text-muted-foreground">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">1. Document Public Statements</h3>
              <p className="leading-relaxed">
                Users submit documented evidence of public statements, financial contributions, policy positions, or material support provided to military operations in Gaza, with links to credible sources.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">2. Community Verification</h3>
              <p className="leading-relaxed">
                The community reviews submissions to ensure accuracy and proper sourcing, with voting to highlight the most well-documented cases.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">3. Informed Action</h3>
              <p className="leading-relaxed">
                Verified information empowers individuals to make informed decisions about which public figures and corporations to support through their consumer choices, votes, and advocacy.
              </p>
            </div>
          </div>
        </section>

        {/* Guidelines Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Submission Guidelines</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>All submissions must link to verifiable sources - direct quotes, video footage, official statements, or credible news reporting</li>
            <li>Include dates and context for all documented positions</li>
            <li>Note if individuals or organizations have changed their positions over time</li>
            <li>Focus on public statements and actions, not private individuals</li>
            <li>Maintain factual accuracy - this is a documentation project, not a harassment campaign</li>
            <li>Respect legal boundaries and avoid defamation</li>
          </ul>
        </section>

        {/* Values Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Our Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Accountability</h3>
              <p className="text-muted-foreground">
                Public figures and corporations must be accountable for their positions on matters of international humanitarian law.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Documentation</h3>
              <p className="text-muted-foreground">
                Every entry must be supported by verifiable, publicly available evidence.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Transparency</h3>
              <p className="text-muted-foreground">
                Citizens deserve to know where influential figures and organizations stand on critical humanitarian issues.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Justice</h3>
              <p className="text-muted-foreground">
                We stand for human rights, international law, and the protection of civilian populations.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Take Action</h2>
          <p className="text-muted-foreground leading-relaxed">
            Join us in documenting accountability. Submit evidence, verify information, and use this platform to make informed decisions about where you direct your support and resources.
          </p>
        </section>
      </div>
    </div>
  );
}