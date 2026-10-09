"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase_client";
import type { MatchProfile } from "@/lib/salon_match";

export type MapProfileState = MatchProfile & {
    favorites: number[];
    isAuthenticated: boolean;
    isLoading: boolean;
};

const emptyProfile: MapProfileState = {
    specialty: [],
    desired_locations: [],
    preferred_atmospheres: [],
    preferred_customer_ages: [],
    preferred_staff_ages: [],
    preferred_customer_gender: null,
    preferred_international_frequencies: [],
    favorites: [],
    isAuthenticated: false,
    isLoading: true,
};

export function useMapProfile() {
    const [profile, setProfile] = useState<MapProfileState>(emptyProfile);

    useEffect(() => {
        const supabase = createClient();
        let active = true;
        let requestId = 0;
        let ignoreInitialAuthEvent = true;

        const fetchProfile = async () => {
            const currentRequest = ++requestId;
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!active || currentRequest !== requestId) return;
                if (!user) {
                    setProfile({ ...emptyProfile, isLoading: false });
                    return;
                }

                const { data, error } = await supabase.from("profiles")
                    .select("specialty, favorite, desired_locations, preferred_atmospheres, preferred_customer_ages, preferred_staff_ages, preferred_customer_gender, preferred_international_frequencies")
                    .eq("id", user.id)
                    .single();
                if (!active || currentRequest !== requestId) return;

                setProfile({
                    specialty: !error && Array.isArray(data?.specialty) ? data.specialty : [],
                    desired_locations: !error && Array.isArray(data?.desired_locations) ? data.desired_locations : [],
                    preferred_atmospheres: !error && Array.isArray(data?.preferred_atmospheres) ? data.preferred_atmospheres : [],
                    preferred_customer_ages: !error && Array.isArray(data?.preferred_customer_ages) ? data.preferred_customer_ages : [],
                    preferred_staff_ages: !error && Array.isArray(data?.preferred_staff_ages) ? data.preferred_staff_ages : [],
                    preferred_customer_gender: !error && typeof data?.preferred_customer_gender === "string" ? data.preferred_customer_gender : null,
                    preferred_international_frequencies: !error && Array.isArray(data?.preferred_international_frequencies) ? data.preferred_international_frequencies : [],
                    favorites: !error && Array.isArray(data?.favorite) ? data.favorite : [],
                    isAuthenticated: true,
                    isLoading: false,
                });
            } catch {
                if (active && currentRequest === requestId) {
                    setProfile({ ...emptyProfile, isLoading: false });
                }
            }
        };

        const { data: authListener } = supabase.auth.onAuthStateChange(() => {
            if (ignoreInitialAuthEvent) {
                ignoreInitialAuthEvent = false;
                return;
            }
            void Promise.resolve().then(() => {
                if (active) void fetchProfile();
            });
        });

        void fetchProfile();
        window.addEventListener("focus", fetchProfile);
        return () => {
            active = false;
            ++requestId;
            authListener.subscription.unsubscribe();
            window.removeEventListener("focus", fetchProfile);
        };
    }, []);

    return profile;
}

