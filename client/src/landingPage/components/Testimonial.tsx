import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert, Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent,
  IconButton, Link, Rating, Tab, Tabs, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { Testimonial } from "..";
import { getLandingPageTestimonials } from "../api";
import {
  LINKEDIN_PROFILE_URL,
  linkedinRecommendations,
  type LinkedInRecommendation,
} from "./linkedinRecommendations";

// ── Constants ─────────────────────────────────────────────────────
const CARD_GAP = 24;          // px between cards
const SCROLL_SPEED = 35;      // px per second — lower = slower
const WRAP_THRESHOLD = 1;     // only a single card stays still; 2 or more scroll
const MIN_SET_WIDTH = 1800;    // this many items or fewer: show a grid instead of scrolling
const LONG_TEXT = 170;        // longer than this gets a "Read full" link
const LI_BLUE = "#0A66C2";

type TabKey = "recommendations" | "students";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// ── One shape for every card, so both tabs share the same design ──
interface CardData {
  id: string;
  name: string;
  subtitle: string;                    // headline or course title
  meta?: string;                       // relation · context · date
  message: string;
  rating?: number;                     // only student reviews pass this
  badge: { label: string; kind: "linkedin" | "student" };
  profileUrl?: string;
  sourceUrl?: string;
}

const fromStudent = (t: Testimonial): CardData => ({
  id: t._id,
  name: t.user.name,
  subtitle: `${t.course.title}${t.course.average ? ` · ★ ${t.course.average}` : ""}`,
  message: t.message,
  rating: t.rating,
  badge: { label: "Student", kind: "student" },
});

const fromRecommendation = (r: LinkedInRecommendation): CardData => {
  const linkedin = (r.source ?? "linkedin") === "linkedin";
  return {
    id: r.id,
    name: r.name,
    subtitle: r.headline,
    meta: [r.relation, r.context, r.date].filter(Boolean).join(" · "),
    message: r.message,
    badge: linkedin
      ? { label: "LinkedIn", kind: "linkedin" }
      : { label: r.sourceLabel ?? "Student review", kind: "student" },
    profileUrl: r.profileUrl,
    sourceUrl: r.sourceUrl,
  };
};

const Badge: React.FC<{ badge: CardData["badge"] }> = ({ badge }) => {
  const li = badge.kind === "linkedin";
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.25,
        borderRadius: "999px",
        bgcolor: li ? "#DBEAFE" : "#CFFAFE",
        color: li ? LI_BLUE : "#0E7490",
        fontSize: "0.68rem",
        fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {li && <LinkedInIcon sx={{ fontSize: 13 }} />}
      {badge.label}
    </Box>
  );
};

const starSx = {
  "& .MuiRating-iconFilled": { color: "#F59E0B" },
  "& .MuiRating-iconEmpty": { color: "#E2E8F0" },
};

// ── The card: speech bubble on top, author underneath ─────────────
const ReviewCard: React.FC<{
  d: CardData;
  width: number;
  onOpen: (d: CardData) => void;
}> = ({ d, width, onOpen }) => {
  const isLong = d.message.length > LONG_TEXT;

  return (
    <motion.div
      className="review-card"
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      style={{ flexShrink: 0, width, display: "flex", flexDirection: "column", cursor: "default" }}
    >
      {/* Bubble */}
      <Box
        className="bubble"
        sx={{
          position: "relative",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          bgcolor: "#fff",
          border: "1px solid #BFDBFE",
          borderRadius: "14px",
          p: 2.25,
          transition: "border-color 0.25s, box-shadow 0.25s",
          ".review-card:hover &": {
            borderColor: "#06B6D4",
            boxShadow: "0 14px 36px rgba(10,22,40,0.12)",
          },
        }}
      >
        {/* Top row: stars (students) or quote mark (recommendations) + badge */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, minHeight: 22 }}>
          {d.rating ? (
            <Rating
              value={d.rating}
              readOnly
              size="small"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
              sx={starSx}
            />
          ) : (
            <FormatQuoteIcon sx={{ color: "#06B6D4", fontSize: 24, transform: "scaleX(-1)" }} />
          )}
          <Badge badge={d.badge} />
        </Box>

        {/* Text */}
        <Typography
          sx={{
            color: "#334155",
            fontSize: "0.8rem",
            lineHeight: 1.7,
            fontFamily: "'Inter', sans-serif",
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
          }}
        >
          {d.message}
        </Typography>

        {isLong && (
          <Button
            size="small"
            onClick={() => onOpen(d)}
            sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600, fontSize: "0.75rem", color: "#0891B2", p: 0, minWidth: 0 }}
          >
            Read full
          </Button>
        )}

        {/* Bubble tail */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: 28,
            bottom: -7,
            width: 12,
            height: 12,
            bgcolor: "#fff",
            borderRight: "1px solid #BFDBFE",
            borderBottom: "1px solid #BFDBFE",
            transform: "rotate(45deg)",
            transition: "border-color 0.25s",
            ".review-card:hover &": { borderColor: "#06B6D4" },
          }}
        />
      </Box>

      {/* Author */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 2.25, px: 0.5 }}>
        <Avatar sx={{ bgcolor: "#0A1628", color: "#06B6D4", width: 38, height: 38, fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Sora', sans-serif", flexShrink: 0 }}>
          {initials(d.name)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {d.profileUrl ? (
            <Link
              href={d.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              noWrap
              sx={{ display: "block", color: "#0A1628", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Sora', sans-serif", lineHeight: 1.3 }}
            >
              {d.name}
            </Link>
          ) : (
            <Typography noWrap sx={{ color: "#0A1628", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Sora', sans-serif", lineHeight: 1.3 }}>
              {d.name}
            </Typography>
          )}
          <Typography noWrap title={d.subtitle} sx={{ color: "#64748B", fontSize: "0.72rem", fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>
            {d.subtitle}
          </Typography>
          {d.meta && (
            <Typography noWrap title={d.meta} sx={{ color: "#94A3B8", fontSize: "0.68rem", fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>
              {d.meta}
            </Typography>
          )}
        </Box>
        {d.profileUrl && (
          <IconButton
            component="a"
            href={d.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            aria-label={`View ${d.name} on LinkedIn`}
            sx={{ color: LI_BLUE, flexShrink: 0 }}
          >
            <LinkedInIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </motion.div>
  );
};

// ── Full review dialog ────────────────────────────────────────────
const ReviewDialog: React.FC<{
  d: CardData | null;
  onClose: () => void;
  fullScreen: boolean;
}> = ({ d, onClose, fullScreen }) => {
  const link = d?.profileUrl ?? d?.sourceUrl;
  return (
    <Dialog
      open={!!d}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      scroll="paper"
      aria-labelledby="review-dialog-title"
      slotProps={{ paper: { sx: { borderRadius: fullScreen ? 0 : "18px" } } }}
    >
      {d && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: { xs: 2, sm: 3 }, pb: 2 }}>
            <Avatar sx={{ bgcolor: "#0A1628", color: "#06B6D4", width: 48, height: 48, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
              {initials(d.name)}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography id="review-dialog-title" sx={{ fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#0A1628", lineHeight: 1.3 }}>
                {d.name}
              </Typography>
              <Typography sx={{ color: "#64748B", fontSize: "0.8rem", lineHeight: 1.4 }}>{d.subtitle}</Typography>
              {d.meta && <Typography sx={{ color: "#94A3B8", fontSize: "0.75rem", mt: 0.25 }}>{d.meta}</Typography>}
              {d.rating ? (
                <Rating
                  value={d.rating}
                  readOnly
                  size="small"
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                  sx={{ mt: 0.5, ...starSx }}
                />
              ) : null}
            </Box>
            <Badge badge={d.badge} />
          </Box>
          <DialogContent dividers>
            <Typography sx={{ color: "#334155", lineHeight: 1.85, fontSize: "0.95rem", whiteSpace: "pre-line", fontFamily: "'Inter', sans-serif" }}>
              {d.message}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            {link && (
              <Button
                component="a"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={d.profileUrl ? <LinkedInIcon /> : undefined}
                endIcon={<OpenInNewIcon sx={{ fontSize: "15px !important" }} />}
                sx={{ textTransform: "none", fontWeight: 600, color: d.profileUrl ? LI_BLUE : "#0891B2" }}
              >
                {d.profileUrl ? "View on LinkedIn" : "View original"}
              </Button>
            )}
            <Button onClick={onClose} variant="contained" sx={{ textTransform: "none", fontWeight: 700, bgcolor: "#0A1628", "&:hover": { bgcolor: "#13264a" } }}>
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

// ── Infinite marquee ──────────────────────────────────────────────
interface MarqueeProps<T> {
  items: T[];
  cardWidth: number;
  getKey: (item: T) => string;
  render: (item: T) => React.ReactNode;
}

function InfiniteMarquee<T>({ items, cardWidth, getKey, render }: MarqueeProps<T>) {
  const controls = useAnimationControls();
  const hoveredRef = useRef(false);
  const xRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Total width of one copy of the list
  const totalWidth = items.length * (cardWidth + CARD_GAP);

  useEffect(() => {
    xRef.current = 0;
    lastTimeRef.current = 0;

    const tick = (now: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = now;
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (!hoveredRef.current) {
        xRef.current -= (SCROLL_SPEED * dt) / 1000;
        if (xRef.current <= -totalWidth) xRef.current += totalWidth;
        controls.set({ x: xRef.current });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [controls, totalWidth]);

  const doubled = [...items, ...items];

  return (
    <Box
      sx={{
        overflow: "hidden",
        maskImage: "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        py: 2,
      }}
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      <motion.div
        animate={controls}
        style={{ display: "flex", gap: CARD_GAP, width: "max-content", willChange: "transform" }}
      >
        {doubled.map((item, i) => (
          <React.Fragment key={`${getKey(item)}-${i}`}>{render(item)}</React.Fragment>
        ))}
      </motion.div>
    </Box>
  );
}

// ── Wrapped grid (few items) ──────────────────────────────────────
function WrappedGrid<T>({ items, getKey, render }: Omit<MarqueeProps<T>, "cardWidth">) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: `${CARD_GAP}px`, justifyContent: "center", alignItems: "stretch" }}>
      {items.map((item, i) => (
        <motion.div
          key={getKey(item)}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, type: "spring", stiffness: 220, damping: 22 }}
          style={{ display: "flex" }}
        >
          {render(item)}
        </motion.div>
      ))}
    </Box>
  );
}

// ── Main section ──────────────────────────────────────────────────
const Testimonials: React.FC = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const cardWidth = isXs ? 290 : 330;

  const [tab, setTab] = useState<TabKey>("recommendations");
  const [openCard, setOpenCard] = useState<CardData | null>(null);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLandingPageTestimonials()
      .then(setTestimonials)
      .catch(() => setError("Could not load student reviews right now."))
      .finally(() => setLoading(false));
  }, []);

  const studentCards = useMemo(() => testimonials.map(fromStudent), [testimonials]);
  const recCards = useMemo(() => linkedinRecommendations.map(fromRecommendation), []);

  const avgRating = useMemo(() => {
    if (!testimonials.length) return null;
    const sum = testimonials.reduce((s, t) => s + (t.rating || 0), 0);
    return (sum / testimonials.length).toFixed(1);
  }, [testimonials]);

  const renderCard = (d: CardData) => <ReviewCard d={d} width={cardWidth} onOpen={setOpenCard} />;

  const pillText =
    tab === "recommendations"
      ? `${recCards.length} recommendations`
      : avgRating
        ? `${avgRating} / 5 · ${testimonials.length} review${testimonials.length === 1 ? "" : "s"}`
        : null;

  return (
    <Box
      id="testimonials"
      sx={{ py: { xs: 8, md: 12 }, bgcolor: "#EFF6FF", position: "relative", overflow: "hidden" }}
    >
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 10% 50%, rgba(29,78,216,0.06) 0%, transparent 50%), radial-gradient(circle at 90% 50%, rgba(6,182,212,0.04) 0%, transparent 50%)`, pointerEvents: "none" }} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        {/* ── Section header ── */}
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, border: "1px solid rgba(6,182,212,0.3)", borderRadius: "50px", px: 2, py: 0.5, mb: 2.5, bgcolor: "rgba(6,182,212,0.08)" }}>
              <StarIcon sx={{ fontSize: 13, color: "#06B6D4" }} />
              <Typography sx={{ color: "#0891B2", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
                Reviews and recommendations
              </Typography>
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
            <Typography variant="h2" sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "#0A1628", fontSize: { xs: "1.7rem", sm: "2.2rem", md: "2.8rem" }, letterSpacing: "-0.025em", mb: 1.5 }}>
              Trusted by students, parents and educators
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}>
            <Typography sx={{ color: "#64748B", fontSize: { xs: "0.9rem", md: "1.05rem" }, maxWidth: 560, mx: "auto", lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
              Real words from the families, students and school leaders who have worked with Math SuperHighway, on LinkedIn and on our own platform.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
              <Box sx={{ width: 48, height: 3, borderRadius: "2px", background: "linear-gradient(135deg, #06B6D4, #1D4ED8)" }} />
            </Box>
          </motion.div>
        </Box>

        {/* ── Tabs + pill ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
            borderBottom: "1px solid #DBEAFE",
            mb: 3,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_e, v: TabKey) => setTab(v)}
            variant="scrollable"
            scrollButtons={false}
            sx={{
              minHeight: 0,
              maxWidth: "100%",
              "& .MuiTabs-indicator": { height: 3, bgcolor: "#0A1628", borderRadius: "2px" },
              "& .MuiTab-root": {
                textTransform: "none",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                color: "#94A3B8",
                minWidth: 0,
                minHeight: 0,
                px: 0,
                mr: { xs: 2.5, md: 4 },
                py: 1.5,
              },
              "& .MuiTab-root.Mui-selected": { color: "#0A1628" },
            }}
          >
            <Tab value="recommendations" label="Recommendations" disableRipple />
            <Tab value="students" label="Student reviews" disableRipple />
          </Tabs>

          {pillText && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.6,
                mb: { xs: 1.5, sm: 0 },
                borderRadius: "10px",
                bgcolor: "rgba(6,182,212,0.1)",
                color: "#0E7490",
                fontWeight: 700,
                fontSize: "0.82rem",
                fontFamily: "'Inter', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              <StarIcon sx={{ fontSize: 16, color: "#06B6D4" }} />
              {pillText}
            </Box>
          )}
        </Box>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "recommendations" ? (
              <>
                {recCards.length > WRAP_THRESHOLD ? (
                  <InfiniteMarquee items={recCards} cardWidth={cardWidth} getKey={(d) => d.id} render={renderCard} />
                ) : (
                  <WrappedGrid items={recCards} getKey={(d) => d.id} render={renderCard} />
                )}

                {LINKEDIN_PROFILE_URL && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button
                      component="a"
                      href={LINKEDIN_PROFILE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      startIcon={<LinkedInIcon />}
                      endIcon={<OpenInNewIcon sx={{ fontSize: "16px !important" }} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: "10px",
                        px: 3,
                        py: 1.1,
                        color: LI_BLUE,
                        borderColor: "rgba(10,102,194,0.4)",
                        bgcolor: "#fff",
                        "&:hover": { borderColor: LI_BLUE, bgcolor: "rgba(10,102,194,0.04)" },
                      }}
                    >
                      See all recommendations on LinkedIn
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <>
                {error && <Alert severity="info" sx={{ mb: 4, borderRadius: "10px" }}>{error}</Alert>}

                {loading ? (
                  <Typography sx={{ textAlign: "center", color: "#64748B" }}>Loading reviews…</Typography>
                ) : studentCards.length > 0 ? (
                  studentCards.length > WRAP_THRESHOLD ? (
                    <InfiniteMarquee items={studentCards} cardWidth={cardWidth} getKey={(d) => d.id} render={renderCard} />
                  ) : (
                    <WrappedGrid items={studentCards} getKey={(d) => d.id} render={renderCard} />
                  )
                ) : (
                  !error && (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                      <Typography sx={{ color: "#64748B", fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
                        Our students are hard at work! Check back later for their success stories.
                      </Typography>
                    </Box>
                  )
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>

      <ReviewDialog d={openCard} onClose={() => setOpenCard(null)} fullScreen={isXs} />
    </Box>
  );
};

export default Testimonials;