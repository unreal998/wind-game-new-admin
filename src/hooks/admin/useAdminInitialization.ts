import { useEffect } from "react";

import { useUserStore } from "@/stores/useUserStore";

import { useAdminLocationsStore } from "@/stores/admin/useAdminLocationsStore";
import { useAdminPushesStore } from "@/stores/admin/useAdminPushesStore";
import { useAdminReferralsStore } from "@/stores/admin/useAdminReferralsStore";
import { useAdminTasksStore } from "@/stores/admin/useAdminTasksStore";
import { useAdminUserLocationsStore } from "@/stores/admin/useAdminUserLocationsStore";
import { useAdminUserModsStore } from "@/stores/admin/useAdminUserModsStore";
import { useAdminUserTasksStore } from "@/stores/admin/useAdminUserTasksStore";
import { useAdminWalletsStore } from "@/stores/admin/useAdminWalletsStore";
import { useAdminWindModsStore } from "@/stores/admin/useAdminWindModsStore";

export function useAdminInitialization() {
    const {
        getCurrentProfileUserAsync,
    } = useUserStore();

    // Ініціалізація користувача
    useEffect(() => {
        getCurrentProfileUserAsync();
    }, [
        getCurrentProfileUserAsync,
    ]);

    const { fetchProfiles, subscribeToProfiles } = useAdminReferralsStore();
    const { fetchWallets, subscribeToWallets } = useAdminWalletsStore();
    const { fetchLocations, subscribeToLocations } = useAdminLocationsStore();
    const { fetchUserLocations, subscribeToUserLocations } =
        useAdminUserLocationsStore();
    const { fetchWindMods, subscribeToWindMods } = useAdminWindModsStore();
    const { fetchUserMods, subscribeToUserMods } = useAdminUserModsStore();
    const { fetchPushes, subscribeToPushes } = useAdminPushesStore();
    const { fetchTasks, subscribeToTasks } = useAdminTasksStore();
    const { fetchUserTasks, subscribeToUserTasks } = useAdminUserTasksStore();

    useEffect(() => {
        fetchProfiles();
        subscribeToProfiles();
    }, [fetchProfiles, subscribeToProfiles]);

    useEffect(() => {
        fetchWallets();
        subscribeToWallets();
    }, [fetchWallets, subscribeToWallets]);

    useEffect(() => {
        fetchLocations();
        subscribeToLocations();
    }, [fetchLocations, subscribeToLocations]);

    useEffect(() => {
        fetchUserLocations();
        subscribeToUserLocations();
    }, [fetchUserLocations, subscribeToUserLocations]);

    useEffect(() => {
        fetchWindMods();
        subscribeToWindMods();
    }, [fetchWindMods, subscribeToWindMods]);

    useEffect(() => {
        fetchUserMods();
        subscribeToUserMods();
    }, [fetchUserMods, subscribeToUserMods]);

    useEffect(() => {
        fetchPushes();
        subscribeToPushes();
    }, [fetchPushes, subscribeToPushes]);

    useEffect(() => {
        fetchTasks();
        subscribeToTasks();
    }, [fetchTasks, subscribeToTasks]);

    useEffect(() => {
        fetchUserTasks();
        subscribeToUserTasks();
    }, [fetchUserTasks, subscribeToUserTasks]);
}
