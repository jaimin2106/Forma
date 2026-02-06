// src/pages/Templates.tsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formTemplates, templateCategories } from "@/data/formTemplates";
import { Search, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// Mobile detection to tune motion
const useIsMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const f = () => setM(window.innerWidth < 768);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return m;
};

// Motion variants optimized for mobile
const containerVariants = (isMobile: boolean) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: isMobile ? 0.03 : 0.06 },
  },
});

const cardVariants = (isMobile: boolean) => ({
  hidden: { opacity: 0, y: isMobile ? 10 : 16, scale: isMobile ? 0.985 : 0.995 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 24, mass: 0.8 },
  },
});

export default function Templates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const isMobile = useIsMobile();

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return formTemplates.filter((t) => {
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => ["All", ...templateCategories], []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Business":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
      case "Education":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "Technical":
        return "bg-violet-50 text-violet-700 ring-1 ring-violet-200";
      case "Community":
        return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";
      default:
        return "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
    }
  };

  const handleSelectTemplate = (template: (typeof formTemplates)[0]) => {
    const templateData = encodeURIComponent(JSON.stringify(template));
    navigate(`/forms/new?template=${templateData}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Title block with fluid type (mobile-first) */}
        <div className="text-center mb-6">
          <h1
            className="font-extrabold tracking-tight text-slate-900"
            style={{ fontSize: "clamp(24px, 6vw, 40px)" }}
          >
            <span className="inline-flex items-center gap-2 sm:gap-3">
              <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-violet-600" />
              Form Templates
            </span>
          </h1>
          <p
            className="text-slate-600 mx-auto mt-2"
            style={{ fontSize: "clamp(13px, 3.8vw, 18px)", maxWidth: 700 }}
          >
            Choose a template to start faster. Customize everything to match your brand.
          </p>
        </div>

        {/* Search (mobile friendly) */}
        <div className="max-w-xl mx-auto mb-6">
          <label htmlFor="template-search" className="sr-only">
            Search templates
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="template-search"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-sm"
            />
          </div>
        </div>

        {/* Category Tabs (wrap cleanly on mobile) */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-4">
          <TabsList className="mx-auto grid w-full max-w-full grid-cols-3 sm:grid-cols-6 gap-1 bg-slate-50 px-1">
            {categories.map((c) => (
              <TabsTrigger
                key={c}
                value={c}
                className="px-2 py-2 text-xs sm:text-sm truncate data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200"
                aria-label={`Show ${c} templates`}
                title={c}
              >
                {c}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-3">
            {/* Results */}
            <div className="mb-4 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-slate-500">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} found
                {searchQuery ? ` for “${searchQuery}”` : ""}
                {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
              </p>
            </div>

            {/* Grid with stagger reveal, mobile-first columns */}
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-14">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900 mb-1">No templates found</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Try a different search or pick another category. You can also start from scratch.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="hover:bg-slate-50"
                  >
                    Clear filters
                  </Button>
                  <Button onClick={() => navigate("/forms/new")} className="bg-violet-600 hover:bg-violet-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Start from scratch
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants(isMobile)}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredTemplates.map((t) => (
                  <motion.div key={t.id} variants={cardVariants(isMobile)} layout>
                    <Card
                      className="group relative border border-slate-200 bg-white transition-colors hover:border-violet-200"
                      onClick={() => handleSelectTemplate(t)}
                    >
                      {/* Subtle mobile-safe hover glow (reduced) */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                          background:
                            "linear-gradient(45deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))",
                          maskImage: "radial-gradient(180px 180px at 80% -20%, black, transparent)",
                        }}
                      />

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="text-2xl sm:text-3xl leading-none">{t.icon}</div>
                          <Badge className={`${getCategoryColor(t.category)} rounded-md`}>
                            {t.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                          {t.name}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                          {t.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="text-xs sm:text-sm text-slate-500">
                            {t.questions.length} questions
                          </span>
                          <span className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500">
                            <FileText className="h-3.5 w-3.5" />
                            Form
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-10 sm:h-10 transition-colors group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:text-violet-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTemplate(t);
                          }}
                          aria-label={`Use ${t.name} template`}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick actions */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-4 rounded-lg border border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600">Can’t find what you’re looking for?</p>
            <Button
              variant="outline"
              onClick={() => navigate("/forms/new")}
              className="flex items-center gap-2 hover:bg-white"
            >
              <FileText className="h-4 w-4" />
              Start from scratch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
