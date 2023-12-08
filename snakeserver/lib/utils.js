function randomIntFromInterval(min,max){
  return Math.floor(Math.random() * (max-min+1) + min)
}

function reverseLinkedList(head) {
  let previous = null
  let current = head
  let temp = null
  while (current!= null){
      temp = current.next
      current.next = previous
      previous = current
      current = temp
  }
  return previous
}
const getRandomColor = () => {
  const getByte = () => Math.round(Math.random() * 255);
  return `rgb(${getByte()}, ${getByte()}, ${getByte()})`;
};
module.exports = { randomIntFromInterval, reverseLinkedList, getRandomColor };