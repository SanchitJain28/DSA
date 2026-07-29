import { createLogger } from "../../../utils/logger";
import { ListNode, sampleLinkedList } from "../intro/algorithm";

const logger = createLogger("odd-even-linked-list");

function oddEvenListUnoptimized(head: ListNode | null): ListNode | null {
    if(!head) return null
    const oddNodes : ListNode[] = []
    const evenNodes : ListNode[] = []
    let current = head
    let index = 1
    while(current){
        if(index % 2 == 1) oddNodes.push(current)
        else evenNodes.push(current)
        current = current.next!
        index++
    }
    const resultNodes = [...oddNodes , ...evenNodes]
    for(let i =0 ; i < resultNodes.length ; i++){
        resultNodes[i].next = resultNodes[i+1]
    }
    return resultNodes[0]
};

oddEvenListUnoptimized(sampleLinkedList(1,2,3,4,5,6))

function oddEvenList(head: ListNode | null): ListNode | null {
    if(head === null || head.next ===null) return head 
    let odd = head 
    let even = head.next 
    let evenHead = even
    while(even && even.next){
        odd.next = even.next 
        odd = odd.next
        even.next = odd.next
        even = even.next!
    }
    odd.next = evenHead
    return head
};
// Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.
// The first node is considered odd, and the second node is even, and so on.

// Note that the relative order inside both the even and odd groups should remain as it was in the input.

// You must solve the problem in O(1) extra space complexity and O(n) time complexity.

// Example 1:
// Input: head = [1,2,3,4,5]
// Output: [1,3,5,2,4]

// Example 2:
// Input: head = [2,1,3,5,6,4,7]
// Output: [2,3,6,7,1,5,4]

