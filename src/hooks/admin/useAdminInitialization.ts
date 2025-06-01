import { useEffect } from "react";

import { useUserStore } from "@/stores/useUserStore";

import { useAdminStatsStore } from "@/stores/admin/useAdminStatsStore";
import { useAdminLocationsStore } from "@/stores/admin/useAdminLocationsStore";
import { useAdminPushesStore } from "@/stores/admin/useAdminPushesStore";
import { useAdminReferralEarningsStore } from "@/stores/admin/useAdminReferralEarningsStore";
import { useAdminReferralsStore } from "@/stores/admin/useAdminReferralsStore";
import { useAdminTasksStore } from "@/stores/admin/useAdminTasksStore";
import { useAdminTransactionsStore } from "@/stores/admin/useAdminTransactionsStore";
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

    const { fetchStats } = useAdminStatsStore();
    const { fetchProfiles, subscribeToProfiles } = useAdminReferralsStore();
    const { fetchTransactions, subscribeToTransactions } =
        useAdminTransactionsStore();
    const { fetchWallets, subscribeToWallets } = useAdminWalletsStore();
    const { fetchLocations, subscribeToLocations } = useAdminLocationsStore();
    const { fetchUserLocations, subscribeToUserLocations } =
        useAdminUserLocationsStore();
    const { fetchWindMods, subscribeToWindMods } = useAdminWindModsStore();
    const { fetchUserMods, subscribeToUserMods } = useAdminUserModsStore();
    const { fetchPushes, subscribeToPushes } = useAdminPushesStore();
    const { fetchTasks, subscribeToTasks } = useAdminTasksStore();
    const { fetchUserTasks, subscribeToUserTasks } = useAdminUserTasksStore();
    const { fetchReferralEarnings, subscribeToReferralEarnings } =
        useAdminReferralEarningsStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        fetchProfiles();
        subscribeToProfiles();
    }, [fetchProfiles, subscribeToProfiles]);

    useEffect(() => {
        fetchTransactions();
        subscribeToTransactions();
    }, [fetchTransactions, subscribeToTransactions]);

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

    useEffect(() => {
        fetchReferralEarnings();
        subscribeToReferralEarnings();
    }, [fetchReferralEarnings, subscribeToReferralEarnings]);
}
