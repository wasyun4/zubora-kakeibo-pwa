// 【アプリ設定】
// 家計簿の月初め日など、アプリ全体の設定を変更する部品です。

type SettingsPanelProps = {
    monthStartDay: string;
    onMonthStartDayChange: (value: string) => void;
    onSave: () => void;
};

function SettingsPanel({
    monthStartDay,
    onMonthStartDayChange,
    onSave,
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
        </section>
    );
}

export default SettingsPanel;