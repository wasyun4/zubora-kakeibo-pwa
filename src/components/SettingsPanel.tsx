// 【アプリ設定】
// 家計簿の月初め日など、アプリ全体の設定を変更する部品です。

type SettingsPanelProps = {
    monthStartDay: string;
    onMonthStartDayChange: (value: string) => void;
    onSave: () => void;
    onBackup: () => void;
};

function SettingsPanel({
    monthStartDay,
    onMonthStartDayChange,
    onSave,
    onBackup,
}: SettingsPanelProps) {
    return (
        <section>
            <h2>設定</h2>

            <h3>家計簿の月初め日</h3>

            <p>
                給料日などに合わせて、家計簿の1か月が始まる日を設定します。
            </p>

            <label>
                月初め日
                <input
                    type="number"
                    min="1"
                    max="28"
                    value={monthStartDay}
                    onChange={(event) =>
                        onMonthStartDayChange(event.target.value)
                    }
                />
            </label>

            <button type="button" onClick={onSave}>
                月初め日を保存する
            </button>

            <div className="settings-backup">
                <h3>バックアップと復元</h3>

                <p>
                    家計簿のデータをファイルに保存したり、
                    保存したファイルから復元したりできます。
                </p>

                <div className="settings-backup-actions">
                    <button type="button" onClick={onBackup}>
                        バックアップ
                    </button>

                    <button type="button" disabled>
                        復元
                    </button>
                </div>

                <small>復元機能は現在準備中です。</small>
            </div>
        </section>
    );
}

export default SettingsPanel;