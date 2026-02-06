import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight } from "lucide-react";

const posts = [
    {
        title: "The Future of AI in Decision Making",
        excerpt: "How organizations are leveraging predictive analytics to stay ahead.",
        category: "Thought Leadership",
        date: "Oct 12, 2025",
        image: "bg-gradient-to-br from-violet-100 to-indigo-100"
    },
    {
        title: "5 Tips for Higher Conversion Rates",
        excerpt: "Simple changes to your form design that yield massive results.",
        category: "Guides",
        date: "Oct 08, 2025",
        image: "bg-gradient-to-br from-blue-100 to-cyan-100"
    },
    {
        title: "Introducing Forma Enterprise",
        excerpt: "A new era of scalability and security for large teams.",
        category: "Product News",
        date: "Sep 28, 2025",
        image: "bg-gradient-to-br from-pink-100 to-rose-100"
    }
];

const Blog = () => {
    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">The Forma Blog</h1>
                    <p className="text-xl text-slate-500">Insights, updates, and guides from the team.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, i) => (
                        <motion.article
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className={`aspect-video rounded-2xl mb-6 ${post.image} group-hover:scale-[1.02] transition-transform duration-300`} />
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                                <span className="text-violet-600">{post.category}</span>
                                <span>•</span>
                                <span>{post.date}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-violet-700 transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                {post.excerpt}
                            </p>
                            <div className="flex items-center gap-1 text-sm font-semibold text-slate-900 group-hover:gap-2 transition-all">
                                Read Story <ArrowRight size={16} />
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Blog;
