import { motion, useReducedMotion, type Variants } from "motion/react";
import { createContext, useContext, type ReactNode, type SVGProps } from "react";

const ReducedCtx = createContext(false);

/** Variants for a genuine stroke-dasharray / stroke-dashoffset draw. */
function drawVariants(delay: number, duration: number, reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { pathLength: 1, opacity: 1 },
      visible: { pathLength: 1, opacity: 1 },
    };
  }
  return {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, duration, ease: [0.32, 0.12, 0.2, 1] },
        opacity: { delay, duration: 0.35 },
      },
    },
  };
}

function popVariants(delay: number, reduced: boolean): Variants {
  if (reduced) return { hidden: { opacity: 1, scale: 1 }, visible: { opacity: 1, scale: 1 } };
  return {
    hidden: { opacity: 0, scale: 0.2 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };
}

type Clean<T> = Omit<
  T,
  "ref" | "style" | "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface StageProps extends Clean<SVGProps<SVGSVGElement>> {
  children: ReactNode;
  /** viewport amount before the drawing starts */
  amount?: number;
  /** draw immediately instead of on scroll */
  immediate?: boolean;
}

/**
 * Wraps an SVG and orchestrates every <DrawPath> inside it. The drawing
 * starts when the artwork scrolls into view, once.
 */
export function HennaStage({ children, amount = 0.35, immediate = false, ...rest }: StageProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <ReducedCtx.Provider value={reduced}>
      <motion.svg
        initial="hidden"
        {...(immediate
          ? { animate: "visible" }
          : { whileInView: "visible", viewport: { once: true, amount } })}
        fill="none"
        aria-hidden="true"
        focusable="false"
        {...rest}
      >
        {children}
      </motion.svg>
    </ReducedCtx.Provider>
  );
}

interface DrawPathProps extends Clean<SVGProps<SVGPathElement>> {
  d: string;
  delay?: number;
  duration?: number;
}

export function DrawPath({ d, delay = 0, duration = 1.8, ...rest }: DrawPathProps) {
  const reduced = useContext(ReducedCtx);
  return (
    <motion.path
      d={d}
      variants={drawVariants(delay, duration, reduced)}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      {...(rest as object)}
    />
  );
}

interface DrawCircleProps extends Clean<SVGProps<SVGCircleElement>> {
  cx: number;
  cy: number;
  r: number;
  delay?: number;
  duration?: number;
  /** outline circles draw, filled dots pop */
  mode?: "draw" | "dot";
}

export function DrawCircle({
  delay = 0,
  duration = 1.4,
  mode = "draw",
  ...rest
}: DrawCircleProps) {
  const reduced = useContext(ReducedCtx);
  return (
    <motion.circle
      variants={
        mode === "dot" ? popVariants(delay, reduced) : drawVariants(delay, duration, reduced)
      }
      {...(mode === "dot"
        ? { style: { transformOrigin: `${rest.cx}px ${rest.cy}px` } }
        : {})}
      {...(rest as object)}
    />
  );
}

/** Group that fades/scales in as part of the same choreography. */
export function DrawGroup({
  delay = 0,
  children,
  ...rest
}: { delay?: number; children: ReactNode } & Clean<SVGProps<SVGGElement>>) {
  const reduced = useContext(ReducedCtx);
  return (
    <motion.g variants={popVariants(delay, reduced)} {...(rest as object)}>
      {children}
    </motion.g>
  );
}
