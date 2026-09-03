import { useEffect, useState } from 'react'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4'

const ABOUT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_063501_2e2c8971-de1e-473a-8611-a0c9ae7ee186.mp4'

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const videos = [
      document.getElementById('targo-hero-video'),
      document.getElementById('targo-about-video'),
    ].filter(Boolean)

    const playVideo = (video) => {
      if (!video) return

      video.muted = true
      video.defaultMuted = true

      const promise = video.play()

      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {})
      }
    }

    const timers = videos.map((video) => {
      playVideo(video)

      video.addEventListener(
        'loadedmetadata',
        () => playVideo(video),
        { once: true },
      )

      video.addEventListener(
        'canplay',
        () => playVideo(video),
        { once: true },
      )

      return window.setInterval(() => {
        playVideo(video)
      }, 1000)
    })

    const unlockVideos = () => {
      videos.forEach(playVideo)
    }

    document.addEventListener('click', unlockVideos, {
      once: true,
      passive: true,
    })

    document.addEventListener('touchstart', unlockVideos, {
      once: true,
      passive: true,
    })

    return () => {
      timers.forEach(clearInterval)

      document.removeEventListener('click', unlockVideos)
      document.removeEventListener('touchstart', unlockVideos)
    }
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <style>{`
        /* =========================================================
           TARGO DASHBOARD
           Everything is contained inside Dashboard.jsx
           ========================================================= */

        .targo-page {
          --targo-bg: #F2F1F0;
          --targo-about-bg: #F7F6F8;
          --targo-accent: #15BCDF;
          --targo-accent-hover: #3fd0ef;
          --targo-border: #0fa3c2;
          --targo-heading: #2b3033;
          --targo-nav: #3a3a3a;
          --targo-body: #6b6f72;
          --targo-dark: #1a1c1e;

          width: 100%;
          min-height: 100%;
          margin: 0;
          background: var(--targo-bg);
          color: var(--targo-heading);
          font-family:
            "Quantico",
            "Arial Narrow",
            Arial,
            sans-serif;
          overflow-x: hidden;
        }

        .targo-page *,
        .targo-page *::before,
        .targo-page *::after {
          box-sizing: border-box;
        }

        .targo-page a {
          color: var(--targo-nav);
          text-decoration: none;
        }

        .targo-page a:hover {
          color: #000;
        }

        .targo-page h1,
        .targo-page h2 {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          line-height: 0.98;
        }

        /* =========================================================
           HERO
           ========================================================= */

        .targo-hero {
          position: relative;
          min-height: 100svh;
          background: #F2F1F0;
          overflow: hidden;
          isolation: isolate;
        }

        .targo-hero-video {
          position: absolute;
          z-index: -3;
          top: 0;
          right: -20%;
          width: 99%;
          height: auto;
          max-width: none;
          object-fit: contain;
          object-position: center top;
          pointer-events: none;
          display: block;
        }

        .targo-hero-scrim {
          position: absolute;
          z-index: -2;
          top: 0;
          left: 0;
          bottom: 0;
          width: 70%;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              #F2F1F0 0%,
              #F2F1F0 55%,
              rgba(242,241,240,0.85) 78%,
              rgba(242,241,240,0) 100%
            );
        }

        /* =========================================================
           NAVBAR
           ========================================================= */

        .targo-nav {
          position: relative;
          z-index: 20;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: clamp(20px, 5vw, 56px);
          padding:
            clamp(20px, 3vw, 38px)
            clamp(20px, 4vw, 48px)
            0;
        }

        .targo-brand {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          flex: 0 0 auto;
        }

        .targo-logo {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          border-radius: 50%;
          background: #111;
          display: grid;
          place-items: center;
        }

        .targo-logo::before {
          content: "";
          width: 20px;
          height: 8px;
          background: #fff;
          border-radius: 999px;
          transform: rotate(-25deg);
        }

        .targo-brand-name {
          color: #111;
          font-size: clamp(22px, 5vw, 30px);
          font-weight: 400;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .targo-links {
          display: flex;
          align-items: center;
          gap: 34px;
          margin-left: clamp(10px, 5vw, 46px);
        }

        .targo-links a {
          color: #3a3a3a;
          font-size: clamp(12px, 2.4vw, 15px);
          font-weight: 700;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .targo-links a:hover {
          color: #000;
        }

        .targo-contact {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: 0;
          background: transparent;
          color: #fff !important;
          padding: 14px 26px;
          text-transform: uppercase;
          font-family:
            "Quantico",
            "Arial Narrow",
            Arial,
            sans-serif;
          font-size: clamp(12px, 2.2vw, 15px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.14em;
          cursor: pointer;

          clip-path:
            polygon(
              0 0,
              calc(100% - 12px) 0,
              100% 12px,
              100% 100%,
              12px 100%,
              0 calc(100% - 12px)
            );
        }

        .targo-contact:hover {
          background: rgba(255,255,255,0.14);
        }

        .targo-mail {
          width: 17px;
          height: 13px;
          flex: 0 0 17px;
        }

        /* =========================================================
           MOBILE MENU
           ========================================================= */

        .targo-mobile-toggle {
          display: none;
          margin-left: auto;
          width: 46px;
          height: 40px;
          padding: 8px;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .targo-mobile-toggle span {
          display: block;
          width: 22px;
          height: 2px;
          margin: 0 auto;
          background: #fff;
        }

        .targo-mobile-toggle span + span {
          margin-top: 5px;
        }

        .targo-mobile-menu {
          display: none;
        }

        /* =========================================================
           HERO TEXT
           ========================================================= */

        .targo-hero-copy {
          position: relative;
          z-index: 2;

          padding:
            min(clamp(40px, 9vw, 120px), 9vh)
            20px
            min(clamp(24px, 4vw, 44px), 5vh)
            clamp(20px, 9vw, 118px);
        }

        .targo-hero-title {
          max-width: 900px;
          color: #2b3033;
          font-size:
            min(
              clamp(34px, 7.6vw, 80px),
              9.2vh
            );
          font-weight: 700;
        }

        .targo-hero-title .targo-indent {
          display: block;
          padding-left: min(238px, 28vw);
        }

        .targo-hero-title .targo-accent {
          color: #15BCDF;
        }

        /* =========================================================
           CTA
           ========================================================= */

        .targo-cta-wrap {
          padding-left:
            calc(
              clamp(20px, 9vw, 118px)
              + min(238px, 28vw)
            );

          padding-bottom:
            min(clamp(36px, 6vw, 80px), 7vh);
        }

        .targo-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 18px;

          border: 1px solid #0fa3c2;
          background: #15BCDF;
          color: #1a1c1e !important;

          padding: 18px 34px;

          text-transform: uppercase;
          font-family:
            "Quantico",
            "Arial Narrow",
            Arial,
            sans-serif;
          font-size: clamp(13px, 2.2vw, 16px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.14em;

          cursor: pointer;

          clip-path:
            polygon(
              0 0,
              calc(100% - 16px) 0,
              100% 16px,
              100% 100%,
              16px 100%,
              0 calc(100% - 16px)
            );

          box-shadow:
            0 0 0 1px rgba(21,188,223,0.35),
            0 10px 30px -12px rgba(15,163,194,0.6);

          transition:
            transform 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .targo-button::after {
          content: "";
          width: 22px;
          height: 1px;
          background: #1a1c1e;
          display: block;
          margin-left: 2px;
        }

        .targo-button:hover {
          color: #1a1c1e !important;
          background: #3fd0ef;
          transform: translateY(-2px);

          box-shadow:
            0 0 0 1px rgba(21,188,223,0.55),
            0 14px 38px -10px rgba(15,163,194,0.72);
        }

        /* =========================================================
           ABOUT
           ========================================================= */

        .targo-about {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 40px;

          background:
            linear-gradient(
              180deg,
              #F2F1F0 0%,
              #F7F6F8 18%,
              #F7F6F8 100%
            );

          padding:
            clamp(60px, 10vw, 140px)
            0
            clamp(30px, 5vw, 70px)
            clamp(20px, 9vw, 118px);

          overflow: hidden;
        }

        .targo-about-copy {
          flex: 1 1 420px;
          min-width: 300px;
        }

        .targo-about-title {
          color: #2b3033;
          font-size: clamp(34px, 6.5vw, 72px);
          font-weight: 700;
        }

        .targo-about-title .targo-indent {
          display: block;
          padding-left: min(160px, 18vw);
          color: #15BCDF;
        }

        .targo-about-text {
          max-width: 520px;
          margin:
            32px
            0
            0
            min(160px, 18vw);

          color: #6b6f72;
          font-size: clamp(14px, 1.6vw, 17px);
          line-height: 1.7;
          font-weight: 400;
        }

        .targo-about-button {
          margin:
            36px
            0
            0
            min(160px, 18vw);
        }

        /* =========================================================
           ABOUT VIDEO
           ========================================================= */

        .targo-about-media {
          flex: 1 1 360px;
          min-width: 280px;

          display: flex;
          justify-content: flex-end;

          position: relative;
        }

        .targo-about-video {
          display: block;
          width: 100%;
          max-width: 644px;
          height: auto;

          object-fit: contain;
          object-position: center;
        }

        .targo-about-tint {
          position: absolute;
          top: 0;
          right: 0;

          width: 100%;
          max-width: 644px;
          height: 100%;

          background: #15BCDF;
          mix-blend-mode: hue;

          pointer-events: none;
          z-index: 1;
        }

        /* =========================================================
           MOBILE
           ========================================================= */

        @media (max-width: 700px) {

          .targo-hero {
            min-height: 100svh;
          }

          .targo-hero-video {
            top: 0;
            left: -12%;
            right: auto;
            width: 119%;
          }

          .targo-hero-scrim {
            display: none;
          }

          .targo-nav {
            padding:
              20px
              20px
              0;
          }

          .targo-links,
          .targo-contact {
            display: none;
          }

          .targo-mobile-toggle {
            display: block;
          }

          .targo-mobile-menu {
            position: absolute;
            z-index: 50;

            top: calc(100% + 10px);
            left: 20px;
            right: 20px;

            display: grid;
            gap: 18px;

            padding: 20px 22px;

            background: rgba(242,241,240,0.97);

            border: 1px solid rgba(58,58,58,0.13);

            box-shadow:
              0 18px 45px rgba(35,40,43,0.12);

            opacity: 0;
            visibility: hidden;

            transform: translateY(-8px);

            transition:
              opacity 160ms ease,
              transform 160ms ease,
              visibility 160ms ease;
          }

          .targo-mobile-menu.is-open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          .targo-mobile-menu a {
            color: #1a1c1e !important;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.06em;
          }

          .targo-hero-copy {
            margin-top: 360px;
            padding: 0 20px 28px 20px;
          }

          .targo-hero-title {
            font-size: clamp(34px, 10vw, 56px);
          }

          .targo-hero-title .targo-indent {
            padding-left: min(238px, 28vw);
          }

          .targo-cta-wrap {
            padding-left:
              calc(
                20px + min(238px, 28vw)
              );

            padding-bottom: 36px;
          }

          .targo-button {
            padding: 17px 25px;
          }

          .targo-about {
            flex-direction: column;
            align-items: stretch;
            gap: 50px;

            padding:
              70px
              0
              40px
              20px;
          }

          .targo-about-copy {
            min-width: 0;
          }

          .targo-about-title {
            font-size: clamp(34px, 10vw, 56px);
          }

          .targo-about-title .targo-indent {
            padding-left: min(160px, 18vw);
          }

          .targo-about-text {
            margin-left: min(160px, 18vw);
            max-width:
              calc(
                100vw -
                min(160px, 18vw) -
                20px
              );
          }

          .targo-about-button {
            margin-left: min(160px, 18vw);
          }

          .targo-about-media {
            width: 100%;
            min-width: 0;
          }

          .targo-about-video,
          .targo-about-tint {
            width: 100%;
            max-width: 644px;
          }
        }

        @media (max-width: 430px) {

          .targo-brand {
            gap: 10px;
          }

          .targo-logo {
            width: 34px;
            height: 34px;
            flex-basis: 34px;
          }

          .targo-logo::before {
            width: 18px;
            height: 7px;
          }

          .targo-hero-copy {
            margin-top: 360px;
          }

          .targo-hero-title {
            font-size: 34px;
          }

          .targo-hero-title .targo-indent {
            padding-left: 22vw;
          }

          .targo-cta-wrap {
            padding-left:
              calc(20px + 22vw);
          }

          .targo-about {
            padding-left: 20px;
          }

          .targo-about-title {
            font-size: 34px;
          }

          .targo-about-text,
          .targo-about-button {
            margin-left: 22vw;
          }

          .targo-about-text {
            max-width:
              calc(
                100vw -
                22vw -
                20px
              );
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .targo-button {
            transition: none;
          }
        }
      `}</style>

      <div className="targo-page">

        {/* =====================================================
            SECTION 1 — HERO
            ===================================================== */}

        <section
          className="targo-hero"
          id="targo-home"
          aria-label="Targo hero"
        >
          <video
            id="targo-hero-video"
            className="targo-hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source
              src={HERO_VIDEO}
              type="video/mp4"
            />
          </video>

          <div
            className="targo-hero-scrim"
            aria-hidden="true"
          />

          {/* NAVIGATION */}

          <nav
            className="targo-nav"
            aria-label="Primary navigation"
          >
            <a
              className="targo-brand"
              href="#targo-home"
              aria-label="Targo home"
            >
              <span
                className="targo-logo"
                aria-hidden="true"
              />

              <span className="targo-brand-name">
                targo
              </span>
            </a>

            <div className="targo-links">
              <a href="#targo-home">
                HOME
              </a>

              <a href="#targo-about">
                ABOUT
              </a>

              <a href="#targo-about">
                CONTACT US
              </a>
            </div>

            <a
              className="targo-contact"
              href="#targo-about"
            >
              <svg
                className="targo-mail"
                viewBox="0 0 17 13"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="0.7"
                  y="0.7"
                  width="15.6"
                  height="11.6"
                  rx="0.4"
                  stroke="white"
                  strokeWidth="1.4"
                />

                <path
                  d="M1.2 1.4L8.5 7L15.8 1.4"
                  stroke="white"
                  strokeWidth="1.4"
                />
              </svg>

              CONTACT US
            </a>

            <button
              className="targo-mobile-toggle"
              type="button"
              aria-label={
                menuOpen
                  ? 'Close navigation'
                  : 'Open navigation'
              }
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>

            <div
              className={`targo-mobile-menu ${
                menuOpen ? 'is-open' : ''
              }`}
            >
              <a
                href="#targo-home"
                onClick={closeMenu}
              >
                HOME
              </a>

              <a
                href="#targo-about"
                onClick={closeMenu}
              >
                ABOUT
              </a>

              <a
                href="#targo-about"
                onClick={closeMenu}
              >
                CONTACT US
              </a>
            </div>
          </nav>

          {/* HERO HEADLINE */}

          <div className="targo-hero-copy">
            <h1 className="targo-hero-title">
              SCALING

              <span>
                THE
              </span>

              <span>
                PLATFORM
              </span>

              <span className="targo-indent">
                FOR
              </span>

              <span className="targo-indent">
                YOUR
              </span>

              <span className="targo-indent targo-accent">
                BUSINESS
              </span>
            </h1>
          </div>

          {/* HERO CTA */}

          <div className="targo-cta-wrap">
            <a
              className="targo-button"
              href="#targo-about"
            >
              GET STARTED
            </a>
          </div>
        </section>


        {/* =====================================================
            SECTION 2 — ABOUT
            ===================================================== */}

        <section
          className="targo-about"
          id="targo-about"
          aria-label="About Targo"
        >
          {/* LEFT */}

          <div className="targo-about-copy">

            <h2 className="targo-about-title">
              ABOUT

              <span className="targo-indent">
                BUSINESS
              </span>
            </h2>

            <p className="targo-about-text">
              Targo builds the testing infrastructure modern
              teams rely on. From automated pipelines to
              full-scale QA audits, we make sure your software
              ships fast and breaks nothing. Hundreds of
              releases, zero surprises.
            </p>

            <div className="targo-about-button">
              <a
                className="targo-button"
                href="#targo-home"
              >
                LEARN MORE
              </a>
            </div>

          </div>

          {/* RIGHT VIDEO */}

          <div className="targo-about-media">

            <video
              id="targo-about-video"
              className="targo-about-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            >
              <source
                src={ABOUT_VIDEO}
                type="video/mp4"
              />
            </video>

            <div
              className="targo-about-tint"
              aria-hidden="true"
            />

          </div>
        </section>

      </div>
    </>
  )
}