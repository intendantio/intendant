import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import animation from '../../static/js/animation'

const features = [
  {
    title: 'Free & Open source',
    imageUrl: 'img/easytosetup.png',
    description: (
      <>
        Intendant was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: 'Compatible & Customisable',
    imageUrl: 'img/easytouse.png',
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: 'Autonome',
    imageUrl: 'img/easytouse.png',
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={"Test"}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img src={"/img/logo.svg"} style={{ height: '20vh', width: '20vh', borderRadius: 7 }} />

          <h1 className="hero__title">{siteConfig.title}</h1>
          <h2 className="hero__subtitle"><span
            class="hero__subtitle txt-rotate"
            data-period="500"
            data-rotate='[ "your home.", "your light.", "your plug.", "your switch.", "your sensor." ]'>
          </span>
          </h2>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
