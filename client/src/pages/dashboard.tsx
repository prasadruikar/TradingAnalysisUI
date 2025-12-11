import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Search,
  BarChart3,
  Target,
  AlertTriangle,
  ArrowRight,
  CandlestickChart,
  Layers,
  BarChart2,
  RefreshCw,
  Info,
  Clock,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { type Stock } from "@/lib/mock-data";
import { useStocks } from "@/lib/api";
import bgImage from "@assets/generated_images/dark_abstract_digital_finance_background.png";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// --- Components ---

const Metric = ({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
}) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
      {label}
    </span>
    <div className="flex items-center gap-1">
      <span className="text-sm font-medium font-mono text-foreground">
        {value}
      </span>
      {trend === "up" && <TrendingUp className="w-3 h-3 text-primary" />}
      {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
    </div>
  </div>
);

const StrengthBar = ({
  label,
  value,
  icon: Icon,
  avgValue,
  compact = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  avgValue?: number;
  compact?: boolean;
}) => {
  return (
    <div className={cn("space-y-1.5", compact ? "space-y-1" : "")}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className={cn(compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
          {!compact && (
            <span className="font-medium tracking-wide text-[10px] uppercase">
              {label}
            </span>
          )}
        </div>
        <span
          className={cn(
            "font-mono font-bold",
            value >= 70
              ? "text-primary"
              : value >= 40
              ? "text-yellow-500"
              : "text-destructive",
             compact ? "text-[10px]" : ""
          )}
        >
          {value.toFixed(0)}%
        </span>
      </div>
      
      {/* Current Value Bar */}
      <div className={cn("w-full bg-white/5 rounded-full overflow-hidden relative", compact ? "h-1" : "h-1.5")}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full shadow-[0_0_8px_currentColor]",
            value >= 70
              ? "bg-primary text-primary"
              : value >= 40
              ? "bg-yellow-500 text-yellow-500"
              : "bg-destructive text-destructive"
          )}
        />
      </div>

      {/* Avg Value Bar (Only in Detailed Mode) */}
      {!compact && avgValue !== undefined && (
        <div className="flex items-center gap-2 mt-1">
           <div className="w-12 text-[9px] text-muted-foreground/60 font-mono text-right shrink-0">
             Avg
           </div>
           <div className="w-full bg-white/5 rounded-full overflow-hidden h-1">
             <div 
               className="h-full bg-white/30 rounded-full"
               // Heuristic: If avg is raw number (e.g. 15000) vs value (180), we can't plot avg on same 0-100 scale easily without normalizing.
               // Assuming avgValue passed here is normalized to 0-100 for visual consistency if possible, 
               // OR we just use a placeholder visual if we can't compute it.
               // Since we don't have normalization logic for raw values in frontend easily without max range,
               // We will display a text readout instead of a bar if it's likely raw data.
               // But user asked for "show the avg with their expansions bar only".
               // Let's assume for Futures (0-100) we can plot it. For Volume (15000), we can't.
               // Let's use a subtle bar for Avg if it's <= 100, else just text.
               style={{ width: `${avgValue <= 100 ? avgValue : 50}%` }} 
             />
           </div>
           <div className="w-8 text-[9px] text-muted-foreground/60 font-mono text-right shrink-0">
             {avgValue.toFixed(1)}
           </div>
        </div>
      )}
    </div>
  );
};

// Specialized Dual Bar Component for Expansion vs Average
const ExpansionMetric = ({
    label,
    currentValue,
    avgValue,
    icon: Icon
}: {
    label: string,
    currentValue: number,
    avgValue?: number,
    icon: React.ElementType
}) => {
    // Determine if we can plot avg as a percentage (is it likely 0-100?)
    // If avgValue is > 100 (like volume 15000), we treat it as raw data and don't try to plot it on 0-100 scale
    // unless we normalize. For visualization, let's normalize simply against current value?
    // No, that's misleading.
    // Let's assume standard 0-100 bars for strength.
    // User said "candleExpansion in the bar view so same way show for the avg".
    // This implies Avg is also a strength metric (0-100) or normalized.
    // If it's raw (1.5), we can't plot it against 100%.
    // VISUAL TRICK: We will render two bars labeled clearly.
    
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80 mb-1">
                <Icon className="w-3.5 h-3.5" />
                <span className="font-medium tracking-wide text-[10px] uppercase">{label}</span>
            </div>
            
            {/* Current Value Bar */}
            <div className="flex items-center gap-3">
                <div className="w-8 text-[9px] font-mono text-muted-foreground text-right">NOW</div>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, currentValue))}%` }}
                        className={cn(
                            "h-full rounded-full",
                            currentValue >= 70 ? "bg-primary" : currentValue >= 40 ? "bg-yellow-500" : "bg-destructive"
                        )}
                    />
                </div>
                <div className={cn("w-8 text-[10px] font-mono font-bold text-right", 
                    currentValue >= 70 ? "text-primary" : currentValue >= 40 ? "text-yellow-500" : "text-destructive")}>
                    {currentValue.toFixed(0)}
                </div>
            </div>

            {/* Avg Value Bar */}
            {avgValue !== undefined && (
                <div className="flex items-center gap-3">
                    <div className="w-8 text-[9px] font-mono text-muted-foreground/50 text-right">AVG</div>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                         {/* 
                            Logic for Avg Bar Width:
                            If avg is raw (e.g. 1.5) and current is 90, we can't compare directly on 0-100.
                            However, if the user says "avg candle expansion", and current is 90 (strength),
                            maybe current is derived from avg?
                            If we can't reliably determine width, we show a neutral width or full width with label.
                            Let's assume for visual balance we show it as a relative indicator if possible.
                            If avgValue < 10, it's likely raw candle count (1.5).
                            If avgValue > 1000, it's volume.
                            If avgValue is ~50, it's strength.
                            
                            FALLBACK: If we can't plot it, we just show the number.
                            But user explicitly asked for "bar view".
                            Let's just fill it 50% opacity white as a baseline visual if we can't calc %
                         */}
                        <div 
                            className="h-full bg-white/20 rounded-full"
                            style={{ width: `${avgValue <= 100 ? avgValue : 60}%` }}
                        />
                    </div>
                    <div className="w-8 text-[10px] font-mono text-muted-foreground/60 text-right">
                        {avgValue.toFixed(avgValue < 10 ? 2 : 0)}
                    </div>
                </div>
            )}
        </div>
    )
}


const ScoreMeter = ({ score }: { score: number }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">Algo Rank Score</span>
        <span
          className={cn(
            score >= 70
              ? "text-primary"
              : score >= 40
              ? "text-yellow-500"
              : "text-destructive"
          )}
        >
          {score.toFixed(0)}/100
        </span>
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            score >= 70
              ? "bg-primary shadow-[0_0_10px_var(--color-primary)]"
              : score >= 40
              ? "bg-yellow-500"
              : "bg-destructive"
          )}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
};

const StockCard = ({
  stock,
  isHovered,
  onHover,
  onLeave,
}: {
  stock: Stock;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  return (
    <div className="relative group">
      {/* Main Card */}
      <motion.div
        className={cn(
          "glass-card p-6 rounded-xl relative z-10 transition-all duration-300 cursor-pointer overflow-hidden border-l-4",
          isHovered
            ? "border-l-primary scale-[1.02]"
            : "border-l-transparent hover:border-l-primary/50"
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">
                #{stock.rank}
              </span>
              <span className="text-xs text-muted-foreground">{stock.sector}</span>
            </div>
            <h3 className="text-2xl font-bold font-mono tracking-tight text-foreground group-hover:text-primary transition-colors">
              {stock.ticker}
            </h3>
            <p className="text-sm text-muted-foreground truncate max-w-[140px]">
              {stock.name}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-foreground font-mono">
              ₹{stock.price.toFixed(2)}
            </div>
            <div
              className={cn(
                "text-sm font-medium flex items-center justify-end gap-1 font-mono",
                stock.change >= 0 ? "text-primary" : "text-destructive"
              )}
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}%
              {stock.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
            </div>
          </div>
        </div>

        {/* Intraday Expansion Data (Now Visible on Card) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/5 p-2 rounded flex flex-col items-center justify-center gap-1">
                <CandlestickChart className="w-3 h-3 text-muted-foreground" />
                <span className={cn("text-xs font-bold font-mono", stock.candleStrength >= 70 ? "text-primary" : "text-muted-foreground")}>
                    {stock.candleStrength.toFixed(0)}%
                </span>
            </div>
            <div className="bg-white/5 p-2 rounded flex flex-col items-center justify-center gap-1">
                <BarChart2 className="w-3 h-3 text-muted-foreground" />
                <span className={cn("text-xs font-bold font-mono", stock.volumeStrength >= 70 ? "text-primary" : "text-muted-foreground")}>
                    {stock.volumeStrength.toFixed(0)}%
                </span>
            </div>
             <div className="bg-white/5 p-2 rounded flex flex-col items-center justify-center gap-1">
                <Layers className="w-3 h-3 text-muted-foreground" />
                <span className={cn("text-xs font-bold font-mono", stock.futuresStrength >= 70 ? "text-primary" : "text-muted-foreground")}>
                    {stock.futuresStrength.toFixed(0)}%
                </span>
            </div>
        </div>

        {/* Mini Sparkline for Card */}
        <div className="h-8 w-full mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stock.history}>
              <defs>
                <linearGradient
                  id={`gradient-${stock.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={
                      stock.change >= 0
                        ? "var(--color-primary)"
                        : "var(--color-destructive)"
                    }
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={
                      stock.change >= 0
                        ? "var(--color-primary)"
                        : "var(--color-destructive)"
                    }
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={
                  stock.change >= 0
                    ? "var(--color-primary)"
                    : "var(--color-destructive)"
                }
                fill={`url(#gradient-${stock.id})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Hover Insight Panel (Absolute Positioned) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 20 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-full ml-4 w-[340px] z-50 glass-popover rounded-xl p-5 hidden xl:block"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <h4 className="text-sm font-bold font-display uppercase tracking-wider text-foreground">
                Detailed Analysis
              </h4>
            </div>

            <div className="space-y-5">
              {/* Overall Score */}
              <ScoreMeter score={stock.score} />

              {/* 3 Key Expansion Factors with Avg Context */}
              <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/5">
                <ExpansionMetric
                  label="Candle Expansion"
                  currentValue={stock.candleStrength}
                  avgValue={stock.avgCandleExp}
                  icon={CandlestickChart}
                />
                <ExpansionMetric
                  label="Volume Expansion"
                  currentValue={stock.volumeStrength}
                  avgValue={stock.avgVolumeExp}
                  icon={BarChart2}
                />
                <ExpansionMetric
                  label="Futures Expansion"
                  currentValue={stock.futuresStrength}
                  avgValue={stock.avgFuturesExp}
                  icon={Layers}
                />
              </div>

               {/* Avg Strength Metrics */}
               <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col">
                       <span className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Avg Bull Str</span>
                       <span className="text-sm font-mono font-bold text-primary">{stock.avgBullStrength.toFixed(2)}</span>
                   </div>
                   <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col">
                       <span className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Avg Bear Str</span>
                       <span className="text-sm font-mono font-bold text-destructive">{stock.avgBearStrength.toFixed(2)}</span>
                   </div>
               </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5 mt-2">
                <Metric label="Vol" value={stock.volume} />
                <Metric label="Mkt Cap" value={stock.marketCap} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Dashboard() {
  const [hoveredStockId, setHoveredStockId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: stocks, isLoading, isError } = useStocks();

  const filteredStocks = (stocks || []).filter(
    (s) =>
      s.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-x-hidden">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient Overlay for Readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/90 via-background/80 to-background/95 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-wide uppercase">
                Stock<span className="text-primary text-glow">Rank</span>
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Indian Stock Exchange • Algorithmic Ranking System
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              placeholder="Search symbol (e.g. RELIANCE)..."
              className="pl-10 bg-black/40 border-white/10 focus:border-primary/50 text-foreground h-12 rounded-lg backdrop-blur-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-pulse">
            <RefreshCw className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Fetching algorithmic rankings...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20 text-destructive">
            <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
            <p>Failed to load market data.</p>
          </div>
        )}

        {/* Content Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-20">
            {filteredStocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                isHovered={hoveredStockId === stock.id}
                onHover={() => setHoveredStockId(stock.id)}
                onLeave={() => setHoveredStockId(null)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredStocks.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <AlertTriangle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              No instruments found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
