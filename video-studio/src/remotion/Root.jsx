import React from 'react';
import { Composition } from 'remotion';
import { DesignScene } from './compositions/DesignScene.jsx';
import { TitleCard } from './compositions/TitleCard.jsx';
import { LowerThird } from './compositions/LowerThird.jsx';
import { StatCounter } from './compositions/StatCounter.jsx';
import { SectionSting } from './compositions/SectionSting.jsx';
import { GcpTimeline, GcpBars, GcpGrid, GcpLedger } from './compositions/GcpCharts.jsx';

// Every composition takes its size, fps and length from its props, so the
// pipeline can render any of them at the project's output format.
const metadata = ({ props }) => ({
  durationInFrames: Math.max(1, Math.round((props.duration ?? 4) * (props.fps ?? 30))),
  fps: props.fps ?? 30,
  width: props.width ?? 1920,
  height: props.height ?? 1080,
});

const common = { durationInFrames: 120, fps: 30, width: 1920, height: 1080, calculateMetadata: metadata };

export const Root = () => (
  <>
    <Composition id="DesignScene" component={DesignScene} {...common}
      defaultProps={{ duration: 4, background: '#0b0b12', layers: [] }} />
    <Composition id="TitleCard" component={TitleCard} {...common}
      defaultProps={{ duration: 4, title: 'Your Title', subtitle: 'A subtitle line', accent: '#7c5cff', background: '#0b0b12', color: '#ffffff' }} />
    <Composition id="LowerThird" component={LowerThird} {...common}
      defaultProps={{ duration: 5, name: 'Jane Doe', role: 'Director', accent: '#7c5cff', transparent: true }} />
    <Composition id="StatCounter" component={StatCounter} {...common}
      defaultProps={{ duration: 4, value: 1250000, prefix: '', suffix: '+', label: 'Happy users', accent: '#22c55e', background: '#0b0b12', decimals: 0 }} />
    <Composition id="SectionSting" component={SectionSting} {...common}
      defaultProps={{ duration: 7, title: 'FRONT PAGE', kicker: 'GOLD COAST PALAVA', subtitle: 'A sample from the archive', number: '03', stingAt: 0.8, stingDur: 5 }} />
    <Composition id="GcpTimeline" component={GcpTimeline} {...common} defaultProps={{ duration: 6, width: 1280, height: 720, items: [], spans: [] }} />
    <Composition id="GcpBars" component={GcpBars} {...common} defaultProps={{ duration: 6, width: 1280, height: 720, bars: [] }} />
    <Composition id="GcpGrid" component={GcpGrid} {...common} defaultProps={{ duration: 6, width: 1280, height: 720 }} />
    <Composition id="GcpLedger" component={GcpLedger} {...common} defaultProps={{ duration: 6, width: 1280, height: 720, rows: [] }} />
  </>
);
