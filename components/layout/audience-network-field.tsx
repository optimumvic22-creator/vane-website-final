"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { buildAudienceNetwork, containedVideoBounds, videoNetworkClearance, type NetworkAudience, type NetworkClearance } from "./audience-network";
import { observeAudienceNetwork } from "./audience-network-observer";

type FieldSnapshot = {
  left: number;
  top: number;
  width: number;
  height: number;
  clearance: NetworkClearance;
  videoClearance?: NetworkClearance;
  graph: ReturnType<typeof buildAudienceNetwork>;
};

export function AudienceNetworkField({ audience, isActive, reduceMotion }: {
  audience: NetworkAudience;
  isActive: boolean;
  reduceMotion: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef("");
  // Matches all three supplied posters before video metadata is available.
  const videoAspectRef = useRef(9 / 16);
  const refreshRef = useRef<(() => void) | null>(null);
  const [snapshot, setSnapshot] = useState<FieldSnapshot | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const fan = container?.closest("[data-audience-fan]");
    const label = container?.parentElement?.querySelector(`#${audience}-title`)?.parentElement;
    const video = container?.parentElement?.querySelector("video");
    if (!container || !fan || !label) return;
    const measure = (area: DOMRect) => {
      const stage = container.getBoundingClientRect();
      const text = label.getBoundingClientRect();
      if (!area.width || !area.height) return;
      const clearance = {
        x: text.left + text.width / 2 - area.left,
        y: text.top + text.height / 2 - area.top,
        rx: text.width / 2 + 12,
        ry: text.height / 2 + 22,
      };
      let videoClearance: NetworkClearance | undefined;
      if (video) {
        if (video.videoWidth && video.videoHeight) videoAspectRef.current = video.videoWidth / video.videoHeight;
        const frame = video.getBoundingClientRect();
        const videoStyle = getComputedStyle(video);
        const [positionX, positionY] = videoStyle.objectPosition.split(" ");
        // Ignore transient hover scaling so repeated entry never reshuffles
        // the graph. The same CSS variable drives the coach's resting scale.
        const restingScale = parseFloat(videoStyle.getPropertyValue("--network-rest-scale")) || 1;
        const scaleRatio = restingScale / (parseFloat(videoStyle.scale) || 1);
        const width = Math.round(frame.width * scaleRatio);
        const height = Math.round(frame.height * scaleRatio);
        const position = (value: string) => value?.endsWith("%") ? parseFloat(value) / 100 : 0.5;
        const visible = containedVideoBounds({
          x: Math.round(frame.left + (frame.width - width) / 2 - area.left),
          y: Math.round(frame.top + (frame.height - height) / 2 - area.top),
          width, height,
        }, videoAspectRef.current, { x: position(positionX), y: position(positionY) });
        if (visible.width && visible.height) videoClearance = videoNetworkClearance(visible, audience, area.width);
      }
      const layout = {
        audience,
        width: Math.round(area.width),
        height: Math.round(area.height),
        junction: { x: stage.left + stage.width / 2 - area.left, y: stage.top + stage.height / 2 - area.top },
        clearance,
        videoClearance,
      };
      const geometry = JSON.stringify(layout);
      if (geometry === geometryRef.current) return;
      geometryRef.current = geometry;
      setSnapshot({
        left: area.left - stage.left,
        top: area.top - stage.top,
        width: layout.width,
        height: layout.height,
        clearance,
        videoClearance,
        graph: buildAudienceNetwork(layout),
      });
    };
    const stopObserving = observeAudienceNetwork(fan, [container, label, ...(video ? [video] : [])], measure);
    const onMetadata = () => measure(fan.getBoundingClientRect());
    refreshRef.current = onMetadata;
    video?.addEventListener("loadedmetadata", onMetadata);
    return () => {
      stopObserving();
      refreshRef.current = null;
      video?.removeEventListener("loadedmetadata", onMetadata);
    };
  }, [audience]);

  // Activation may follow a position-only layout change (not a resize).
  // Recheck once, with the geometry key preventing unnecessary graph rebuilds.
  useEffect(() => {
    if (isActive) refreshRef.current?.();
  }, [isActive]);

  const graph = snapshot?.graph;
  const haloId = `network-halo-${audience}`;
  const quietId = `network-quiet-${audience}`;
  const textQuietId = `network-text-quiet-${audience}`;
  const maskId = `network-mask-${audience}`;

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
      {snapshot && graph ? (
        <svg
          data-audience-network={audience}
          data-network-nodes={graph.nodes.length}
          data-network-edges={graph.edges.length}
          data-network-video-clearance={JSON.stringify(snapshot.videoClearance)}
          focusable="false"
          viewBox={`0 0 ${snapshot.width} ${snapshot.height}`}
          className="absolute text-[var(--mqs-value-inv)]"
          style={{ left: snapshot.left, top: snapshot.top, width: snapshot.width, height: snapshot.height }}
        >
          <defs>
            <radialGradient id={haloId}>
              <stop offset="0" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="0.35" stopColor="currentColor" stopOpacity="0.12" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={quietId}>
              <stop offset="0.6667" stopColor="#000" />
              <stop offset="0.8" stopColor="#000" stopOpacity="0.55" />
              <stop offset="0.92" stopColor="#000" stopOpacity="0.14" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={textQuietId}>
              <stop offset="0.8" stopColor="#000" />
              <stop offset="0.9" stopColor="#000" stopOpacity="0.45" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={snapshot.width} height={snapshot.height} style={{ maskType: "luminance" }}>
              <rect width={snapshot.width} height={snapshot.height} fill="#fff" />
              <ellipse cx={snapshot.clearance.x} cy={snapshot.clearance.y} rx={snapshot.clearance.rx * 1.25} ry={snapshot.clearance.ry * 1.25} fill={`url(#${textQuietId})`} />
              {snapshot.videoClearance && <ellipse cx={snapshot.videoClearance.x} cy={snapshot.videoClearance.y} rx={snapshot.videoClearance.rx * 1.5} ry={snapshot.videoClearance.ry * 1.5} fill={`url(#${quietId})`} />}
            </mask>
          </defs>
          <g mask={`url(#${maskId})`}>
          <AnimatePresence initial={false}>
            {isActive ? (
              <motion.g
                key={audience}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.38, ease: "easeOut" }}
              >
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d={graph.paths.fine} strokeWidth="0.45" strokeOpacity="0.17" />
                  <path d={graph.paths.main} strokeWidth="0.65" strokeOpacity="0.28" />
                  <path d={graph.paths.bridge} strokeWidth="0.7" strokeOpacity="0.32" />
                </g>
                <motion.g
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.08 }}
                  fill="currentColor"
                >
                  <path d={graph.paths.far} fillOpacity="0.36" />
                  <path d={graph.paths.mid} fillOpacity="0.58" />
                  <path d={graph.paths.near} fillOpacity="0.82" />
                  {graph.hubs.map((index) => {
                    const node = graph.nodes[index];
                    return <g key={index}>
                      <circle cx={node.x} cy={node.y} r="8" fill={`url(#${haloId})`} />
                      <circle cx={node.x} cy={node.y} r="3.3" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.42" />
                    </g>;
                  })}
                </motion.g>
                {!reduceMotion && graph.signalPaths.map((path, index) => (
                  <motion.path
                    key={path}
                    d={path}
                    pathLength="1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.64"
                    strokeLinecap="round"
                    strokeDasharray="0.12 0.88"
                    initial={{ strokeDashoffset: 1 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 3.4 + index * 0.45, delay: 0.35 + index * 0.6, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }}
                  />
                ))}
              </motion.g>
            ) : null}
          </AnimatePresence>
          </g>
        </svg>
      ) : null}
    </div>
  );
}
