import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { getAPIUrl } from "../utils/apiConfig";
import {
  sanitizeInput,
  validateFormData,
  rateLimiter,
} from "../utils/security.js";
import { companyInfo } from "../constants/companyInfo";
import { CheckCircle, AlertCircle, Send } from "lucide-react";
import { lazy, Suspense } from "react";

const Footer = lazy(() => import("../components/Footer"));

const feedbackRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-'.]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  category: {
    required: true,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
};

const CATEGORIES = [
  { value: "idea", label: "New idea or feature" },
  { value: "suggestion", label: "Improvement suggestion" },
  { value: "bug", label: "Bug or issue" },
  { value: "praise", label: "Praise or thanks" },
  { value: "other", label: "Other" },
];

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const canonical = `${companyInfo.urls.website}/feedback`;

  const validateForm = () => {
    const sanitized = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      category: formData.category,
      message: sanitizeInput(formData.message),
    };
    const newErrors = validateFormData(sanitized, feedbackRules);
    if (sanitized.category === "") {
      newErrors.category = "Please choose a category";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rateLimiter.isAllowed("feedback-form")) {
      setSubmitStatus("error");
      setErrorMessage("Too many submissions. Please try again in a minute.");
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const res = await fetch(`${getAPIUrl()}/feedback/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email),
          category: formData.category,
          message: sanitizeInput(formData.message),
          page_url: typeof window !== "undefined" ? window.location.href : null,
        }),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", category: "", message: "" });
    } catch (_) {
      setSubmitStatus("error");
      setErrorMessage("Unable to send. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title={`Share Your Ideas | Feedback | ${companyInfo.name}`}
        description={`Send ideas, suggestions, and feedback to ${companyInfo.name}. We read every message and use your input to build better products.`}
        keywords="feedback, ideas, suggestions, contact Ondosoft, product feedback"
        canonicalUrl={canonical}
      />
      <div className="min-h-screen bg-neutral-950 text-gray-100">
        <div className="mx-auto max-w-2xl px-4 pt-20 pb-16">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-white">Share your </span>
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
                ideas
              </span>
            </h1>
            <p className="mt-4 text-gray-300 text-lg max-w-xl mx-auto">
              Your feedback shapes what we build next. Tell us about a feature idea, an improvement, or something you loved.
            </p>
          </div>

          {submitStatus === "success" ? (
            /* Thank-you / appreciation state */
            <div
              className="rounded-2xl border border-orange-500/30 bg-neutral-900/80 p-8 sm:p-10 text-center shadow-xl shadow-orange-500/5"
              role="status"
              aria-live="polite"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Thank you for sharing
              </h2>
              <p className="text-gray-300 mb-2">
                We really appreciate you taking the time to send us your thoughts.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                We read every message and use your feedback to improve. You might not always get a reply, but your input matters.
              </p>
              <Link
                to="/feedback"
                onClick={() => setSubmitStatus(null)}
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium text-sm"
              >
                <Send className="w-4 h-4" />
                Send another idea
              </Link>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-8 shadow-xl"
            >
              {submitStatus === "error" && (
                <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/40 flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="feedback-name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border ${
                      errors.name ? "border-red-500/50" : "border-neutral-700"
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50`}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border ${
                      errors.email ? "border-red-500/50" : "border-neutral-700"
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50`}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="feedback-category" className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="feedback-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border ${
                      errors.category ? "border-red-500/50" : "border-neutral-700"
                    } text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50`}
                  >
                    <option value="">Choose one…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-300 mb-1">
                    Your message
                  </label>
                  <textarea
                    id="feedback-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your idea, suggestion, or feedback…"
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border ${
                      errors.message ? "border-red-500/50" : "border-neutral-700"
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-y min-h-[120px]`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.message.length}/2000
                  </p>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-500 text-sm">
                  We read everything and use feedback to improve.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-gray-500 text-sm">
            Prefer to talk?{" "}
            <Link to="/contact" className="text-orange-400 hover:text-orange-300 underline">
              Contact us
            </Link>{" "}
            or book a call.
          </p>
        </div>

        <Suspense fallback={<div className="h-32" />}>
          <Footer hideFeedbackCta />
        </Suspense>
      </div>
    </>
  );
};

export default FeedbackPage;
