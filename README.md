# 運行環境
- Windows Operation System (Virtual Environment)
# 軟體工具
- Python Web Framework
- Three.js 3D 頁面控制
- SweetAlert2 彈出式視窗
- Slick.js 圖片滑動
- Database : SQLite
# 資料集來源
[C3VD (Colonoscopy 3D Video Dataset)](https://durrlab.github.io/C3VD/)
# 實作流程
## 環境建置
### 1. 下載專案
在終端下載
```
git clone https://github.com/Anzheim/Colon_Report_Visual.git
```
或下載 .zip 壓縮檔
### 2. 建立虛擬環境
```
python -m venv [虛擬環境名稱]
```
e.g. 
python -m venv venv
### 3. 進入虛擬環境
```
[虛擬環境名稱]\Scripts\activate
```
e.g. `venv\Scripts\activate`
### 4. (補充)離開虛擬環境
```
deactivate
```
或
```
exit
```
---
### 套件下載（記得先切換到 requirements.txt 在的目錄）
```
pip install -r requirements.txt
```
## 啟動專案
```
python manage.py runserver
```
## 操作說明
專案啟動後，在大腸鏡檢查報告系統首頁選擇「新增病歷」，再選擇 「data 資料夾」並上傳資料到網站中，接著回首頁輸入病歷號 「F123456789」搜尋病歷，點選搜尋結果即可查看 3D 大腸鏡檢查報告頁面，操作方式是透過滑鼠滾輪前進後退、左鍵平移、右鍵旋轉，點擊白色標籤以查看病灶說明，點擊藍色標籤或畫面右上方面板可切換所在大腸區段位置，面板中也可以調整病灶標籤顯示的資訊。
