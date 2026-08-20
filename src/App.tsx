function App() {
  function handleExpenseClick() {
    alert("ボタンが押されたよ！");
  }
  return (
    <main>
      <h1>家計簿アプリ</h1>
      <p>ここから少しずつ作っていきます。</p>

      <label>
        金額
        <input type="number" placeholder="例：1000" />
      </label>
      
      <button onClick={handleExpenseClick}>
        支出を入力する
      </button>
    </main>
  );
}

export default App;
