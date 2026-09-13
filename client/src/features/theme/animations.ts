import { css, keyframes } from "styled-components";

const FADE_DURATION = "600ms";
const FADE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const FADE_UP_DISTANCE = "24px";
const FADE_DOWN_DISTANCE = "12px";
const STAGGER_CHILD_COUNT = 12;
const STAGGER_STEP_MS = 80;

export const fadeInKeyframes = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const fadeInUpKeyframes = keyframes`
  from {
    opacity: 0;
    transform: translateY(${FADE_UP_DISTANCE});
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDownKeyframes = keyframes`
  from {
    opacity: 0;
    transform: translateY(-${FADE_DOWN_DISTANCE});
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeIn = (delayMs = 0) => css`
  animation: ${fadeInKeyframes} ${FADE_DURATION} ${FADE_EASING} ${delayMs}ms both;
`;

export const fadeInUp = (delayMs = 0) => css`
  animation: ${fadeInUpKeyframes} ${FADE_DURATION} ${FADE_EASING} ${delayMs}ms both;
`;

export const fadeInDown = (delayMs = 0) => css`
  animation: ${fadeInDownKeyframes} ${FADE_DURATION} ${FADE_EASING} ${delayMs}ms both;
`;

export const staggerFadeInUp = (
  fromDelayMs = 0,
  stepMs = STAGGER_STEP_MS,
  childSelector = "& > *",
) => css`
  ${Array.from({ length: STAGGER_CHILD_COUNT }, (_, index) => css`
    ${childSelector}:nth-child(${index + 1}) {
      animation: ${fadeInUpKeyframes} ${FADE_DURATION} ${FADE_EASING} ${fromDelayMs + index * stepMs}ms both;
    }
  `)}
`;