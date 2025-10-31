# Attack Defence Mock Data 使用說明

## 📁 檔案結構

```
src/utils/attackDefenceMockData.ts    # 集中的 Mock Data 來源
src/view/AttackandDefence.tsx         # 場景列表頁（已更新）
src/view/ScenarioDetail.tsx           # 場景詳情頁（需手動調整）
src/view/JoinScenario.tsx             # 加入場景頁（已更新）
src/view/CreateScenario.tsx           # 建立場景頁（無需修改）
```

## 🗂️ Mock Data 內容

### 資料類型

```typescript
// 場景
AD_Scenario - 4 個場景（Active, Upcoming, Ended 狀態）

// 隊伍
AD_Team - 4 個隊伍（Red Hawks, Blue Defenders, Cloud Masters, IoT Warriors）

// Flags
AD_Flag - 5 個 Flags（含已捕獲和未捕獲）

// 虛擬機
AD_VM - 2 個 VM（Web Server 和 Kali Linux）
```

### 統計資料

```typescript
{
    total_scenarios: 4,
    active_scenarios: 1,
    upcoming_scenarios: 2,
    ended_scenarios: 1,
    total_teams: 4,
    total_players: 11,
    total_flags: 5,
    captured_flags: 3,
    total_score: 2520
}
```

## 🚀 使用方式

### 1. 匯入 Mock Data

```typescript
import { 
    mockScenarios,           // 所有場景
    getScenarioById,         // 根據 ID 取得場景
    getTeamsByScenario,      // 取得場景的隊伍
    getFlagsByScenario,      // 取得場景的 Flags
    getVMsByScenario,        // 取得場景的 VM
    getStatistics,           // 取得統計資料
    AD_Scenario,             // TypeScript 型別
    AD_Team,
    AD_Flag,
    AD_VM
} from "../utils/attackDefenceMockData";
```

### 2. 在 AttackandDefence.tsx 使用

```typescript
export default function AttackAndDefence() {
    const [scenarios] = useState<AD_Scenario[]>(mockScenarios);
    const statistics = getStatistics();
    
    // 直接使用，無需 API 呼叫
}
```

### 3. 在 ScenarioDetail.tsx 使用

```typescript
export default function ScenarioDetail() {
    const { scenarioId } = useParams<{ scenarioId: string }>();
    const [scenario, setScenario] = useState<AD_Scenario | null>(null);
    const [teams, setTeams] = useState<AD_Team[]>([]);
    const [flags, setFlags] = useState<AD_Flag[]>([]);
    const [vms, setVMs] = useState<AD_VM[]>([]);

    useEffect(() => {
        if (scenarioId) {
            loadData(parseInt(scenarioId));
        }
    }, [scenarioId]);

    const loadData = (id: number) => {
        const scenarioData = getScenarioById(id);
        if (scenarioData) {
            setScenario(scenarioData);
            setTeams(getTeamsByScenario(id));
            setFlags(getFlagsByScenario(id));
            setVMs(getVMsByScenario(id));
        }
    };
}
```

### 4. 在 JoinScenario.tsx 使用

```typescript
export default function JoinScenario() {
    const { scenarioId } = useParams<{ scenarioId: string }>();
    const [teams, setTeams] = useState<AD_Team[]>([]);

    useEffect(() => {
        if (scenarioId) {
            const teamsData = getTeamsByScenario(parseInt(scenarioId));
            setTeams(teamsData);
        }
    }, [scenarioId]);
}
```

## 📋 可訪問的頁面

### 1. 場景列表
- 路徑：`/attackAndDefence`
- 狀態：✅ 正常運作
- 功能：顯示 4 個場景、統計資料、篩選功能

### 2. 場景詳情
- 路徑：`/attackAndDefence/scenarios/1` (ID: 1-4)
- 狀態：⚠️ 需要調整（移除舊的 mock data）
- 功能：顯示場景詳情、隊伍、Flags、VM 配置

### 3. 加入場景
- 路徑：`/attackAndDefence/scenarios/1/join`
- 狀態：✅ 正常運作
- 功能：顯示現有隊伍、加入或建立隊伍

### 4. 建立場景
- 路徑：`/attackAndDefence/create`
- 狀態：✅ 正常運作
- 功能：建立新場景表單

## 🎯 Mock Data 詳情

### Scenario 1 (Active)
```typescript
scenario_id: 1
scenario_name: "Web 應用程式滲透測試"
status: "Active"
current_teams: 2  // Red Hawks, Blue Defenders
total_flags: 12
captured_flags: 8
```

### Scenario 2 (Upcoming)
```typescript
scenario_id: 2
scenario_name: "內網滲透與橫向移動"
status: "Upcoming"
current_teams: 0
total_flags: 15
```

### Scenario 3 (Ended)
```typescript
scenario_id: 3
scenario_name: "雲端安全攻防"
status: "Ended"
current_teams: 5  // Cloud Masters 等
total_flags: 10
captured_flags: 10  // 全部已捕獲
```

### Scenario 4 (Upcoming)
```typescript
scenario_id: 4
scenario_name: "IoT 設備安全挑戰"
status: "Upcoming"
current_teams: 1  // IoT Warriors
total_flags: 8
```

## 🔧 Helper Functions

```typescript
// 取得單一場景
const scenario = getScenarioById(1);

// 取得場景的隊伍
const teams = getTeamsByScenario(1);  // 回傳 Red Hawks, Blue Defenders

// 取得場景的 Flags
const flags = getFlagsByScenario(1);  // 回傳 5 個 flags

// 取得場景的 VM
const vms = getVMsByScenario(1);  // 回傳 2 個 VMs

// 取得統計資料
const stats = getStatistics();
```

## ⚠️ 需要手動調整的檔案

### ScenarioDetail.tsx
由於檔案中有重複內容，需要：
1. 移除舊的 interface 定義（已在 mockData 中定義）
2. 移除舊的 mock data
3. 使用新的 helper functions

### 建議的修改步驟：
1. 刪除第 7-64 行的舊 interface
2. 刪除第 65-190 行的舊 mock data
3. 在頂部加入：
```typescript
import { 
    getScenarioById, 
    getTeamsByScenario, 
    getFlagsByScenario, 
    getVMsByScenario,
    AD_Scenario,
    AD_Team,
    AD_Flag,
    AD_VM
} from "../utils/attackDefenceMockData";
```

## 📝 注意事項

1. **ID 類型變更**：從 `string` (`_id`) 改為 `number` (`scenario_id`)
2. **狀態值變更**：從小寫 `active` 改為首字母大寫 `Active`
3. **隊伍類型變更**：從 `red`/`blue` 改為 `Red Team`/`Blue Team`
4. **所有資料純前端**：無需 API 呼叫，直接使用函數取得

## 🎨 資料對應關係

```
Scenario 1 → Red Hawks (team_id: 1) + Blue Defenders (team_id: 2)
Scenario 3 → Cloud Masters (team_id: 3)
Scenario 4 → IoT Warriors (team_id: 4)

Scenario 1 → 5 Flags (flag_id: 1-5)
Scenario 1 → 2 VMs (vm_id: 101, 102)
```

## 🚦 測試建議

### 測試場景列表
1. 訪問 `/attackAndDefence`
2. 應該看到 4 個場景卡片
3. 統計數字應正確顯示
4. 篩選功能應正常運作

### 測試場景詳情
1. 點擊場景卡片的「查看詳情」
2. 應該跳轉到 `/attackAndDefence/scenarios/1`
3. 應該顯示場景資訊、隊伍列表

### 測試加入場景
1. 點擊「加入」按鈕
2. 應該跳轉到 `/attackAndDefence/scenarios/1/join`
3. 應該看到 2 個現有隊伍

### 測試建立場景
1. 點擊「建立場景」按鈕
2. 應該跳轉到 `/attackAndDefence/create`
3. 表單應正常運作

---

**需要幫助？** 檢查 console 是否有錯誤訊息，或查看 `attackDefenceMockData.ts` 的原始碼。
