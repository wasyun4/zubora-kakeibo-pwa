type CategoryTotal = {
  id: string;
  name: string;
  total: number;
};

type CategoryTotalsProps = {
  categoryTotals: CategoryTotal[];
};

function CategoryTotals({
  categoryTotals,
}: CategoryTotalsProps) {
  return (
    <section>
      <h2>カテゴリ別支出</h2>

      <ul>
        {categoryTotals.map((category) => (
          <li key={category.id}>
            {category.name}：{category.total}円
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CategoryTotals;