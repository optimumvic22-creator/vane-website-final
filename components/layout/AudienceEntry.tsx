"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { useMediaPlayback } from "@/lib/use-media-playback";
import { useMotionPaused } from "@/lib/motion-preference";
import { AudienceNetworkField } from "./audience-network-field";

const ENTRY_BAND_HEIGHT =
  "calc(max(var(--entry-intro-min), clamp(220px, 27svh, 260px), clamp(220px, calc(656px - 100vw), 300px)) + env(safe-area-inset-top))";
const PULSE_LENGTH_RATIO = 1;
const TRACER_DURATION = 1.16;
const TRACER_EASE = [0.4, 0, 0.2, 1] as const;
const AUDIENCE_VIDEO_TIMING = {
  athlete: { rest: 0.95, loopStart: 0.45, loopEnd: 4.65 },
  coach: { rest: 0.35, loopStart: 0.15, loopEnd: 4.1 },
  partner: { rest: 1.2, loopStart: 0.8, loopEnd: 10.5 },
} as const;
const AUDIENCE_VIDEO_EDGE_MASK =
  "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.22) 18%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.94) 47%, #000 50%, rgba(0,0,0,0.94) 53%, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.22) 82%, rgba(0,0,0,0.08) 92%, transparent 100%)";
const COACH_VIDEO_EDGE_MASK =
  "radial-gradient(ellipse 42% 48% at 50% 50%, #000 0%, #000 18%, rgba(0,0,0,0.98) 28%, rgba(0,0,0,0.9) 39%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.62) 65%, rgba(0,0,0,0.45) 76%, rgba(0,0,0,0.29) 85%, rgba(0,0,0,0.15) 92%, rgba(0,0,0,0.06) 97%, transparent 100%)";
const PARTNER_VIDEO_EDGE_MASK =
  "radial-gradient(ellipse 44% 48% at 52% 48%, #000 0%, #000 20%, rgba(0,0,0,0.98) 29%, rgba(0,0,0,0.92) 39%, rgba(0,0,0,0.82) 49%, rgba(0,0,0,0.68) 59%, rgba(0,0,0,0.52) 69%, rgba(0,0,0,0.36) 79%, rgba(0,0,0,0.22) 87%, rgba(0,0,0,0.11) 93%, rgba(0,0,0,0.04) 97%, transparent 100%)";

type AudienceSlug = "athlete" | "coach" | "partner";

const roles = [
  {
    slug: "athlete",
    image: "/audiences/athlete-placeholder.png",
    video: "/media/audience-entry/athlete-dario-acceleration-web.mp4",
    poster: "/media/audience-entry/athlete-poster.webp",
    videoWrapperClass:
      "absolute left-1/2 top-[-3%] h-[58%] aspect-[9/16] -translate-x-1/2",
    videoObjectClass: "object-contain",
    videoMask: AUDIENCE_VIDEO_EDGE_MASK,
    videoToneClass:
      "brightness-[1.08] group-hover:scale-[1.05] group-focus-visible:scale-[1.05]",
    objectPosition: "center 72%",
    mediaClass: "scale-[1.06] translate-y-[3%]",
    tracerBranches: [
      { path: "M 50 50 L 0 21.1325", length: 57.735 },
      { path: "M 50 50 L 100 21.1325", length: 57.735 },
    ],
    clipPath: "polygon(50% 50%, 0% 21.1325%, 0% 0%, 100% 0%, 100% 21.1325%)",
    contentClass: "items-center text-center",
    contentStyle: {
      left: "50%",
      top: "calc(50% - var(--entry-athlete-offset) + 2mm)",
      transform: "translate(-50%, -50%)",
    },
    overlayClass:
      "bg-[linear-gradient(180deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.38)_52%,rgba(0,0,0,0.62)_100%)] transition-opacity duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:duration-[620ms] group-hover:opacity-70 group-focus-visible:duration-[620ms] group-focus-visible:opacity-70 motion-reduce:transition-none",
    en: {
      title: "Athlete",
      description: "MAKE MOVEMENT QUALITY YOUR ADVANTAGE",
    },
    de: {
      title: "Athlet",
      description: "MACH BEWEGUNGSQUALITÄT ZU DEINEM VORTEIL",
    },
  },
  {
    slug: "coach",
    image: "/audiences/coach-placeholder.png",
    video: "/media/audience-entry/coach-niklas-cmj-web.mp4",
    poster: "/media/audience-entry/coach-poster.webp",
    videoWrapperClass:
      "absolute left-[calc(50%_-_25vw)] top-[29%] h-[62%] aspect-[9/16] -translate-x-1/2 md:left-[25%] md:top-[25.5%] md:h-[49%]",
    videoObjectClass: "object-contain object-center",
    videoMask: COACH_VIDEO_EDGE_MASK,
    videoToneClass:
      "[--network-rest-scale:0.74] md:[--network-rest-scale:1] scale-[var(--network-rest-scale)] group-hover:scale-[0.78] group-focus-visible:scale-[0.78] md:group-hover:scale-[1.02] md:group-focus-visible:scale-[1.02]",
    objectPosition: "center 22%",
    mediaClass: "scale-[1.02]",
    tracerBranches: [
      { path: "M 50 50 L 50 100", length: 50 },
      { path: "M 50 50 L 0 21.1325", length: 57.735 },
    ],
    clipPath: "polygon(50% 50%, 50% 100%, 0% 100%, 0% 21.1325%)",
    contentClass: "items-center text-center",
    contentStyle: {
      left: "calc(50% - clamp(76px, 26vw, 420px))",
      top: "calc(50% + clamp(24px, 5svh, 52px) - clamp(0px, calc(30vw - 190px), 110px))",
      transform: "translate(-50%, 0)",
    },
    overlayClass:
      "bg-black/40 transition-opacity duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:duration-[620ms] group-hover:opacity-70 group-focus-visible:duration-[620ms] group-focus-visible:opacity-70 motion-reduce:transition-none",
    en: {
      title: "Coach",
      description: "DATA TO SUPPORT YOUR DECISIONS",
    },
    de: {
      title: "Coach",
      description: "DATEN FÜR DEINE ENTSCHEIDUNGEN",
    },
  },
  {
    slug: "partner",
    image: "/audiences/partner-placeholder.png",
    video: "/media/audience-entry/partner-dario-milan-presentation.mp4",
    poster: "/media/audience-entry/partner-poster.webp",
    videoWrapperClass:
      "absolute left-[calc(50%_+_25vw_-_19px)] top-[29%] h-[62%] aspect-[9/16] -translate-x-1/2 md:left-[73%] md:top-[25.5%] md:h-[49%]",
    videoObjectClass: "object-contain object-center",
    videoMask: PARTNER_VIDEO_EDGE_MASK,
    videoToneClass:
      "group-hover:scale-[1.04] group-focus-visible:scale-[1.04]",
    objectPosition: "center 24%",
    mediaClass: "scale-[1.02]",
    tracerBranches: [
      { path: "M 50 50 L 100 21.1325", length: 57.735 },
      { path: "M 50 50 L 50 100", length: 50 },
    ],
    clipPath: "polygon(50% 50%, 100% 21.1325%, 100% 100%, 50% 100%)",
    contentClass: "items-center text-center",
    contentStyle: {
      left: "calc(50% + clamp(76px, 26vw, 420px))",
      top: "calc(50% + clamp(24px, 5svh, 52px) - clamp(0px, calc(30vw - 190px), 110px))",
      transform: "translate(-50%, 0)",
    },
    overlayClass:
      "bg-[linear-gradient(90deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.76)_100%)] transition-opacity duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:duration-[620ms] group-hover:opacity-70 group-focus-visible:duration-[620ms] group-focus-visible:opacity-70 motion-reduce:transition-none",
    en: {
      title: "Partner",
      description: "INTEGRATE A MOVEMENT QUALITY STANDARD",
    },
    de: {
      title: "Partner",
      description: "INTEGRIERE EINEN STANDARD FÜR BEWEGUNGSQUALITÄT",
    },
  },
] as const;

export function AudienceEntry() {
  const { locale, setLocale, dismissGate } = useLocale();
  const systemReducedMotion = useReducedMotion();
  const motionPaused = useMotionPaused();
  const reduceMotion = systemReducedMotion || motionPaused;
  const { mediaContainerRef, mediaAllowed, mediaSourceAllowed } = useMediaPlayback<HTMLElement>({ minVisibleRatio: 0.01 });
  const [failedAudiences, setFailedAudiences] = useState<ReadonlySet<AudienceSlug>>(() => new Set());
  const athleteVideoRef = useRef<HTMLVideoElement>(null);
  const coachVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);
  const activatedVideosRef = useRef(new Set<AudienceSlug>());
  const [activeAudience, setActiveAudience] = useState<
    (typeof roles)[number]["slug"] | null
  >(null);
  const isGerman = locale === "de";
  const activeRole = roles.find((role) => role.slug === activeAudience);

  useEffect(() => {
    const elements = [athleteVideoRef.current, coachVideoRef.current, partnerVideoRef.current];
    return () => elements.forEach((video) => {
      if (!video) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
    });
  }, []);

  useEffect(() => {
    const videos = [
      {
        audience: "athlete",
        element: athleteVideoRef.current,
        restTime: AUDIENCE_VIDEO_TIMING.athlete.rest,
      },
      {
        audience: "coach",
        element: coachVideoRef.current,
        restTime: AUDIENCE_VIDEO_TIMING.coach.rest,
      },
      {
        audience: "partner",
        element: partnerVideoRef.current,
        restTime: AUDIENCE_VIDEO_TIMING.partner.rest,
      },
    ] as const;
    const cleanups: Array<() => void> = [];

    videos.forEach(({ audience, element, restTime }) => {
      if (!element) {
        return;
      }

      if (!mediaAllowed || failedAudiences.has(audience)) {
        element.preload = "none";
        element.pause();
        if (!mediaSourceAllowed && element.currentSrc) {
          activatedVideosRef.current.delete(audience);
          element.removeAttribute("src");
          element.load();
        }
        return;
      }

      if (!reduceMotion) {
        const prepareTimeline = () => {
          if (activatedVideosRef.current.has(audience)) return;

          try {
            element.currentTime = restTime;
            activatedVideosRef.current.add(audience);
          } catch {
            // The media timeline may not be ready yet.
          }
        };
        const playWhenReady = () => {
          prepareTimeline();
          void element.play().catch(() => undefined);
        };

        element.preload = "auto";

        if (element.readyState >= HTMLMediaElement.HAVE_METADATA) {
          prepareTimeline();
        } else {
          element.addEventListener("loadedmetadata", prepareTimeline, {
            once: true,
          });
          cleanups.push(() =>
            element.removeEventListener("loadedmetadata", prepareTimeline),
          );
        }

        if (element.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          playWhenReady();
          return;
        }

        element.addEventListener("canplay", playWhenReady, { once: true });
        cleanups.push(() =>
          element.removeEventListener("canplay", playWhenReady),
        );
        element.load();
        return;
      }

      element.pause();
      element.preload = "none";
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [reduceMotion, mediaAllowed, mediaSourceAllowed, failedAudiences]);

  const selectLanguage = (language: "en" | "de") => {
    setLocale(language);
    dismissGate();
  };

  const selectAudience = (audience: string) => {
    setLocale(locale);
    dismissGate();
    trackEvent("audience_select", {
      audience,
      locale,
    });
  };

  const activateAudience = (audience: AudienceSlug) => {
    setActiveAudience(audience);
  };

  const deactivateAudience = (audience: AudienceSlug) => {
    setActiveAudience((current) =>
      current === audience ? null : current,
    );
  };

  return (
    <section
      ref={mediaContainerRef}
      className="relative overflow-hidden bg-[#050607] [--entry-intro-min:320px] [--entry-mobile-junction-min:240px] [--entry-athlete-offset:clamp(128px,35vw,160px)] md:[--entry-intro-min:0px] md:[--entry-mobile-junction-min:0px] md:[--entry-athlete-offset:clamp(86px,max(20svh,min(32svh,19vw)),290px)]"
      style={{ minHeight: "max(100svh, 680px)" }}
    >
      <div
        className="absolute inset-x-0 top-0 z-40 bg-[#050607]"
        style={{ height: ENTRY_BAND_HEIGHT }}
      >
        <header className="absolute inset-x-0 top-0 z-50 mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] max-[359px]:px-3 md:px-8 md:pb-6 md:pt-[calc(1.5rem+env(safe-area-inset-top))]">
          <Link
            href="/"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center whitespace-nowrap text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          >
            <Image
              src="/vane-science-wordmark.png"
              alt="VANE Science"
              width={770}
              height={100}
              sizes="(min-width: 768px) 146px, 139px"
              className="h-[18px] w-auto md:h-[19px]"
            />
          </Link>
          <div className="flex items-center gap-1 md:gap-2">
          <div
            className="flex shrink-0 items-center rounded-full border border-white/8 bg-black/25 p-1 backdrop-blur-md max-[359px]:p-0"
            role="group"
            aria-label={isGerman ? "Sprache" : "Language"}
          >
            <button
              type="button"
              onClick={() => selectLanguage("en")}
              aria-pressed={!isGerman}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs font-medium text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border transition-colors ${
                  !isGerman
                    ? "border-[var(--mqs-accent)]/70 bg-[var(--mqs-accent)]/14 text-[var(--mqs-value-inv)]"
                    : "border-transparent"
                }`}
              >
                EN
              </span>
            </button>
            <button
              type="button"
              onClick={() => selectLanguage("de")}
              aria-pressed={isGerman}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs font-medium text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border transition-colors ${
                  isGerman
                    ? "border-[var(--mqs-accent)]/70 bg-[var(--mqs-accent)]/14 text-[var(--mqs-value-inv)]"
                    : "border-transparent"
                }`}
              >
                DE
              </span>
            </button>
          </div>
          </div>
        </header>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : 0.12,
          }}
          className="pointer-events-none absolute inset-x-0 bottom-[calc(clamp(18px,2.8svh,30px)-3mm)] z-40 px-5 text-center md:bottom-[clamp(18px,2.8svh,30px)]"
        >
          <p className="font-sans text-[clamp(12px,0.95vw,14px)] font-medium uppercase tracking-[0.10em] text-[var(--mqs-value-inv)]">
            {isGerman ? "Willkommen bei VANE" : "Welcome to VANE"}
          </p>
          <h1 className="mx-auto mt-2 max-w-[1440px] font-display text-[clamp(2.5rem,11vw,3.125rem)] font-[650] uppercase leading-[1.02] tracking-[0.012em] text-white sm:text-[clamp(3.075rem,5.43vw,5.64rem)]">
            Human Movement now has{" "}
            <span className="whitespace-nowrap">a language</span>
          </h1>
          <p className="mx-auto mt-3 max-w-full whitespace-normal text-balance font-sans text-[clamp(0.75rem,3.15vw,0.84375rem)] font-normal uppercase leading-[1.45] tracking-[0.04em] text-white/75 sm:text-[clamp(0.8125rem,1.1vw,1.0625rem)]">
            {isGerman
              ? "WIR MACHEN BEWEGUNGSQUALITÄT VERGLEICHBAR"
              : "WE MAKE MOVEMENT QUALITY COMPARABLE"}
          </p>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 z-30 h-3 bg-gradient-to-b from-[#050607] to-transparent"
        style={{ top: ENTRY_BAND_HEIGHT }}
      />

      <div
        data-audience-fan
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ top: ENTRY_BAND_HEIGHT }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
          className="absolute left-1/2 isolate aspect-square -translate-x-1/2 -translate-y-1/2 bg-[#08090A]"
          style={{
            // Narrow screens need enough visible wedge height below the intro
            // for the complete Athlete label, not an offset based on screen height.
            top: "max(var(--entry-mobile-junction-min), clamp(41%, calc(33.333% + 13.25vw), 68%))",
            width: "max(122vmax, 1100px)",
          }}
        >
          {roles.map((role) => {
            const copy = isGerman ? role.de : role.en;

            return (
              <Link
                key={role.slug}
                href={`/for/${role.slug}`}
                onClick={() => selectAudience(role.slug)}
                onMouseEnter={() => activateAudience(role.slug)}
                onMouseLeave={() => deactivateAudience(role.slug)}
                onFocus={() => activateAudience(role.slug)}
                onBlur={() => deactivateAudience(role.slug)}
                className="group absolute inset-0 z-10 overflow-hidden focus-visible:z-20 focus-visible:outline-none"
                style={{ clipPath: role.clipPath }}
                aria-labelledby={`${role.slug}-title`}
                aria-describedby={`${role.slug}-description`}
              >
                <div className={`absolute inset-0 ${role.mediaClass}`}>
                  <div
                    className={role.videoWrapperClass}
                    style={{
                      maskImage: role.videoMask,
                      WebkitMaskImage: role.videoMask,
                    }}
                  >
                    <video
                      ref={
                        role.slug === "athlete"
                          ? athleteVideoRef
                          : role.slug === "coach"
                            ? coachVideoRef
                            : partnerVideoRef
                      }
                      src={
                          mediaSourceAllowed && !failedAudiences.has(role.slug)
                          ? role.video
                          : undefined
                      }
                      poster={role.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      tabIndex={-1}
                      onError={(event) => {
                        if (mediaAllowed && event.currentTarget.getAttribute("src") === role.video) {
                          setFailedAudiences((current) => new Set(current).add(role.slug));
                        }
                      }}
                      onTimeUpdate={(event) => {
                        if (
                          event.currentTarget.currentTime >=
                          AUDIENCE_VIDEO_TIMING[role.slug].loopEnd
                        ) {
                          event.currentTarget.currentTime =
                            AUDIENCE_VIDEO_TIMING[role.slug].loopStart;
                        }
                      }}
                      className={`h-full w-full ${role.videoObjectClass} ${role.videoToneClass} transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:duration-[620ms] group-focus-visible:duration-[620ms] motion-reduce:transition-none`}
                      style={{ objectPosition: role.objectPosition }}
                    />
                    {role.slug === "coach" ? (
                      <>
                        <span className="pointer-events-none absolute inset-y-0 left-0 w-[36%] bg-gradient-to-r from-[#08090A] via-[#08090A]/60 to-transparent" />
                        <span className="pointer-events-none absolute inset-y-0 right-0 w-[36%] bg-gradient-to-l from-[#08090A] via-[#08090A]/60 to-transparent" />
                        <span className="pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-[#08090A] via-[#08090A]/55 to-transparent" />
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#08090A] via-[#08090A]/55 to-transparent" />
                      </>
                    ) : null}
                  </div>
                </div>
                <div className={`absolute inset-0 ${role.overlayClass}`} />
                <div className="absolute inset-0 bg-black/[0.50] transition-colors duration-500 group-hover:bg-black/[0.12] group-focus-visible:bg-black/[0.12] motion-reduce:transition-none" />
                <AudienceNetworkField
                  audience={role.slug}
                  isActive={activeAudience === role.slug}
                  reduceMotion={Boolean(reduceMotion)}
                />

                <div
                  className={`absolute z-10 flex w-[calc(50vw-24px)] flex-col sm:w-[clamp(180px,26vw,430px)] ${role.slug === "athlete" ? "max-sm:w-[min(64vw,270px)]" : ""} ${role.contentClass} ${
                    role.slug === "coach"
                      ? "max-[359px]:translate-x-2 max-sm:translate-y-[clamp(-36px,calc(49svh-362px),78px)]"
                      : role.slug === "partner"
                        ? "max-[359px]:-translate-x-2 max-sm:translate-y-[clamp(-36px,calc(49svh-362px),78px)]"
                        : ""
                  }`}
                  style={role.contentStyle}
                >
                  <h2
                    id={`${role.slug}-title`}
                    className="origin-center whitespace-nowrap rounded-sm px-2 py-1 font-display text-[clamp(2.17rem,4.8vw,4.85rem)] min-[360px]:text-[clamp(2.25rem,5vw,5rem)] font-bold uppercase leading-none tracking-[0.015em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-[color,scale] duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.09] group-hover:duration-[620ms] group-hover:text-[var(--mqs-value-inv)] group-focus-visible:scale-[1.09] group-focus-visible:duration-[620ms] group-focus-visible:text-[var(--mqs-value-inv)] group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-black motion-reduce:transition-none"
                  >
                    {copy.title}
                  </h2>
                  <p
                    id={`${role.slug}-description`}
                    aria-label={copy.description}
                    className="mt-1.5 min-h-[1.25em] w-full whitespace-normal break-normal px-0 text-balance text-center font-sans text-[clamp(0.625rem,2.4vw,0.65rem)] font-normal uppercase leading-[1.35] tracking-[0.04em] text-white/75 transition-colors duration-[260ms] ease-out group-hover:text-white/85 group-focus-visible:text-white/85 sm:px-2 sm:text-[clamp(0.625rem,0.72vw,0.65rem)] sm:tracking-[0.05em] motion-reduce:transition-none"
                  >
                    {copy.description}
                  </p>
                </div>
              </Link>
            );
          })}

          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-30 h-full w-full"
          >
            <defs>
              <linearGradient
                id="seam-left"
                gradientUnits="userSpaceOnUse"
                x1="50"
                y1="50"
                x2="0"
                y2="21.1325"
              >
                <stop offset="0%" stopColor="#F4F1EC" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#F4F1EC" stopOpacity="0.27" />
                <stop offset="100%" stopColor="#F4F1EC" stopOpacity="0.14" />
              </linearGradient>
              <linearGradient
                id="seam-right"
                gradientUnits="userSpaceOnUse"
                x1="50"
                y1="50"
                x2="100"
                y2="21.1325"
              >
                <stop offset="0%" stopColor="#F4F1EC" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#F4F1EC" stopOpacity="0.27" />
                <stop offset="100%" stopColor="#F4F1EC" stopOpacity="0.14" />
              </linearGradient>
              <linearGradient
                id="seam-down"
                gradientUnits="userSpaceOnUse"
                x1="50"
                y1="50"
                x2="50"
                y2="100"
              >
                <stop offset="0%" stopColor="#F4F1EC" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#F4F1EC" stopOpacity="0.27" />
                <stop offset="100%" stopColor="#F4F1EC" stopOpacity="0.14" />
              </linearGradient>
              <filter
                id="audience-trail-glow"
                filterUnits="userSpaceOnUse"
                primitiveUnits="userSpaceOnUse"
                x="-4"
                y="-4"
                width="108"
                height="108"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="0.24"
                  result="pulse-glow"
                />
                <feMerge>
                  <feMergeNode in="pulse-glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g
              fill="none"
              stroke="#050607"
              strokeOpacity="0.92"
              strokeWidth="4.8"
            >
              <line
                x1="50"
                y1="50"
                x2="0"
                y2="21.1325"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="50"
                y1="50"
                x2="100"
                y2="21.1325"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="100"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <g fill="none" strokeWidth="1.25">
              <line
                x1="50"
                y1="50"
                x2="0"
                y2="21.1325"
                stroke="url(#seam-left)"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="50"
                y1="50"
                x2="100"
                y2="21.1325"
                stroke="url(#seam-right)"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="100"
                stroke="url(#seam-down)"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            <AnimatePresence initial={false} mode="sync">
              {activeRole ? (
                <motion.g
                  key={activeRole.slug}
                  fill="none"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.1,
                    ease: "easeOut",
                  }}
                >
                  {activeRole.tracerBranches.map((branch) => {
                    const pulseLength =
                      branch.length * PULSE_LENGTH_RATIO;

                    return reduceMotion ? (
                      <path
                        key={branch.path}
                        d={branch.path}
                        stroke="var(--mqs-accent)"
                        strokeOpacity="0.72"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.9"
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : (
                      <motion.path
                        key={branch.path}
                        d={branch.path}
                        stroke="var(--mqs-accent)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="0.14"
                        filter="url(#audience-trail-glow)"
                        strokeDasharray={`${pulseLength} 500`}
                        initial={{ strokeDashoffset: pulseLength }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{
                          strokeDashoffset: {
                            duration: TRACER_DURATION,
                            ease: TRACER_EASE,
                          },
                        }}
                      />
                    );
                  })}
                </motion.g>
              ) : null}
            </AnimatePresence>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
