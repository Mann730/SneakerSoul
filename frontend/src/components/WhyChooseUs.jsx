import React from "react";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
    const features = [
        {
            icon: "👟",
            title: "Authentic Sneakers",
            description: "Access to 10,000+ authentic sneakers from 50+ premium brands, 200+ exclusive styles and 1000+ colorways."
        },
        {
            icon: "⚡",
            title: "Fast Delivery",
            description: "Get your sneakers delivered within 2-3 business days with our express shipping service."
        },
        {
            icon: "💰",
            title: "Best Prices",
            description: "Competitive pricing with regular discounts and special offers on latest drops and classic styles."
        },
        {
            icon: "🔒",
            title: "Secure Payment",
            description: "100% secure payment gateway with multiple payment options for your convenience."
        },
        {
            icon: "📱",
            title: "Easy Returns",
            description: "Hassle-free 30-day return policy. Not satisfied? Get a full refund, no questions asked."
        },
        {
            icon: "🎁",
            title: "Loyalty Rewards",
            description: "Earn points on every purchase and redeem them for exciting discounts on future orders."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="bg-white py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight mb-4">
                        Why Choose Us
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover what makes us the preferred choice for sneaker enthusiasts everywhere
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative bg-white border-2 border-black rounded-lg p-6 lg:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl lg:text-2xl font-bold text-black mb-3 group-hover:text-gray-800 transition-colors">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none rounded-lg"></div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
