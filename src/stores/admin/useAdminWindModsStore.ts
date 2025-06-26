import { WindModData, type WindMod } from "@/types/windMod"
import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"
export type CountryCodes = "nl" | "dk" | "gr" | "usa"

export const countryCodeToNameMap: Record<CountryCodes, string> = {
  nl: "Нідерланди",
  dk: "Данія",
  gr: "Німеччина",
  usa: "США",
}

interface AdminWindModsState {
  windMods: WindModData[]
  activeWindMod: WindMod | null
  selectedCountry: CountryCodes
  isLoading: boolean
  error: string | null
  setSelectedCountry: (countryCode: CountryCodes) => void
  setActiveWindMod: (mod: WindMod | null) => void
  updateActiveWindMod: (
    countryCode: CountryCodes,
    payload: WindMod,
  ) => Promise<void>
  fetchWindMods: () => Promise<void>
  subscribeToWindMods: () => Promise<() => void>
}

const supabase = createClient()

export const useAdminWindModsStore = create<AdminWindModsState>((set) => ({
  windMods: [],
  selectedCountry: "nl",
  isLoading: true,
  error: null,
  activeWindMod: null,
  setSelectedCountry: (countryCode: CountryCodes) =>
    set({ selectedCountry: countryCode }),

  updateActiveWindMod: async (countryCode: CountryCodes, payload: WindMod) => {
    set({ isLoading: true })
    try {
      const { data, error: fetchError } = await supabase
        .from("modifiers")
        .select()
        .eq("area", countryCode)
        .single()

      if (fetchError) throw fetchError
      if (!data) throw new Error(`No modifiers found for area: ${countryCode}`)

      const updatedValues = (data.values as WindMod[]).map((mod) =>
        mod.price === payload.price ? { ...mod, ...payload } : mod,
      )

      const { error } = await supabase
        .from("modifiers")
        .update({ values: updatedValues })
        .eq("id", data.id)

      if (error) throw error

      set((state) => ({
        windMods: state.windMods.map((windModeData) =>
          windModeData.area === countryCode
            ? { ...windModeData, values: updatedValues }
            : windModeData,
        ),
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating wind mod:", error)
      set({ error: "Failed to update wind mod", isLoading: false })
    }
  },
  setActiveWindMod: (mod) => set({ activeWindMod: mod }),

  fetchWindMods: async () => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from("modifiers")
        .select()
        .order("area", { ascending: true })

      if (error) throw error

      set({ windMods: data || [], isLoading: false })
    } catch (error) {
      console.error("Error fetching wind mods:", error)
      set({ error: "Failed to load wind mods", isLoading: false })
    }
  },

  subscribeToWindMods: async () => {
    const channel = supabase
      .channel("mdifiers")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mdifiers",
        },
        () => {
          set((state) => {
            state.fetchWindMods()
            return state
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}))
