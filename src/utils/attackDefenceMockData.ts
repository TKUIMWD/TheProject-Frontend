// ==================== Attack Defence Mock Data ====================

export interface AD_Scenario {
    scenario_id: number;
    scenario_name: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    duration_in_minutes: number;
    max_teams: number;
    scenario_type: "Red vs Blue" | "Multi Team" | "King of the Hill";
    total_flags: number;
    current_teams: number;
    captured_flags: number;
    status: "Active" | "Upcoming" | "Ended";
    start_time: string;
    end_time: string;
    created_at: string;
}

export interface AD_Team {
    team_id: number;
    scenario_id: number;
    team_name: string;
    team_type: "Red Team" | "Blue Team";
    members: AD_Member[];
    max_members: number;
    score: number;
    flags_captured: number;
    created_at: string;
}

export interface AD_Member {
    user_id: number;
    username: string;
    role: "Leader" | "Member";
    avatar: string;
}

export interface AD_Flag {
    flag_id: number;
    scenario_id: number;
    flag_name: string;
    flag_value: string;
    points: number;
    category: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
    hint: string;
    is_captured: boolean;
    captured_by?: {
        team_id: number;
        team_name: string;
        captured_at: string;
    };
}

export interface AD_VM {
    vm_id: number;
    scenario_id: number;
    vm_name: string;
    vm_type: "Target" | "Attacker" | "Defender";
    os: string;
    ip_address: string;
    services: string[];
    cpu: number;
    memory: number;
    disk: number;
    status: "Running" | "Stopped";
}

// ==================== Mock Data ====================

export const mockScenarios: AD_Scenario[] = [
    {
        scenario_id: 1,
        scenario_name: "Web 應用程式滲透測試",
        description: "針對常見的 Web 應用程式漏洞進行攻防演練，包含 SQL Injection、XSS、CSRF 等常見攻擊手法。紅隊需要找出並利用這些漏洞，藍隊需要防禦並修補系統。",
        difficulty: "Medium",
        duration_in_minutes: 240,
        max_teams: 4,
        scenario_type: "Red vs Blue",
        total_flags: 12,
        current_teams: 2,
        captured_flags: 8,
        status: "Active",
        start_time: "2025-10-31T10:00:00",
        end_time: "2025-10-31T14:00:00",
        created_at: "2025-10-25T09:00:00"
    },
    {
        scenario_id: 2,
        scenario_name: "內網滲透與橫向移動",
        description: "模擬真實企業內網環境，練習內網滲透、橫向移動、權限提升等進階技術。包含 AD 滲透、Pass-the-Hash、Kerberos 攻擊等實戰技巧。",
        difficulty: "Hard",
        duration_in_minutes: 300,
        max_teams: 6,
        scenario_type: "Red vs Blue",
        total_flags: 15,
        current_teams: 0,
        captured_flags: 0,
        status: "Upcoming",
        start_time: "2025-11-05T13:00:00",
        end_time: "2025-11-05T18:00:00",
        created_at: "2025-10-20T14:30:00"
    },
    {
        scenario_id: 3,
        scenario_name: "雲端安全攻防",
        description: "針對雲端環境的安全防護進行演練，包含 AWS、Azure、GCP 等主流雲端平台的常見錯誤配置和攻擊手法。",
        difficulty: "Easy",
        duration_in_minutes: 180,
        max_teams: 8,
        scenario_type: "Multi Team",
        total_flags: 10,
        current_teams: 5,
        captured_flags: 10,
        status: "Ended",
        start_time: "2025-10-28T09:00:00",
        end_time: "2025-10-28T12:00:00",
        created_at: "2025-10-15T10:00:00"
    },
    {
        scenario_id: 4,
        scenario_name: "IoT 設備安全挑戰",
        description: "針對物聯網設備的安全性進行測試，包含韌體分析、硬體偵錯、無線通訊攔截等技術。",
        difficulty: "Hard",
        duration_in_minutes: 240,
        max_teams: 4,
        scenario_type: "King of the Hill",
        total_flags: 8,
        current_teams: 1,
        captured_flags: 0,
        status: "Upcoming",
        start_time: "2025-11-10T14:00:00",
        end_time: "2025-11-10T18:00:00",
        created_at: "2025-10-22T11:00:00"
    }
];

export const mockTeams: AD_Team[] = [
    {
        team_id: 1,
        scenario_id: 1,
        team_name: "Red Hawks",
        team_type: "Red Team",
        members: [
            {
                user_id: 10,
                username: "hacker_alice",
                role: "Leader",
                avatar: "https://i.pravatar.cc/150?u=alice"
            },
            {
                user_id: 11,
                username: "pentester_bob",
                role: "Member",
                avatar: "https://i.pravatar.cc/150?u=bob"
            },
            {
                user_id: 12,
                username: "exploit_carol",
                role: "Member",
                avatar: "https://i.pravatar.cc/150?u=carol"
            }
        ],
        max_members: 5,
        score: 850,
        flags_captured: 5,
        created_at: "2025-10-28T09:30:00"
    },
    {
        team_id: 2,
        scenario_id: 1,
        team_name: "Blue Defenders",
        team_type: "Blue Team",
        members: [
            {
                user_id: 20,
                username: "defender_dave",
                role: "Leader",
                avatar: "https://i.pravatar.cc/150?u=dave"
            },
            {
                user_id: 21,
                username: "soc_analyst_eve",
                role: "Member",
                avatar: "https://i.pravatar.cc/150?u=eve"
            },
            {
                user_id: 22,
                username: "incident_frank",
                role: "Member",
                avatar: "https://i.pravatar.cc/150?u=frank"
            },
            {
                user_id: 23,
                username: "forensic_grace",
                role: "Member",
                avatar: "https://i.pravatar.cc/150?u=grace"
            }
        ],
        max_members: 5,
        score: 720,
        flags_captured: 3,
        created_at: "2025-10-28T10:15:00"
    },
    {
        team_id: 3,
        scenario_id: 3,
        team_name: "Cloud Masters",
        team_type: "Red Team",
        members: [
            {
                user_id: 30,
                username: "cloud_hacker",
                role: "Leader",
                avatar: "https://i.pravatar.cc/150?u=cloudhacker"
            },
            {
                user_id: 31,
                username: "aws_expert",
                role: "Member",
                avatar: "https://i.pravatar.cc/150?u=awsexpert"
            }
        ],
        max_members: 4,
        score: 950,
        flags_captured: 8,
        created_at: "2025-10-27T14:00:00"
    },
    {
        team_id: 4,
        scenario_id: 4,
        team_name: "IoT Warriors",
        team_type: "Red Team",
        members: [
            {
                user_id: 40,
                username: "iot_hunter",
                role: "Leader",
                avatar: "https://i.pravatar.cc/150?u=iothunter"
            },
            {
                user_id: 41,
                username: "firmware_ninja",
                role: "Member",
                avatar: "https://i.pravatar.cc/150?u=firmwareninja"
            }
        ],
        max_members: 4,
        score: 0,
        flags_captured: 0,
        created_at: "2025-10-29T16:20:00"
    }
];

export const mockFlags: AD_Flag[] = [
    {
        flag_id: 1,
        scenario_id: 1,
        flag_name: "SQL Injection Basic",
        flag_value: "FLAG{sql_1nj3ct10n_m4st3r}",
        points: 100,
        category: "Web",
        difficulty: "Easy",
        description: "在登入頁面找出 SQL Injection 漏洞並繞過驗證",
        hint: "試試看 ' OR '1'='1",
        is_captured: true,
        captured_by: {
            team_id: 1,
            team_name: "Red Hawks",
            captured_at: "2025-10-31T10:25:00"
        }
    },
    {
        flag_id: 2,
        scenario_id: 1,
        flag_name: "XSS Cookie Stealer",
        flag_value: "FLAG{xss_c00k13_st34l3r}",
        points: 150,
        category: "Web",
        difficulty: "Medium",
        description: "利用 XSS 漏洞竊取管理員的 Session Cookie",
        hint: "留言板沒有做輸入過濾",
        is_captured: true,
        captured_by: {
            team_id: 1,
            team_name: "Red Hawks",
            captured_at: "2025-10-31T10:45:00"
        }
    },
    {
        flag_id: 3,
        scenario_id: 1,
        flag_name: "File Upload Webshell",
        flag_value: "FLAG{w3bsh3ll_upl04d3d}",
        points: 200,
        category: "Web",
        difficulty: "Medium",
        description: "繞過檔案上傳限制並上傳 Webshell",
        hint: "只檢查副檔名是不夠的",
        is_captured: true,
        captured_by: {
            team_id: 1,
            team_name: "Red Hawks",
            captured_at: "2025-10-31T11:20:00"
        }
    },
    {
        flag_id: 4,
        scenario_id: 1,
        flag_name: "Privilege Escalation",
        flag_value: "FLAG{r00t_4cc3ss_gr4nt3d}",
        points: 250,
        category: "System",
        difficulty: "Hard",
        description: "從 www-data 提權至 root",
        hint: "檢查 SUID 程式",
        is_captured: false
    },
    {
        flag_id: 5,
        scenario_id: 1,
        flag_name: "CSRF Token Bypass",
        flag_value: "FLAG{csrf_byp4ss3d}",
        points: 120,
        category: "Web",
        difficulty: "Easy",
        description: "繞過 CSRF 保護機制",
        hint: "Token 驗證不夠嚴格",
        is_captured: false
    }
];

export const mockVMs: AD_VM[] = [
    {
        vm_id: 101,
        scenario_id: 1,
        vm_name: "Web Server - Ubuntu 20.04",
        vm_type: "Target",
        os: "Ubuntu 20.04 LTS",
        ip_address: "192.168.100.10",
        services: ["Apache 2.4", "MySQL 5.7", "PHP 7.4"],
        cpu: 2,
        memory: 4096,
        disk: 20,
        status: "Running"
    },
    {
        vm_id: 102,
        scenario_id: 1,
        vm_name: "Attacker Kali Linux",
        vm_type: "Attacker",
        os: "Kali Linux 2023.3",
        ip_address: "192.168.100.100",
        services: ["Metasploit", "Burp Suite", "SQLMap"],
        cpu: 4,
        memory: 8192,
        disk: 40,
        status: "Running"
    }
];

// ==================== Helper Functions ====================

export const getScenarioById = (id: number): AD_Scenario | undefined => {
    return mockScenarios.find(s => s.scenario_id === id);
};

export const getTeamsByScenario = (scenarioId: number): AD_Team[] => {
    return mockTeams.filter(t => t.scenario_id === scenarioId);
};

export const getFlagsByScenario = (scenarioId: number): AD_Flag[] => {
    return mockFlags.filter(f => f.scenario_id === scenarioId);
};

export const getVMsByScenario = (scenarioId: number): AD_VM[] => {
    return mockVMs.filter(vm => vm.scenario_id === scenarioId);
};

export const getStatistics = () => {
    return {
        total_scenarios: mockScenarios.length,
        active_scenarios: mockScenarios.filter(s => s.status === "Active").length,
        upcoming_scenarios: mockScenarios.filter(s => s.status === "Upcoming").length,
        ended_scenarios: mockScenarios.filter(s => s.status === "Ended").length,
        total_teams: mockTeams.length,
        total_players: mockTeams.reduce((sum, team) => sum + team.members.length, 0),
        total_flags: mockFlags.length,
        captured_flags: mockFlags.filter(f => f.is_captured).length,
        total_score: mockTeams.reduce((sum, team) => sum + team.score, 0)
    };
};
