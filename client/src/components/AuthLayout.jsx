import { CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, heading, subtitle, footer, footerLink, footerAction }) {
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <Link className="brand brand-light" to="/login">
          <span className="brand-mark"><CheckCircle2 size={21} /></span>
          <span>daybook</span>
        </Link>
        <div className="aside-copy">
          <span className="eyebrow"><Sparkles size={15} /> A little more focus, every day</span>
          <h1>Make room for what matters.</h1>
          <p>One calm place to capture your plans, keep your momentum, and celebrate the little wins.</p>
        </div>
        <div className="aside-note"><span className="note-dot" /> Your next good day starts with one small step.</div>
        <div className="decor decor-one" /><div className="decor decor-two" />
      </section>
      <section className="auth-main">
        <div className="auth-card">
          <div className="mobile-brand"><span className="brand-mark"><CheckCircle2 size={20} /></span> daybook</div>
          <div className="auth-heading">
            <h2>{heading}</h2>
            <p>{subtitle}</p>
          </div>
          {children}
          <p className="auth-footer">{footer} <Link to={footerLink}>{footerAction}</Link></p>
        </div>
        <p className="auth-legal">A simple space for your everyday goals.</p>
      </section>
    </main>
  );
}
