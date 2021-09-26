type Order = {
  quantity: number,
  itemPrice: number
}

function price(order: Order) {
  // 가격(price) = 기본 가격 - 수량 확인 + 배송비
  return order.quantity * order.itemPrice
    - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05
    + Math.min(order.quantity * order.itemPrice * 0.1, 100);
}
