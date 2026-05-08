"use client";

import { useEffect } from "react";

export function ReferralCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref && ref.trim()) {
        localStorage.setItem("referral_code", ref.trim());
      }
    } catch {
      // localStorage unavailable — skip silently
    }
  }, []);

  return null;
}
