import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ContactUs = () => {
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.2 });
  const infoRef = useRef(null);
  const isInfoInView = useInView(infoRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white overflow-x-hidden max-w-full"
    >
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl px-4 py-16 space-y-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Contact Us</h1>
          <p className="text-lg text-slate-600">
            We&apos;d love to hear from you. Get in touch with us today.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.form
            ref={formRef}
            variants={containerVariants}
            initial="hidden"
            animate={isFormInView ? "visible" : "hidden"}
            className="lg:col-span-2 space-y-6 rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200"
          >
            <motion.div
              variants={itemVariants}
              className="grid gap-5 md:grid-cols-2"
            >
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label htmlFor="name" className="text-sm font-semibold text-slate-800">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                />
              </motion.div>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                />
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label htmlFor="subject" className="text-sm font-semibold text-slate-800">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="How can we help?"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label htmlFor="message" className="text-sm font-semibold text-slate-800">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Please describe your inquiry..."
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
              ></textarea>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 shadow-lg"
            >
              Send Message
            </motion.button>
          </motion.form>

          <motion.div
            ref={infoRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInfoInView ? "visible" : "hidden"}
            className="space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-slate-900"
            >
              Other Ways to Reach Us
            </motion.h2>
            <div className="space-y-4">
              {[
                { title: "Email", content: "info@sneakersoul.com", icon: "📧" },
                { title: "Phone", content: "1-800-KICKS", icon: "📞" },
                { title: "Address", content: "456 Sneaker Ave, Kicks City, KC 54321", icon: "📍" },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="rounded-xl bg-slate-50 p-4 shadow-inner"
                >
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    {item.title}
                  </h3>
                  <p className="text-slate-600 mt-1">{item.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default ContactUs
