"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  ImagePlus,
  Landmark,
  LogOut,
  MapPin,
  Mic,
  Sparkles,
  UserRound,
  X,
  Globe,
} from "lucide-react";

import { createChallenge, useChallenges } from "@/lib/challenges";
import { getSession } from "@/lib/auth";

type Analysis = {
  title: string;
  category: string;
  severity: "Low" | "Medium" | "High";
  summary: string;
  action: string;
  demo: boolean;
};

type LocationData = {
  latitude: number;
  longitude: number;
  area: string;
  city: string;
  district: string;
  state: string;
  country: string;
};

const examples = [
  "Garbage accumulation",
  "Water leakage",
  "Broken streetlight",
  "Damaged road",
  "Overflowing drain",
  "Waste disposal issue",
];

const demoAnalysis: Analysis = {
  title: "Possible waste accumulation",
  category: "Sanitation",
  severity: "Medium",
  summary:
    "The reported issue appears to require attention from the local sanitation authority.",
  action:
    "Report to the local municipal authority and request an on-site review.",
  demo: true,
};

function fallback(text: string): Analysis {
  const lower = text.toLowerCase();

  const water =
    /(water|paani|पानी|पाणी|दूषित|contaminat|leak|गळती)/.test(lower);

  const road =
    /(road|street|सड़क|रस्ता|light|बत्ती|दिवा|pothole|खड्डा)/.test(lower);

  const garbage =
    /(garbage|waste|कचरा|कचरा जमा|trash|rubbish|घाण)/.test(lower);

  if (water) {
    return {
      title: "Water-related problem",
      category: "Water & Sanitation",
      severity: "High",
      summary:
        "A water-related community problem has been reported and requires local review.",
      action:
        "Request water-quality testing or inspection from the relevant local authority.",
      demo: true,
    };
  }

  if (road) {
    return {
      title: "Public infrastructure issue",
      category: "Infrastructure",
      severity: "Medium",
      summary:
        "A public infrastructure concern has been reported and needs local review.",
      action:
        "Request an inspection from the relevant local authority.",
      demo: true,
    };
  }

  if (garbage) {
    return {
      title: "Waste accumulation",
      category: "Sanitation",
      severity: "Medium",
      summary:
        "Garbage or waste accumulation has been reported in the community.",
      action:
        "Request sanitation staff to inspect and address the reported location.",
      demo: true,
    };
  }

  return {
    title: "Community issue reported",
    category: "Community Services",
    severity: "Medium",
    summary:
      "A community concern has been structured for review and matching.",
    action:
      "Submit the report for local authority and partner review.",
    demo: true,
  };
}

export default function CitizenDashboard() {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState("");

  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const [voiceState, setVoiceState] = useState("");
  const [listening, setListening] = useState(false);

  const [language, setLanguage] = useState<
    "en-IN" | "hi-IN" | "mr-IN"
  >("en-IN");

  const [location, setLocation] = useState<LocationData | null>(null);

  const [locationStatus, setLocationStatus] =
    useState("Location will be captured automatically");

  const [success, setSuccess] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const input = useRef<HTMLInputElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  const sharedChallenges = useChallenges();

  // --------------------------------------------------
  // GET DEVICE LOCATION
  // --------------------------------------------------

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Location services are not supported by this browser."
      );
      return;
    }

    setLocationStatus("Getting your device location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          /*
           * Reverse geocoding using OpenStreetMap Nominatim.
           *
           * GPS gives coordinates.
           * Reverse geocoding converts them into:
           * area, city, district, state and country.
           */

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          const data = await response.json();

          const address = data.address || {};

          const locationData: LocationData = {
            latitude,
            longitude,

            area:
              address.suburb ||
              address.neighbourhood ||
              address.village ||
              address.hamlet ||
              "Area not available",

            city:
              address.city ||
              address.town ||
              address.municipality ||
              address.village ||
              "City not available",

            district:
              address.county ||
              address.state_district ||
              "District not available",

            state: address.state || "State not available",

            country: address.country || "Country not available",
          };

          setLocation(locationData);

          setLocationStatus(
            `${locationData.area}, ${locationData.city}`
          );
        } catch (error) {
          console.error("Reverse geocoding error:", error);

          setLocation({
            latitude,
            longitude,
            area: "Area unavailable",
            city: "City unavailable",
            district: "District unavailable",
            state: "State unavailable",
            country: "Country unavailable",
          });

          setLocationStatus(
            `GPS captured: ${latitude.toFixed(
              5
            )}, ${longitude.toFixed(5)}`
          );
        }
      },

      (error) => {
        console.error(error);

        setLocationStatus(
          "Location permission was denied. Please allow location access."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // --------------------------------------------------
  // CHANGE REPORT MODE
  // --------------------------------------------------

  const choose = (
    mode: "text" | "photo" | "voice"
  ) => {
    if (mode === "photo") {
      input.current?.click();
    }

    if (mode === "voice") {
      setTimeout(() => {
        document
          .getElementById("voice-section")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      }, 100);
    }

    if (mode === "text") {
      setTimeout(() => {
        document
          .getElementById("problem-description")
          ?.focus();
      }, 100);
    }
  };

  // --------------------------------------------------
  // ANALYZE
  // --------------------------------------------------

  const analyze = async () => {
    if (!text.trim() && !preview) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    let result: Analysis;

    if (!text.trim()) {
      result = demoAnalysis;
    } else {
      try {
        const data = await fetch("/api/classify", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            description: text,
          }),
        }).then((r) => r.json());

        result = {
          title:
            data.summary?.replace(/\.$/, "") ||
            fallback(text).title,

          category:
            data.domain ||
            fallback(text).category,

          severity:
            data.urgency_score >= 4
              ? "High"
              : data.urgency_score <= 2
                ? "Low"
                : "Medium",

          summary:
            data.summary ||
            fallback(text).summary,

          action:
            "Submit this challenge for the relevant local authority and collaborators to review.",

          demo:
            !data.ai_matching_reason ||
            data.ai_matching_reason.includes("Demo"),
        };
      } catch {
        result = fallback(text);
      }
    }

    setAnalysis(result);
    setIsAnalyzing(false);

    setTimeout(() => {
      analysisRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  // --------------------------------------------------
  // VOICE REPORT
  // --------------------------------------------------

  const startVoice = () => {
    const Speech =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!Speech) {
      setVoiceState(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new Speech();

    recognition.lang = language;

    recognition.interimResults = true;

    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);

      if (language === "en-IN") {
        setVoiceState("Listening in English...");
      }

      if (language === "hi-IN") {
        setVoiceState("हिंदी में सुन रहा हूँ...");
      }

      if (language === "mr-IN") {
        setVoiceState("मराठीत ऐकत आहे...");
      }
    };

    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("");

      setText(transcript);

      setVoiceState(
        "Voice converted to text. You can edit it before submitting."
      );
    };

    recognition.onerror = () => {
      setVoiceState(
        "Could not hear your report. Please try again."
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const submit = () => {
    if (!analysis) return;

    const formattedLocation = location
      ? `${location.area}, ${location.city}, ${location.district}, ${location.state}, ${location.country}`
      : "Location not provided";

    const saved = createChallenge({
      title: analysis.title,

      description:
        text || analysis.summary,

      category:
        analysis.category,

      severity:
        analysis.severity,

      location:
        formattedLocation,

      submittedBy:
        profile?.fullName || "Citizen",

      image:
        preview || undefined,

      voiceTranscript:
        language !== "en-IN"
          ? text
          : undefined,

      aiSummary:
        analysis.summary,

      suggestedAction:
        analysis.action,
    });

    setSuccess(
      `Your community challenge has been submitted successfully from ${location?.area || "your location"}.`
    );

    setAnalysis(null);

    setText("");

    setPreview("");

    setVoiceState("");

    // Refresh location for next report
    getCurrentLocation();
  };

  return (
    <main className="min-h-screen bg-mist">

      {/* HEADER */}

      <header className="sticky top-0 z-20 border-b border-white/70 bg-mist/90 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-moss text-xl font-black text-lime">
              S
            </div>

            <div>

              <p className="font-bold leading-none">
                SAHAAY
              </p>

              <p className="text-xs text-slate-500">
                Citizen Dashboard
              </p>

            </div>

          </Link>

          <nav className="flex items-center gap-1 text-sm">

            <button className="btn hidden bg-white sm:inline-flex">

              <FileText className="h-4 w-4" />

              Dashboard

            </button>

            <button
              className="btn bg-white"
              aria-label="Notifications"
            >

              <Bell className="h-4 w-4" />

            </button>

            <button
              type="button"
              className="btn bg-white"
              aria-label="Profile"
              onClick={() => {
                const session = getSession();

                setProfile(session);

                setShowProfile(true);
              }}
            >

              <UserRound className="h-4 w-4" />

            </button>

            <Link
              href="/"
              className="btn bg-ink text-white"
            >

              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">
                Logout
              </span>

            </Link>

          </nav>

        </div>

      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* HERO */}

        <section className="mb-8 rounded-3xl bg-ink p-6 text-white md:p-9">

          <p className="text-sm font-bold uppercase tracking-[.16em] text-lime">
            Citizen workspace
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Welcome back, Citizen
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Report a local issue by describing it, adding a
            photo, or speaking in your preferred language.
            SAHAAY automatically captures your report location.
          </p>

        </section>

        {/* MAIN REPORT AREA */}

        <section
          id="report-panel"
          className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"
        >

          {/* LEFT CARD */}

          <div className="card p-5 md:p-7">

            <div className="mb-6">

              <p className="text-sm font-bold uppercase tracking-wider text-moss">
                Report a Community Problem
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Help us identify issues around you.
              </h2>

            </div>

            {/* OPTIONS */}

            <div className="grid gap-2 sm:grid-cols-3">

              <ModeButton
                onClick={() => choose("text")}
                icon={<FileText />}
                title="Describe Problem"
              />

              <ModeButton
                onClick={() => choose("photo")}
                icon={<Camera />}
                title="Upload / Take Photo"
              />

              <ModeButton
                onClick={() => choose("voice")}
                icon={<Mic />}
                title="Report by Voice"
              />

            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-moss">

              <Sparkles className="h-4 w-4" />

              AI-assisted reporting

            </p>

            {/* ------------------------------------------------ */}
            {/* TEXT DESCRIPTION */}
            {/* ------------------------------------------------ */}

            <div className="mt-5">

              <label
                htmlFor="problem-description"
                className="label"
              >
                Describe the issue
              </label>

              <textarea
                id="problem-description"
                className="input min-h-36"
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                placeholder="What is happening? Who is affected? Include only details you observed."
              />

            </div>

            {/* ------------------------------------------------ */}
            {/* PHOTO */}
            {/* ------------------------------------------------ */}

            <div className="mt-6">

              <label className="label">
                Add Photo of the Issue
              </label>

              {preview ? (

                <div>

                  <img
                    src={preview}
                    alt="Selected issue"
                    className="h-52 w-full rounded-2xl object-cover"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        input.current?.click()
                      }
                      className="btn bg-slate-100"
                    >
                      Change image
                    </button>

                    <button
                      onClick={() =>
                        setPreview("")
                      }
                      className="btn bg-slate-100"
                    >
                      <X className="h-4 w-4" />

                      Remove
                    </button>

                  </div>

                </div>

              ) : (

                <button
                  onClick={() =>
                    input.current?.click()
                  }
                  className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-moss/30 p-10 text-center hover:bg-lime/20"
                >

                  <ImagePlus className="mb-3 h-8 w-8 text-moss" />

                  <b>
                    Upload / Take Photo
                  </b>

                  <span className="mt-1 text-sm text-slate-500">
                    JPG, PNG or take a photo from your device
                  </span>

                </button>

              )}

              <input
                ref={input}
                className="hidden"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {

                  const f =
                    e.target.files?.[0];

                  if (f) {

                    setPreview(
                      URL.createObjectURL(f)
                    );

                    // Capture location when photo is selected
                    getCurrentLocation();
                  }

                }}
              />

              <p className="mt-3 text-xs text-slate-500">
                Examples: {examples.join(" · ")}
              </p>

            </div>

            {/* ------------------------------------------------ */}
            {/* VOICE */}
            {/* ------------------------------------------------ */}

            <div
              id="voice-section"
              className="mt-6"
            >

              <label className="label">
                Report by Voice
                <span className="ml-2 font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <p className="mb-3 text-sm text-slate-500">
                Speak about the problem. Your speech will
                automatically be converted into text.
              </p>

              {/* LANGUAGE */}

              <div className="mb-4 flex flex-wrap gap-2">

                <LanguageButton
                  active={language === "en-IN"}
                  onClick={() =>
                    setLanguage("en-IN")
                  }
                  icon={<Globe className="h-4 w-4" />}
                  text="English"
                />

                <LanguageButton
                  active={language === "hi-IN"}
                  onClick={() =>
                    setLanguage("hi-IN")
                  }
                  text="हिंदी"
                />

                <LanguageButton
                  active={language === "mr-IN"}
                  onClick={() =>
                    setLanguage("mr-IN")
                  }
                  text="मराठी"
                />

              </div>

              {/* VOICE BUTTON */}

              <button
                onClick={() => {
                  getCurrentLocation();
                  startVoice();
                }}
                className={`flex w-full items-center justify-center gap-3 rounded-2xl p-5 font-bold transition ${
                  listening
                    ? "bg-red-600 text-white"
                    : "bg-lime text-ink hover:opacity-90"
                }`}
              >

                <Mic className="h-5 w-5" />

                {listening
                  ? "Listening..."
                  : "Click to Speak"}

              </button>

              {voiceState && (

                <p className="mt-3 text-sm font-medium text-moss">
                  {voiceState}
                </p>

              )}

              {text && (

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Voice transcription
                  </p>

                  <p className="mt-2 text-sm">
                    {text}
                  </p>

                </div>

              )}

            </div>

            {/* ------------------------------------------------ */}
            {/* LOCATION */}
            {/* ------------------------------------------------ */}

            <div className="mt-6 rounded-2xl border border-moss/20 bg-lime/20 p-4">

              <div className="flex items-start gap-3">

                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime text-moss">

                  <MapPin className="h-5 w-5" />

                </div>

                <div className="flex-1">

                  <p className="text-sm font-bold text-moss">
                    REPORT LOCATION
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {location
                      ? `${location.area}, ${location.city}`
                      : locationStatus}
                  </p>

                  {location && (

                    <div className="mt-3 space-y-1 text-xs text-slate-600">

                      <p>
                        <b>Area:</b>{" "}
                        {location.area}
                      </p>

                      <p>
                        <b>City:</b>{" "}
                        {location.city}
                      </p>

                      <p>
                        <b>District:</b>{" "}
                        {location.district}
                      </p>

                      <p>
                        <b>State:</b>{" "}
                        {location.state}
                      </p>

                      <p>
                        <b>Country:</b>{" "}
                        {location.country}
                      </p>

                      <p>
                        <b>GPS:</b>{" "}
                        {location.latitude.toFixed(6)},{" "}
                        {location.longitude.toFixed(6)}
                      </p>

                    </div>

                  )}

                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="mt-3 flex items-center gap-2 text-sm font-bold text-moss hover:underline"
                  >

                    <MapPin className="h-4 w-4" />

                    Get my current location

                  </button>

                </div>

              </div>

            </div>

            {/* ------------------------------------------------ */}
            {/* ANALYZE BUTTON */}
            {/* ------------------------------------------------ */}

            <button
              disabled={
                (!text.trim() && !preview) ||
                isAnalyzing
              }
              onClick={() => {
                getCurrentLocation();
                analyze();
              }}
              className="btn-primary mt-6"
            >

              {isAnalyzing
                ? "Analyzing..."
                : "Analyze Problem"}

              <ChevronRight className="h-4 w-4" />

            </button>

          </div>

          {/* RIGHT SIDE */}

          <aside className="card p-6">

            <p className="text-sm font-bold text-moss">
              TRY SAHAAY
            </p>

            <h2 className="mt-1 text-xl font-black">
              A real issue around you?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Test how SAHAAY turns it into an actionable
              community challenge.
            </p>

            <DemoCard
              icon={<Camera />}
              title="PHOTO DEMO"
              body="Take a photo or upload an image of a minor issue around your home/community."
              action="Try Photo Reporting"
              onClick={() => {
                input.current?.click();
              }}
            />

            <DemoCard
              icon={<Mic />}
              title="VOICE DEMO"
              body="Speak about a community problem in English, Hindi or Marathi."
              action="Try Voice Reporting"
              onClick={() => {
                document
                  .getElementById("voice-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
              }}
            />

            <DemoCard
              icon={<MapPin />}
              title="REPORT LOCATION"
              body={
                location
                  ? `${location.area}, ${location.city}, ${location.state}`
                  : "Location will be captured automatically when you report."
              }
              action="Get my current location"
              onClick={getCurrentLocation}
            />

            <div className="mt-4 rounded-2xl bg-lime/30 p-4">

              <p className="text-sm font-bold text-moss">
                PRIVACY
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Your location is used to identify where the
                community problem was reported.
              </p>

            </div>

          </aside>

        </section>

        {/* ------------------------------------------------ */}
        {/* ANALYSIS */}
        {/* ------------------------------------------------ */}

        {analysis && (

          <section
            ref={analysisRef}
            className="card mt-7 border-moss/20 p-6 md:p-7"
          >

            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">

              <div>

                <p className="flex items-center gap-2 text-sm font-bold text-moss">

                  <Sparkles className="h-4 w-4" />

                  AI-ASSISTED PROBLEM ANALYSIS

                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {analysis.title}
                </h2>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  analysis.severity === "High"
                    ? "bg-red-100 text-red-700"
                    : analysis.severity === "Medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >

                {analysis.severity} severity

              </span>

            </div>

            {analysis.demo && (

              <p className="mb-5 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                Prototype/demo analysis. Review the result before
                submitting.
              </p>

            )}

            <div className="grid gap-5 md:grid-cols-2">

              <Detail
                label="Category"
                value={analysis.category}
              />

              <Detail
                label="Summary"
                value={analysis.summary}
              />

              <Detail
                label="Recommended action"
                value={analysis.action}
              />

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Potential collaborators
                </p>

                <div className="mt-2 flex flex-wrap gap-2">

                  <Pill
                    icon={<Landmark />}
                    text="Government"
                  />

                  <Pill
                    icon={<GraduationCap />}
                    text="University"
                  />

                  <Pill
                    icon={<Building2 />}
                    text="Industry / CSR"
                  />

                </div>

              </div>

            </div>

            {/* LOCATION IN ANALYSIS */}

            {location && (

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">

                <div className="flex items-center gap-2">

                  <MapPin className="h-5 w-5 text-moss" />

                  <p className="font-bold">
                    Report Location
                  </p>

                </div>

                <p className="mt-2 text-sm text-slate-600">

                  {location.area},{" "}
                  {location.city},{" "}
                  {location.district},{" "}
                  {location.state},{" "}
                  {location.country}

                </p>

                <p className="mt-1 text-xs text-slate-400">

                  GPS:{" "}
                  {location.latitude.toFixed(6)},{" "}
                  {location.longitude.toFixed(6)}

                </p>

              </div>

            )}

            {/* SUBMIT */}

            <button
              onClick={submit}
              className="btn-primary mt-6"
            >

              <CheckCircle2 className="h-4 w-4" />

              Submit Community Challenge

            </button>

          </section>

        )}

        {/* SUCCESS */}

        {success && (

          <p className="mt-7 rounded-2xl bg-lime/40 p-4 text-sm font-semibold text-moss">
            {success}
          </p>

        )}

        {/* ------------------------------------------------ */}
        {/* MY CHALLENGES */}
        {/* ------------------------------------------------ */}

        <section className="mt-9 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">

          <div className="card p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <p className="text-sm font-bold text-moss">
                  MY REPORTED CHALLENGES
                </p>

                <h2 className="text-xl font-black">
                  Track your community impact
                </h2>

              </div>

              <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold">
                {sharedChallenges.length} shared
              </span>

            </div>

            {sharedChallenges.length ? (

              sharedChallenges.map((c) => (

                <article
                  key={c.challengeId}
                  className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
                >

                  <div>

                    <p className="font-bold">
                      {c.title}
                    </p>

                    <p className="text-xs text-slate-500">
                      Challenge ID:{" "}
                      {c.challengeId} ·{" "}
                      {c.createdAt}
                    </p>

                  </div>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    {c.status}
                  </span>

                </article>

              ))

            ) : (

              <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                Your submitted challenges will appear here.
              </p>

            )}

          </div>

          <div className="card p-6">

            <p className="text-sm font-bold text-moss">
              YOUR IMPACT
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">

              <Stat
                value={String(
                  12 + sharedChallenges.length
                )}
                label="Issues reported"
              />

              <Stat
                value="3"
                label="Under review"
              />

              <Stat
                value="4"
                label="In progress"
              />

              <Stat
                value="5"
                label="Resolved"
              />

            </div>

          </div>

        </section>

        {/* PROFILE */}

        {showProfile && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="grid h-12 w-12 place-items-center rounded-full bg-lime text-moss">

                    <UserRound className="h-6 w-6" />

                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-moss">
                      Profile
                    </p>

                    <h2 className="text-xl font-black">
                      Citizen Account
                    </h2>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowProfile(false)
                  }
                  className="rounded-xl p-2 hover:bg-slate-100"
                >

                  <X className="h-5 w-5" />

                </button>

              </div>

              <div className="mt-6 space-y-3">

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase text-slate-500">
                    Name
                  </p>

                  <p className="mt-1 font-semibold">
                    {profile?.fullName ||
                      "Not provided"}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 font-semibold">
                    {profile?.email ||
                      "Not provided"}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase text-slate-500">
                    Mobile
                  </p>

                  <p className="mt-1 font-semibold">
                    {profile?.phone ||
                      "Not provided"}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase text-slate-500">
                    Role
                  </p>

                  <p className="mt-1 font-semibold text-moss">
                    {profile?.role ||
                      "Citizen"}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowProfile(false)
                }
                className="btn-primary mt-6 w-full"
              >
                Close
              </button>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}

/* ======================================================
   COMPONENTS
====================================================== */

function ModeButton({
  onClick,
  icon,
  title,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border p-4 text-left transition hover:border-moss hover:bg-lime/20"
    >

      <span className="mb-4 block text-moss">
        {icon}
      </span>

      <span className="text-sm font-bold">
        {title}
      </span>

    </button>
  );
}

function LanguageButton({
  active,
  onClick,
  text,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  text: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition ${
        active
          ? "border-moss bg-lime text-ink"
          : "bg-white hover:border-moss"
      }`}
    >

      {icon}

      {text}

    </button>
  );
}

function DemoCard({
  icon,
  title,
  body,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-4 rounded-2xl bg-slate-50 p-4">

      <div className="flex gap-3">

        <span className="text-moss">
          {icon}
        </span>

        <div>

          <p className="text-xs font-bold tracking-wider text-moss">
            {title}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {body}
          </p>

        </div>

      </div>

      <button
        onClick={onClick}
        className="mt-3 text-sm font-bold text-moss hover:underline"
      >

        {action} →

      </button>

    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-700">
        {value}
      </p>

    </div>
  );
}

function Pill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">

      {icon}

      {text}

    </span>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-lime/30 p-4">

      <p className="text-2xl font-black">
        {value}
      </p>

      <p className="text-xs text-slate-600">
        {label}
      </p>

    </div>
  );
}