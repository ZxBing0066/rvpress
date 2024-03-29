import React from 'react';
import { useData } from 'rvpress';

const style = `
.home-features {
  margin: 0 auto;
  padding: 2.5rem 0 2.75rem;
  max-width: 960px;
}

.home-hero + .home-features {
  padding-top: 0;
}

@media (min-width: 420px) {
  .home-features {
    padding: 3.25rem 0 3.5rem;
  }

  .home-hero + .home-features {
    padding-top: 0;
  }
}

@media (min-width: 720px) {
  .home-features {
    padding-right: 1.5rem;
    padding-left: 1.5rem;
  }
}

.wrapper {
  padding: 0 1.5rem;
}

.home-hero + .home-features .wrapper {
  border-top: 1px solid var(--c-divider);
  padding-top: 2.5rem;
}

@media (min-width: 420px) {
  .home-hero + .home-features .wrapper {
    padding-top: 3.25rem;
  }
}

@media (min-width: 720px) {
  .wrapper {
    padding-right: 0;
    padding-left: 0;
  }
}

.container {
  margin: 0 auto;
  max-width: 392px;
}

@media (min-width: 720px) {
  .container {
    max-width: 960px;
  }
}

.features {
  display: flex;
  flex-wrap: wrap;
  margin: -20px -24px;
}

.feature {
  flex-shrink: 0;
  padding: 20px 24px;
  width: 100%;
}

@media (min-width: 720px) {
  .feature {
    width: calc(100% / 3);
  }
}

.title {
  margin: 0;
  border-bottom: 0;
  line-height: 1.4;
  font-size: 1.25rem;
  font-weight: 500;
}

@media (min-width: 420px) {
  .title {
    font-size: 1.4rem;
  }
}

.details {
  margin: 0;
  line-height: 1.6;
  font-size: 1rem;
  color: var(--c-text-light);
}

.title + .details {
  padding-top: 0.25rem;
}
`;

interface Feature {
    title?: string;
    details?: string;
}
export default () => {
    const { frontmatter } = useData();

    const hasFeatures = frontmatter.features && frontmatter.features.length > 0;

    const features: Feature[] = frontmatter.features ? frontmatter.features : [];

    return (
        <>
            <style>{style}</style>

            {hasFeatures && (
                <div className="home-features">
                    <div className="wrapper">
                        <div className="container">
                            <div className="features">
                                {features.map((feature, i) => (
                                    <section key={i} className="feature">
                                        {feature.title && <h2 className="title">{feature.title}</h2>}
                                        {feature.details && <p className="details">{feature.details}</p>}
                                    </section>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
