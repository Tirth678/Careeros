import { useId } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Bar, BarChart, BarLineIndicator, BarXAxis, ChartTooltip, Grid, LinearGradient, useChart } from './ui/bar-chart';
import type { StudentSkillDTO } from '../lib/models';
import './skills-chart.css';

function ProficiencyAxis() {
  const { yScale } = useChart();
  return <g>{[0, 25, 50, 75, 100].map(value => <text key={value} x={-10} y={yScale(value)} dy="0.35em" textAnchor="end" fill="#71717a" fontSize={11}>{value}%</text>)}</g>;
}

export default function SkillsChart({ skills }: { skills: StudentSkillDTO[] }) {
  const gradientId = useId().replace(/:/g, '');
  const reduced = useReducedMotion();
  const data = skills.slice(0, 8).map(skill => ({ name: skill.name, proficiency: skill.proficiency }));
  return <div className="skills-chart">
    <div className="overflow-x-auto pb-2" tabIndex={0} role="region" aria-label="Skill proficiency chart, scroll horizontally on small screens">
      <div style={{ minWidth: Math.max(360, data.length * 110) }}>
        <BarChart data={data} xDataKey="name" valueMax={100} barGap={0} aspectRatio="auto" className="h-[300px]" margin={{ left: 48, right: 18, top: 20, bottom: 45 }} animationDuration={reduced ? 0 : 700}>
          <LinearGradient id={gradientId} from="#a855f7" fromOpacity={0.65} to="#7c3aed" toOpacity={0.025} />
          <Grid horizontal rowTickValues={[0, 25, 50, 75, 100]} stroke="#ffffff0d" fadeHorizontal={false} />
          <ProficiencyAxis />
          <Bar dataKey="proficiency" fill={`url(#${gradientId})`} stroke="#c084fc" lineCap="butt" animate={!reduced} />
          <BarXAxis showAllLabels />
          <BarLineIndicator data={data} valueKey="proficiency" xKey="name" stroke="#c084fc" strokeWidth={2} />
          <ChartTooltip showCrosshair={false} showDots={false} rows={point => [{ label: 'Proficiency', value: `${point.proficiency}%`, color: '#c084fc' }]} />
        </BarChart>
      </div>
    </div>
    <p className="mt-3 text-xs text-text-dim">Proficiency · 0–100% scale{skills.length > 8 ? ' · First 8 skills in the selected order' : ''}. Full values are listed below.</p>
  </div>;
}
