import React from 'react';
import { GitPullRequest } from 'lucide-react';

export const ContributeSection: React.FC = () => {
  return (
    <section id="contribute">
      <div className="container">
        <h2 className="section-title">Join the Project</h2>
        <p>
          Verbski is an open-source initiative. We need developers to add new languages
          and linguists to refine the verb databases.
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary hover-target"
        >
          <GitPullRequest size={18} />
          Contribute on GitHub
        </a>
      </div>
    </section>
  );
};
