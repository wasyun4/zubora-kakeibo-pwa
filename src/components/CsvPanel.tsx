// 【CSV入出力】
// 収支データをCSVファイルで出力・入力するための操作エリアです。
type CsvPanelProps = {
    onExport: () => void;
};

function CsvPanel({
    onExport,
}: CsvPanelProps) {
    return (
        <section className="csv-panel">
            <h2>CSV入出力</h2>

            <p>
                収支データをCSVファイルに保存したり、
                CSVファイルから取り込んだりできます。
            </p>

            <div className="csv-panel-actions">
                <button type="button" onClick={onExport}>
                    CSV出力
                </button>

                <button type="button" disabled>
                    CSV入力
                </button>
            </div>

            <small>CSV入力機能は現在準備中です。</small>
        </section>
    );
}

export default CsvPanel;