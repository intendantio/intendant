import React, { useEffect } from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'
import '../../static/js/animation.js'

const TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = 500;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">Automate ' + this.txt + '</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
  }

  setTimeout(function () {
      that.tick();
  }, delta);
};


const features = [
  {
    title: 'Free & Open source',
    description: (
      <>
        Intendant is designed to be free and open source software. It can be installed in a few minutes without any pre-requisite skills.
      </>
    ),
  },
  {
    title: 'Compatible & Customisable',
    description: (
      <>
        Intedant is designed to be upgraded with custom modules. It is possible to create your own modules in a playful way. It has never been so easy to connect your home.
      </>
    ),
  },
  {
    title: 'Open source application',
    description: (
      <>
        Intendant has an Android and iOS app available in the PlayStore, AppStore. Application is the easiest and most ergonomic way to use the Intendant. It is open source and does not require any authorization.
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


  useEffect(() => {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-rotate');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), 500);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid white }";
    document.body.appendChild(css);
  },[])

  return (
    <Layout
      title={"Home"}
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
