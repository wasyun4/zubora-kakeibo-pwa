// 【CSV入出力】
// 収支データをCSVファイルで出力・入力するための操作エリアです。
type CsvPanelProps = {
    onExport: () => void;
    onImport: (file: File) => void;
};

function CsvPanel({
    onExport,
    onImport,
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

                <label className="file-select-button">
                    CSV入力

                    <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (file) {
                                onImport(file);
                            }

                            event.target.value = "";
                        }}
                    />
                </label>
            </div>

        </section>
    );
}

export default CsvPanel;