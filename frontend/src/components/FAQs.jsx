import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How long does delivery take?",
            answer: "Standard delivery takes 3-5 business days. We also offer express delivery which takes 1-2 business days for an additional fee. You'll receive a tracking number once your order is shipped."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a hassle-free 30-day return policy. If you're not satisfied with your purchase, you can return the sneakers in their original condition with tags attached for a full refund. Simply contact our customer service team to initiate the return process."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by location. You can check the shipping cost and estimated delivery time at checkout."
        },
        {
            question: "Are all sneakers authentic?",
            answer: "Absolutely! All sneakers in our collection are 100% authentic and sourced directly from authorized retailers and brands. We guarantee authenticity and ensure all sneakers are brand new with original packaging."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you'll receive an email with a tracking number and a link to track your package. You can also log into your account on our website to view your order status and tracking information."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-gray-50 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Find answers to common questions about our services
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                        >
                            {/* Question Button */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                            >
                                <h3 className="text-lg lg:text-xl font-bold text-black pr-4">
                                    {faq.question}
                                </h3>

                                {/* Toggle Icon */}
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white rounded-md font-bold text-xl"
                                >
                                    +
                                </motion.div>
                            </button>

                            {/* Answer */}
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 pt-2 border-t-2 border-black/10">
                                            <p className="text-gray-700 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-600 mb-4">
                        Still have questions?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-black text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black transition-all duration-200 uppercase tracking-wide"
                    >
                        Contact Support
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQs;
