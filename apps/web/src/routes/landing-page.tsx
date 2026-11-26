import { CustomWordmark } from "@/components/custom-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LandingPageRoute() {
  return (
    <div className="chargeback-page">
      <header className="chargeback-container chargeback-header">
        <CustomWordmark href="/" aria-label="Chargeback OS home">
          chargeback os
        </CustomWordmark>
        <nav className="chargeback-nav" aria-label="Main navigation">
          <a href="#workflow">Workflow</a>
          <a href="#teams">For teams</a>
        </nav>
      </header>

      <main>
        <section className="chargeback-container chargeback-hero" aria-labelledby="hero-title">
          <div className="chargeback-hero-content">
            <h1 id="hero-title">Chargeback operations, on autopilot.</h1>
            <p>
              Chargeback OS gives teams a focused workspace for handling disputes with agents.
            </p>
            <Button
              size="lg"
              className="!border-indigo-600 !bg-indigo-600 !text-white hover:!bg-indigo-700"
              render={<a href="/dashboard">Open the dashboard</a>}
            />
          </div>
          <Card className="chargeback-preview" id="teams" aria-label="Chargeback OS workspace preview">
            <CardHeader className="chargeback-preview-header">
              <CardTitle>Chargeback workspace</CardTitle>
              <CardDescription className="chargeback-preview-meta">
                For teams and agents
              </CardDescription>
            </CardHeader>
            <CardContent className="chargeback-preview-body">
              <div className="chargeback-preview-sidebar">
                <span>Queue</span>
                <span>Agent work</span>
                <span>Review</span>
              </div>
              <div className="chargeback-preview-content">
                <strong>One shared view of the work.</strong>
                <p>Keep people and agents working from the same place.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section
          className="chargeback-container chargeback-workflow"
          id="workflow"
          aria-labelledby="workflow-title"
        >
          <h2 id="workflow-title">One place for the work behind every dispute.</h2>
          <div className="chargeback-workflow-grid">
            <article className="chargeback-workflow-item">
              <h3>Bring it together</h3>
              <p>Keep chargeback work in one clear queue for the whole team.</p>
            </article>
            <article className="chargeback-workflow-item">
              <h3>Let agents move</h3>
              <p>Give agents the structure to handle repeatable work automatically.</p>
            </article>
            <article className="chargeback-workflow-item">
              <h3>Stay in control</h3>
              <p>Keep people close to the decisions that need their attention.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="chargeback-container chargeback-footer">
        <p>Chargeback OS — chargeback operations on autopilot.</p>
      </footer>
    </div>
  );
}
