import React from 'react';
import { useData } from 'rvpress';

const style = `
.footer {
  margin: 0 auto;
  max-width: 960px;
}

@media (min-width: 720px) {
  .footer {
    padding: 0 1.5rem;
  }
}

.container {
  padding: 2rem 1.5rem 2.25rem;
}

.home-hero + .footer .container,
.home-features + .footer .container,
.home-content + .footer .container {
  border-top: 1px solid var(--c-divider);
}

@media (min-width: 420px) {
  .container {
    padding: 3rem 1.5rem 3.25rem;
  }
}

.text {
  margin: 0;
  text-align: center;
  line-height: 1.4;
  font-size: 0.9rem;
  color: var(--c-text-light);
}
`;

export default () => {
    const { frontmatter } = useData();
    return (
        <>
            <style>{style}</style>
            {frontmatter.footer && (
                <footer className="footer">
                    <div className="container">
                        <p className="text">{frontmatter.footer}</p>
                    </div>
                </footer>
            )}
        </>
    );
};
