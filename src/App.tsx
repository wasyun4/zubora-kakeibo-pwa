function App() {
  function handleExpenseClick() {
    alert("ボタンが押されたよ！");
  }
  return (
    <main>
      <h1>家計簿アプリ</h1>
      <p>ここから少しずつ作っていきます。</p>

      <button onClick={handleExpenseClick}>
        支出を入力する
      </button>
    </main>
  );
}

export default App;
