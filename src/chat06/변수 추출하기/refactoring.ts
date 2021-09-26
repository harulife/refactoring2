type Order = {
  quantity: number,
  itemPrice: number
}

function price(order: Order) {
  // 가격(price) = 기본 가격 - 수량 확인 + 배송비
  const basePrice = order.quantity * order.itemPrice;
  const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
  const shipping = Math.min(basePrice * 0.1, 100);
  return basePrice - quantityDiscount + shipping;
}
