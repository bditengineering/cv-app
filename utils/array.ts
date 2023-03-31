type ObjectKeyType = string | number | symbol;

export function groupBy<
  ItemType extends Record<KeyType, any>,
  KeyType extends ObjectKeyType,
>(arr: ReadonlyArray<ItemType>, key: KeyType | ((obj: ItemType) => KeyType)) {
  return arr.reduce((acc, curr) => {
    const groupByKey = typeof key === "function" ? key(curr) : curr[key];

    if (!acc[groupByKey]) {
      acc[groupByKey] = [curr];
    } else {
      acc[groupByKey].push(curr);
    }

    return acc;
  }, {} as Record<ObjectKeyType, Array<ItemType>>);
}
