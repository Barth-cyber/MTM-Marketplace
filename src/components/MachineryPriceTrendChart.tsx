import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TrendingUp, Info, RefreshCw, BarChart2, Eye, EyeOff } from 'lucide-react';

export interface TrendDataPoint {
  date: string; // e.g. "2025-09", "2025-10" etc.
  label: string; // e.g. "Sep '25"
  'Heavy Machinery & CNC': number;
  'Steel & Metals': number;
  'Logistics & Freight': number;
  'African Power & Gensets': number;
}

const HISTORICAL_PRICE_DATA: TrendDataPoint[] = [
  { date: '2025-09', label: "Sep '25", 'Heavy Machinery & CNC': 100.0, 'Steel & Metals': 100.0, 'Logistics & Freight': 100.0, 'African Power & Gensets': 100.0 },
  { date: '2025-11', label: "Nov '25", 'Heavy Machinery & CNC': 101.5, 'Steel & Metals': 99.2, 'Logistics & Freight': 103.4, 'African Power & Gensets': 104.1 },
  { date: '2026-01', label: "Jan '26", 'Heavy Machinery & CNC': 103.2, 'Steel & Metals': 97.8, 'Logistics & Freight': 106.8, 'African Power & Gensets': 108.5 },
  { date: '2026-03', label: "Mar '26", 'Heavy Machinery & CNC': 102.8, 'Steel & Metals': 96.5, 'Logistics & Freight': 109.1, 'African Power & Gensets': 111.0 },
  { date: '2026-05', label: "May '26", 'Heavy Machinery & CNC': 105.4, 'Steel & Metals': 98.1, 'Logistics & Freight': 111.5, 'African Power & Gensets': 114.2 },
  { date: '2026-07', label: "Jul '26", 'Heavy Machinery & CNC': 106.8, 'Steel & Metals': 97.5, 'Logistics & Freight': 113.0, 'African Power & Gensets': 116.8 },
  { date: '2026-09', label: "Sep '26", 'Heavy Machinery & CNC': 108.5, 'Steel & Metals': 98.2, 'Logistics & Freight': 114.2, 'African Power & Gensets': 119.4 },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Heavy Machinery & CNC': '#2563EB', // Blue
  'Steel & Metals': '#059669', // Emerald
  'Logistics & Freight': '#D97706', // Amber
  'African Power & Gensets': '#7C3AED', // Purple
};

interface MachineryPriceTrendChartProps {
  selectedCategoryFilter?: string;
}

export const MachineryPriceTrendChart: React.FC<MachineryPriceTrendChartProps> = ({
  selectedCategoryFilter = 'All'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [activeSeries, setActiveSeries] = useState<Record<string, boolean>>({
    'Heavy Machinery & CNC': true,
    'Steel & Metals': true,
    'Logistics & Freight': true,
    'African Power & Gensets': true,
  });

  const [hoveredData, setHoveredData] = useState<{
    label: string;
    date: string;
    values: Array<{ category: string; value: number; color: string }>;
  } | null>(null);

  const [timeRange, setTimeRange] = useState<'ALL' | '1Y' | '6M'>('ALL');

  // Filter series based on selected category chip if specific
  useEffect(() => {
    if (selectedCategoryFilter && selectedCategoryFilter !== 'All') {
      setActiveSeries({
        'Heavy Machinery & CNC': selectedCategoryFilter === 'Heavy Machinery & CNC',
        'Steel & Metals': selectedCategoryFilter === 'Steel & Metals',
        'Logistics & Freight': selectedCategoryFilter === 'Logistics & Freight',
        'African Power & Gensets': selectedCategoryFilter === 'African Power & Gensets',
      });
    } else {
      setActiveSeries({
        'Heavy Machinery & CNC': true,
        'Steel & Metals': true,
        'Logistics & Freight': true,
        'African Power & Gensets': true,
      });
    }
  }, [selectedCategoryFilter]);

  // Toggle category series visibility
  const toggleSeries = (cat: string) => {
    setActiveSeries(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Filter data points based on time range
  const filteredData = React.useMemo(() => {
    if (timeRange === '6M') return HISTORICAL_PRICE_DATA.slice(-4);
    if (timeRange === '1Y') return HISTORICAL_PRICE_DATA.slice(-6);
    return HISTORICAL_PRICE_DATA;
  }, [timeRange]);

  // Render D3 Line Chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = containerRef.current.clientWidth || 700;
    const height = 280;
    const margin = { top: 25, right: 30, bottom: 40, left: 45 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const xScale = d3
      .scalePoint()
      .domain(filteredData.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    // Compute min and max values across active series
    const activeCategories = Object.keys(activeSeries).filter(cat => activeSeries[cat]);
    
    let yMin = 90;
    let yMax = 125;

    if (activeCategories.length > 0) {
      let minVal = Infinity;
      let maxVal = -Infinity;
      filteredData.forEach(d => {
        activeCategories.forEach(cat => {
          const val = d[cat as keyof TrendDataPoint] as number;
          if (val < minVal) minVal = val;
          if (val > maxVal) maxVal = val;
        });
      });
      yMin = Math.floor(minVal - 3);
      yMax = Math.ceil(maxVal + 3);
    }

    // Y Scale
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]).nice();

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight).tickPadding(10);
    const xAxisG = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisG.selectAll('.tick line').attr('stroke', '#E2E8F0').attr('stroke-dasharray', '2,2');
    xAxisG.selectAll('.tick text').attr('fill', '#64748B').attr('font-size', '11px').attr('font-weight', '600');
    xAxisG.select('.domain').attr('stroke', '#CBD5E1');

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(d => `${d}`);
    const yAxisG = g.append('g').call(yAxis);

    yAxisG.selectAll('.tick line').attr('stroke', '#F1F5F9').attr('stroke-dasharray', '3,3');
    yAxisG.selectAll('.tick text').attr('fill', '#64748B').attr('font-size', '11px').attr('font-weight', '500');
    yAxisG.select('.domain').remove();

    // Line Generator
    const lineGenerator = d3
      .line<TrendDataPoint>()
      .x(d => xScale(d.label) || 0)
      .y(d => yScale(0)) // Will animate from bottom
      .curve(d3.curveMonotoneX);

    // Gradient definitions for subtle area fills
    const defs = svg.append('defs');

    activeCategories.forEach(cat => {
      const color = CATEGORY_COLORS[cat];
      const gradientId = `gradient-${cat.replace(/[^a-zA-Z0-9]/g, '')}`;

      const gradient = defs
        .append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.15);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.0);

      // Area generator
      const areaGenerator = d3
        .area<TrendDataPoint>()
        .x(d => xScale(d.label) || 0)
        .y0(innerHeight)
        .y1(d => yScale(d[cat as keyof TrendDataPoint] as number))
        .curve(d3.curveMonotoneX);

      // Draw Area
      g.append('path')
        .datum(filteredData)
        .attr('fill', `url(#${gradientId})`)
        .attr('d', areaGenerator);

      // Update line generator target
      const line = d3
        .line<TrendDataPoint>()
        .x(d => xScale(d.label) || 0)
        .y(d => yScale(d[cat as keyof TrendDataPoint] as number))
        .curve(d3.curveMonotoneX);

      // Draw Line
      const path = g
        .append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('d', line);

      // Animate stroke draw
      const totalLength = (path.node() as SVGPathElement)?.getTotalLength() || 1000;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(800)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);

      // Draw Data Points (Dots)
      g.selectAll(`.dot-${cat.replace(/[^a-zA-Z0-9]/g, '')}`)
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.label) || 0)
        .attr('cy', d => yScale(d[cat as keyof TrendDataPoint] as number))
        .attr('r', 4)
        .attr('fill', '#FFFFFF')
        .attr('stroke', color)
        .attr('stroke-width', 2.5)
        .attr('class', 'transition-all duration-200');
    });

    // Crosshair hover group
    const crosshair = g.append('g').style('display', 'none');

    crosshair
      .append('line')
      .attr('class', 'crosshair-line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#64748B')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    // Transparent overlay rect for mouse tracking
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event);
        
        // Find closest tick
        const xRange = filteredData.map(d => xScale(d.label) || 0);
        let closestIndex = 0;
        let minDistance = Infinity;

        xRange.forEach((x, idx) => {
          const dist = Math.abs(x - mouseX);
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = idx;
          }
        });

        const targetData = filteredData[closestIndex];
        const targetX = xScale(targetData.label) || 0;

        crosshair.style('display', null);
        crosshair.select('.crosshair-line').attr('transform', `translate(${targetX}, 0)`);

        // Prepare hover data
        const values = activeCategories.map(cat => ({
          category: cat,
          value: targetData[cat as keyof TrendDataPoint] as number,
          color: CATEGORY_COLORS[cat]
        }));

        setHoveredData({
          label: targetData.label,
          date: targetData.date,
          values
        });
      })
      .on('mouseleave', () => {
        crosshair.style('display', 'none');
        setHoveredData(null);
      });

  }, [filteredData, activeSeries]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      // Force trigger re-render
      setActiveSeries(prev => ({ ...prev }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-slate-900 space-y-4 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-[#8B1520] border border-rose-200">
              D3.js Data Visualization
            </span>
            <span className="text-xs text-slate-500 font-mono">Benchmark Baseline = 100.0</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#8B1520]" />
            <span>Heavy Machinery Historical Price Index (2025 – 2026)</span>
          </h3>
        </div>

        {/* Time range buttons */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['ALL', '1Y', '6M'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                timeRange === range ? 'bg-[#8B1520] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range === 'ALL' ? 'Full Range' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Category Legend & Toggles */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
          Series Toggles:
        </span>
        {Object.keys(CATEGORY_COLORS).map(cat => {
          const isVisible = activeSeries[cat];
          const color = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => toggleSeries(cat)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition flex items-center space-x-2 cursor-pointer ${
                isVisible
                  ? 'bg-slate-100 text-slate-800 border-slate-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: isVisible ? color : '#94A3B8' }}
              />
              <span>{cat}</span>
              {isVisible ? (
                <Eye className="w-3.5 h-3.5 text-slate-600 ml-1" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-slate-400 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* SVG Container & Dynamic D3 Tooltip */}
      <div className="relative" ref={containerRef}>
        <svg ref={svgRef} className="w-full h-[280px] overflow-visible" />

        {/* Floating Tooltip Card on Hover */}
        {hoveredData && (
          <div className="absolute top-2 right-4 bg-white/95 border border-slate-200 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 pointer-events-none z-20 min-w-[190px]">
            <div className="flex items-center justify-between font-mono pb-1 border-b border-slate-100 text-slate-500 text-[11px]">
              <span>Period:</span>
              <span className="font-bold text-slate-900">{hoveredData.label}</span>
            </div>
            {hoveredData.values.map(v => (
              <div key={v.category} className="flex items-center justify-between font-medium">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                  <span className="text-slate-700 text-[11px] truncate max-w-[120px]">{v.category}</span>
                </div>
                <span className="font-mono font-black text-slate-900 ml-2">
                  {v.value.toFixed(1)} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footnote / Market Insight Summary */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
        <Info className="w-4 h-4 text-[#8B1520] shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="text-slate-900">D3 Market Analysis:</strong> African Power & Gensets shows the strongest momentum (+19.4% index gain since Sep 2025) driven by factory hybrid solar conversions, while Steel & Metals raw material benchmark rates remain stabilized (-1.8%).
        </p>
      </div>
    </div>
  );
};
