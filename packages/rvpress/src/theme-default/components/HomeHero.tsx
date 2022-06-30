import React from 'react';
import { useData, withBase } from 'rvpress';

import NavLink from './NavLink';

const styles = `
.home-hero {
  margin: 2.5rem 0 2.75rem;
  padding: 0 1.5rem;
  text-align: center;
}

@media (min-width: 420px) {
  .home-hero {
    margin: 3.5rem 0;
  }
}

@media (min-width: 720px) {
  .home-hero {
    margin: 4rem 0 4.25rem;
  }
}

.figure {
  padding: 0 1.5rem;
}

.image {
  display: block;
  margin: 0 auto;
  width: auto;
  max-width: 100%;
  max-height: 280px;
}

.title {
  margin-top: 1.5rem;
  font-size: 2rem;
}

@media (min-width: 420px) {
  .title {
    font-size: 3rem;
  }
}

@media (min-width: 720px) {
  .title {
    margin-top: 2rem;
  }
}

.tagline {
  margin: 0;
  margin-top: 0.25rem;
  line-height: 1.3;
  font-size: 1.2rem;
  color: var(--c-text-light);
}

@media (min-width: 420px) {
  .tagline {
    line-height: 1.2;
    font-size: 1.6rem;
  }
}

.action {
  margin-top: 1.5rem;
  display: inline-block;
}

.action.alt {
  margin-left: 1.5rem;
}

@media (min-width: 420px) {
  .action {
    margin-top: 2rem;
    display: inline-block;
  }
}

.action :deep(.item) {
  display: inline-block;
  border-radius: 6px;
  padding: 0 20px;
  line-height: 44px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--c-bg);
  background-color: var(--c-brand);
  border: 2px solid var(--c-brand);
  transition: background-color 0.1s ease;
}

.action.alt :deep(.item) {
  background-color: var(--c-bg);
  color: var(--c-brand);
}

.action :deep(.item:hover) {
  text-decoration: none;
  color: var(--c-bg);
  background-color: var(--c-brand-light);
}

@media (min-width: 420px) {
  .action :deep(.item) {
    padding: 0 24px;
    line-height: 52px;
    font-size: 1.2rem;
    font-weight: 500;
  }
}
`;

export default () => {
    const { site, frontmatter } = useData();

    const showHero = (() => {
        const { heroImage, heroText, tagline, actionLink, actionText } = frontmatter;
        return heroImage || heroText || tagline || (actionLink && actionText);
    })();

    const heroText = () => frontmatter.heroText || site.title;
    const tagline = () => frontmatter.tagline || site.description;

    const altActionLink = {
        link: frontmatter.altActionLink,
        text: frontmatter.altActionText
    };
    const actionLink = { link: frontmatter.actionLink, text: frontmatter.actionText };
    return (
        <>
            <style>{styles}</style>

            {showHero && (
                <header className="home-hero">
                    {frontmatter.heroImage && (
                        <figure className="figure">
                            <img className="image" src={withBase(frontmatter.heroImage)} alt={frontmatter.heroAlt} />
                        </figure>
                    )}

                    {heroText && (
                        <h1 id="main-title" className="title">
                            {heroText}
                        </h1>
                    )}
                    {tagline && <p className="tagline">{tagline}</p>}

                    {frontmatter.actionLink && frontmatter.actionText && (
                        <NavLink item={actionLink} className="action" />
                    )}

                    {frontmatter.altActionLink && frontmatter.altActionText && (
                        <NavLink item={altActionLink} className="action alt" />
                    )}
                </header>
            )}
        </>
    );
};
