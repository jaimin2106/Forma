import { motion } from "framer-motion";

// Company logos for trust bar
const trustedCompanies = [
  { name: "Microsoft", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { name: "Google", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" },
  { name: "Amazon", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { name: "Meta", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" },
  { name: "Apple", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" },
  { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" },
];

export const TrustSection = () => {
  return (
    <section className="bg-slate-50 py-10 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Trust Stat */}
          <div className="flex-shrink-0 text-center md:text-left">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Trusted by teams at
            </p>
            <p className="text-lg font-bold text-slate-800 mt-1">
              <span className="text-violet-600">10,000+</span> companies worldwide
            </p>
          </div>

          {/* Company Logos */}
          <div className="flex items-center gap-8 flex-wrap justify-center md:justify-end">
            {trustedCompanies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
                title={company.name}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-8 w-auto grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
