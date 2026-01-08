import { DataTable } from "@/components/data-table/DataTable";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

export const ReferalsTreeComponent = ({ uid }: { uid: string }) => {
    

    const referalsColumns = [
        {
            header: "Telegram ID",
            accessorKey: "telegramID",
        },
        {
            header: "Ім'я",
            accessorKey: "firstName",
        },
        {
            header: 'Кі-сть рефералів',
            accessorKey: "referals",
            cell: ({ getValue }: { getValue: () => any }) => {
                const referals = getValue()
                return referals?.length || 0
            }
        },
        {
            header: "kwt",
            accessorKey: "rewardFromClicks",
        },
        {
            header: "ton",
            accessorKey: "TONRewardFromClicks",
        },
    ]

    const [referalsData, setReferalsData] = useState<any[]>([]);
    const [referalsData2, setReferalsData2] = useState<any[]>([]);
    const [referalsData3, setReferalsData3] = useState<any[]>([]);
    const [referalsData4, setReferalsData4] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const [isLoading4, setIsLoading4] = useState(false);

    const [selectedRowid, setSelectedRowid] = useState<string>('')
    const [selectedSubRowId, setSelectedSubRowId] = useState<string>('')
    const [selectedSub3RowId, setSelectedSub3RowId] = useState<string>('')

    const fetchReferalData = useCallback(async (referalId: string, level: number) => {
        const response = await axios.get(`https://wind-game-be.fly.dev/referal?uid=${referalId}`, {
            headers: {
              "ngrok-skip-browser-warning": true,
            },
        });
        if (level === 1) {
            setReferalsData(response.data.map((item: any) => ({
                ...item,
                id: item.telegramID,
            })));
            setIsLoading(false);
        } else if (level === 2) {
            setReferalsData2(response.data.map((item: any) => ({
                ...item,
                id: item.telegramID,
            })));
            setIsLoading2(false);
        } else if (level === 3) {
            setReferalsData3(response.data.map((item: any) => ({
                ...item,
                id: item.telegramID,
            })));
            setIsLoading3(false);
        } else if (level === 4) {
            setReferalsData4(response.data.map((item: any) => ({
                ...item,
                id: item.telegramID,
            })));
            setIsLoading4(false);
        }
    }, [])

    useEffect(() => {
       if (uid) {
        fetchReferalData(uid, 1);
       }
    }, [fetchReferalData, uid])

    const handleRowClick = useCallback((row: any, level: number) => {
        if (level === 2) {
            setSelectedSub3RowId('');
            setSelectedSubRowId('');
            if (selectedRowid === row.telegramID) {
                setSelectedRowid('');
                return;
            }
            fetchReferalData(row.telegramID, 2);
            setSelectedRowid(row.telegramID);
            setIsLoading2(true);
        } else if (level === 3) {
            setSelectedSub3RowId('');
            if (selectedSubRowId === row.telegramID) {
                setSelectedSubRowId('');
                return;
            }
            fetchReferalData(row.telegramID, 3);
            setSelectedSubRowId(row.telegramID);
            setIsLoading3(true);
        } else if (level === 4) {
            if (selectedSub3RowId === row.telegramID) {
                setSelectedSub3RowId('');
                return;
            }
            fetchReferalData(row.telegramID, 4);
            setSelectedSub3RowId(row.telegramID);
            setIsLoading4(true);
        }
    }, [fetchReferalData, setSelectedRowid, setSelectedSubRowId, setSelectedSub3RowId, selectedRowid, selectedSubRowId, selectedSub3RowId])

    return (
        <div className="max-h-[400px] overflow-auto rounded border dark:border-gray-700">
            <DataTable
                data={referalsData}
                columns={referalsColumns}
                onRowClick={(row: any) => {
                    handleRowClick(row, 2);
                }}
                openSidebarOnRowClick={true}
                simple
                isLoading={isLoading}
                selectedRowid={selectedRowid}
                simpleTitle="1 рівень"
                border="1px solid red"
                dropDownComponent={
                    <DataTable 
                        data={referalsData2} 
                        columns={referalsColumns} 
                        onRowClick={(row: any) => {
                            handleRowClick(row, 3);
                        }} 
                        openSidebarOnRowClick={true}
                        simple={true} 
                        simpleTitle="2 рівень"
                        isLoading={isLoading2} 
                        selectedRowid={selectedSubRowId}
                        border="1px solid green"
                        dropDownComponent={
                            <DataTable 
                                data={referalsData3} 
                                columns={referalsColumns} 
                                simpleTitle="3 рівень"
                                onRowClick={(row: any) => {
                                    handleRowClick(row, 4);
                                }}
                                openSidebarOnRowClick={true}
                                simple={true} 
                                isLoading={isLoading3} 
                                selectedRowid={selectedSub3RowId}
                                border="1px solid blue"
                                dropDownComponent={
                                    <DataTable 
                                        data={referalsData4} 
                                        columns={referalsColumns} 
                                        simpleTitle="4 рівень"
                                        openSidebarOnRowClick={true} 
                                        simple={true} 
                                        isLoading={isLoading4} 
                                        border="1px solid yellow"
                                    />
                                }
                            />
                        }
                    />
                }
            />
        </div>
    )
}
