export default function ComingSoonPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #f5f3ee;
          font-family: 'DM Sans', sans-serif;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f5f3ee;
          position: relative;
          overflow: hidden;
        }

        /* Subtle paper texture overlay */
        .page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          animation: fadeUp 1s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .logo-icon {
          width: 56px;
          height: 56px;
          background: #1a1a2e;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #1a1a2e;
          line-height: 1.2;
          text-align: left;
        }

        .logo-name span {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8a8a9a;
        }

        /* Divider */
        .divider {
          width: 48px;
          height: 1px;
          background: #c8c4bc;
        }

        /* Main text */
        .headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(3rem, 10vw, 6.5rem);
          color: #1a1a2e;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .subtext {
          font-size: 0.95rem;
          color: #8a8a9a;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* Floating paper planes */
        .plane {
          position: fixed;
          pointer-events: none;
          opacity: 0.55;
        }
        .plane-1 { top: 15%; left: 8%; animation: float1 7s ease-in-out infinite; }
        .plane-2 { top: 25%; right: 10%; animation: float2 9s ease-in-out infinite; }
        .plane-3 { bottom: 20%; left: 14%; animation: float1 8s ease-in-out 2s infinite; }
        .plane-4 { bottom: 30%; right: 7%; animation: float2 6s ease-in-out 1s infinite; }

        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(-10deg); }
          50%       { transform: translateY(-16px) rotate(-6deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50%       { transform: translateY(-20px) rotate(16deg); }
        }

        /* Clouds at bottom */
        .clouds {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          pointer-events: none;
        }
      `}</style>

      <div className="page">

        {/* Paper planes */}
        <svg className="plane plane-1" width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M2 22L42 4L28 42L22 26L2 22Z" fill="#e8b84b" stroke="#c9973a" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M22 26L42 4" stroke="#c9973a" strokeWidth="1.5"/>
        </svg>
        <svg className="plane plane-2" width="38" height="38" viewBox="0 0 44 44" fill="none">
          <path d="M2 22L42 4L28 42L22 26L2 22Z" fill="#e05c3a" stroke="#c04428" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M22 26L42 4" stroke="#c04428" strokeWidth="1.5"/>
        </svg>
        <svg className="plane plane-3" width="32" height="32" viewBox="0 0 44 44" fill="none">
          <path d="M2 22L42 4L28 42L22 26L2 22Z" fill="#5abfcf" stroke="#3aa0b0" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M22 26L42 4" stroke="#3aa0b0" strokeWidth="1.5"/>
        </svg>
        <svg className="plane plane-4" width="28" height="28" viewBox="0 0 44 44" fill="none">
          <path d="M2 22L42 4L28 42L22 26L2 22Z" fill="#e8b84b" stroke="#c9973a" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M22 26L42 4" stroke="#c9973a" strokeWidth="1.5"/>
        </svg>

        {/* Clouds SVG at bottom */}
        <svg className="clouds" viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <ellipse cx="200" cy="200" rx="260" ry="90" fill="#e8e4dc"/>
          <ellipse cx="400" cy="210" rx="200" ry="80" fill="#ede9e0"/>
          <ellipse cx="650" cy="220" rx="300" ry="100" fill="#e8e4dc"/>
          <ellipse cx="950" cy="215" rx="280" ry="95" fill="#ede9e0"/>
          <ellipse cx="1200" cy="205" rx="250" ry="85" fill="#e8e4dc"/>
          <ellipse cx="1400" cy="210" rx="180" ry="75" fill="#ede9e0"/>
          <rect x="0" y="155" width="1440" height="30" fill="#e0dbd2"/>
        </svg>

        {/* Main content */}
        <div className="content">

          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 50 50" fill="none">
                <rect x="5" y="22" width="40" height="5" rx="2.5" fill="white" opacity="0.95"/>
                <rect x="11" y="24" width="7" height="2" rx="1" fill="#1a1a2e"/>
                <rect x="22" y="24" width="7" height="2" rx="1" fill="#1a1a2e"/>
                <rect x="33" y="24" width="7" height="2" rx="1" fill="#1a1a2e"/>
                <text x="10" y="20" fontSize="13" fill="white" fontFamily="Georgia, serif" fontWeight="bold">∑</text>
                <text x="27" y="20" fontSize="11" fill="white" fontFamily="Georgia, serif" fontWeight="bold">π</text>
                <text x="10" y="38" fontSize="11" fill="white" fontFamily="Georgia, serif" fontWeight="bold">∫</text>
                <text x="28" y="38" fontSize="12" fill="white" fontFamily="Georgia, serif" fontWeight="bold">∞</text>
              </svg>
            </div>
            <div className="logo-name">
              Maths Super Highway
              <span>The Fast Lane to Mathematical Mastery</span>
            </div>
          </div>

          <div className="divider" />

          <h1 className="headline">Coming<br/>Soon</h1>

          <p className="subtext">Get ready! Something really cool is coming!</p>

        </div>
      </div>
    </>
  )
}