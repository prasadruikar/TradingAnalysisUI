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
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { MOCK_STOCKS, type Stock } from "@/lib/mock-data";
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
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="w-3.5 h-3.5" />
          <span className="font-medium tracking-wide text-[10px] uppercase">
            {label}
          </span>
        </div>
        <span
          className={cn(
            "font-mono font-bold",
            value >= 70
              ? "text-primary"
              : value >= 40
              ? "text-yellow-500"
              : "text-destructive"
          )}
        >
          {value}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
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
    </div>
  );
};

const SentimentMeter = ({ score }: { score: number }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">AI Score</span>
        <span
          className={cn(
            score >= 70
              ? "text-primary"
              : score >= 40
              ? "text-yellow-500"
              : "text-destructive"
          )}
        >
          {score}/100
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
          style={{ width: `${score}%` }}
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
              ${stock.price.toFixed(2)}
            </div>
            <div
              className={cn(
                "text-sm font-medium flex items-center justify-end gap-1 font-mono",
                stock.change >= 0 ? "text-primary" : "text-destructive"
              )}
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change}%
              {stock.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
            </div>
          </div>
        </div>

        {/* Mini Sparkline for Card */}
        <div className="h-12 w-full mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
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
                AI Signal Strength
              </h4>
            </div>

            <div className="space-y-5">
              {/* Overall AI Score */}
              <SentimentMeter score={stock.score} />

              {/* 3 Key Expansion Factors */}
              <div className="space-y-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <StrengthBar
                  label="Candle Expansion"
                  value={stock.candleStrength}
                  icon={CandlestickChart}
                />
                <StrengthBar
                  label="Volume Expansion"
                  value={stock.volumeStrength}
                  icon={BarChart2}
                />
                <StrengthBar
                  label="Futures Expansion"
                  value={stock.futuresStrength}
                  icon={Layers}
                />
              </div>

              {/* Analysis Text */}
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-semibold mr-1">
                    Analysis:
                  </span>
                  {stock.analysis}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
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

  const filteredStocks = MOCK_STOCKS.filter(
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
                Stock<span className="text-primary text-glow">Rank</span> AI
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Real-time algorithmic ranking & sentiment analysis
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              placeholder="Search ticker or company..."
              className="pl-10 bg-black/40 border-white/10 focus:border-primary/50 text-foreground h-12 rounded-lg backdrop-blur-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Content Grid */}
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

        {/* Empty State */}
        {filteredStocks.length === 0 && (
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
